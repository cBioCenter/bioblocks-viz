import * as NGL from 'ngl';
import * as React from 'react';

import { PickingProxy, Stage, StructureComponent, StructureRepresentationType } from 'ngl';
import { initialResidueContext, ResidueContext } from '../context/ResidueContext';
import { withDefaultProps } from '../helper/ReactHelper';

export type NGL_HOVER_CB_RESULT_TYPE = number;

export interface IRepresentationDict {
  [key: string]: NGL.RepresentationElement[];
}

export const SUPPORTED_REPS: StructureRepresentationType[] = [
  'axes',
  'backbone',
  'ball+stick',
  'distance',
  'label',
  'line',
  'hyperball',
  'spacefill',
];

const defaultProps = {
  data: undefined as NGL.Structure | undefined,
  ...initialResidueContext,
};

const initialState = {
  max_x: 0,
  min_x: 1000,
  nodeSize: 4,
  probabilityFilter: 0.99,
  residueOffset: 0,
  stage: undefined as NGL.Stage | undefined,
  structureComponent: undefined as NGL.StructureComponent | undefined,
};

type Props = {} & typeof defaultProps;
type State = Readonly<typeof initialState>;

export const NGLComponentWithDefaultProps = withDefaultProps(
  defaultProps,
  class NGLComponentClass extends React.Component<Props, State> {
    public readonly state: State = initialState;

    protected canvas: HTMLElement | null = null;
    protected residueSelectionRepresentations: IRepresentationDict = {};

    constructor(props: any) {
      super(props);
    }

    public componentDidMount() {
      if (this.canvas) {
        const stage = new NGL.Stage(this.canvas);

        this.setState({
          stage,
        });

        const { data } = this.props;
        if (data) {
          this.addStructureToStage(data, stage);
        }
      }
    }

    public componentWillUnmount() {
      const { stage } = this.state;
      if (stage) {
        stage.dispose();
        this.setState({
          stage: undefined,
        });
      }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
      const { data, lockedResiduePairs } = this.props;
      const { stage, structureComponent } = this.state;

      const isNewData = data && data !== prevProps.data;
      if (data && stage && isNewData) {
        stage.removeAllComponents();
        this.addStructureToStage(data, stage);
      }

      if (structureComponent) {
        Object.keys(lockedResiduePairs).forEach(key => {
          this.highlightElement(structureComponent, lockedResiduePairs[key]);
        });
      }
    }

    /**
     * Renders the NGL canvas.
     *
     * Because we are working with WebGL via the canvas, updating this visualization happens through the canvas reference.
     *
     * @returns The NGL Component
     * @memberof NGLComponentClass
     */
    public render() {
      return (
        <div id="NGLComponent" style={{ padding: 15 }}>
          <div ref={el => (this.canvas = el)} style={{ height: 370, width: 370 }} />
        </div>
      );
    }

    /**
     * Adds a NGL structure to the stage.
     *
     * @protected
     * @param {NGL.Structure} data
     * @param {NGL.Stage} stage
     * @memberof NGLComponentClass
     */
    protected addStructureToStage(data: NGL.Structure, stage: NGL.Stage) {
      const structureComponent = stage.addComponentFromObject(data) as NGL.StructureComponent;

      this.setState({
        residueOffset: data.residueStore.resno[0],
        structureComponent,
      });

      stage.defaultFileRepresentation(structureComponent);
      structureComponent.reprList.forEach(rep => {
        rep.setParameters({ opacity: 1.0 });
      });

      structureComponent.stage.mouseControls.add(
        NGL.MouseActions.HOVER_PICK,
        (aStage: Stage, pickingProxy: PickingProxy) => this.onHover(aStage, pickingProxy, data, structureComponent),
      );

      stage.signals.clicked.add(this.onClick);
    }

    protected onHover(
      aStage: Stage,
      pickingProxy: PickingProxy,
      data: NGL.Structure,
      structureComponent: StructureComponent,
    ) {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resno = atom.resno + this.state.residueOffset;

        this.removeNonLockedRepresentations(structureComponent);
        this.highlightElement(structureComponent, [resno]);

        const { candidateResidue } = this.props;
        if (candidateResidue !== 'none') {
          this.highlightElement(structureComponent, [candidateResidue, resno]);
        }
      }
    }

    protected onClick = (pickingProxy: PickingProxy) => {
      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resno = atom.resno + this.state.residueOffset;

        const { addCandidateResidue, addLockedResiduePair, candidateResidue, removeCandidateResidue } = this.props;

        if (candidateResidue !== 'none') {
          addLockedResiduePair([candidateResidue, resno]);
          removeCandidateResidue();
        } else {
          addCandidateResidue(resno);
        }
      }
    };

    /**
     * Highlight a specific residue on a 3D structure.
     *
     * @protected
     * @param {StructureComponent} structureComponent The structure for which the residue to highlight belongs.
     * @param {string} selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
     * @memberof NGLComponent
     */
    protected highlightElement(structureComponent: StructureComponent, residues: number[]) {
      const { residueOffset } = this.state;
      const residueKey = residues.toString();
      const residueWithOffset = residues.map(res => res - residueOffset);
      const repDict = this.residueSelectionRepresentations;

      if (repDict[residueKey]) {
        repDict[residueKey].map(rep => structureComponent.removeRepresentation(rep));
      } else {
        repDict[residueKey] = [];
      }

      const selection = residueWithOffset.join('.CA, ') + '.CA';
      if (residueWithOffset.length >= 2) {
        repDict[residueKey].push(
          structureComponent.addRepresentation('distance', {
            atomPair: [selection.split(',')],
            color: 'skyblue',
            labelUnit: 'nm',
          }),
        );
      }

      repDict[residueKey].push(
        structureComponent.addRepresentation('ball+stick', {
          sele: residueWithOffset.join(', '),
        }),
      );
    }

    protected removeNonLockedRepresentations(structureComponent: NGL.StructureComponent) {
      const repDict = this.residueSelectionRepresentations;
      for (const key of Object.keys(repDict)) {
        if (!this.props.lockedResiduePairs[key]) {
          repDict[key].forEach(rep => structureComponent.removeRepresentation(rep));
          delete this.residueSelectionRepresentations[key];
        }
      }
    }
  },
);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultProps> & Required<Omit<Props, keyof typeof defaultProps>>;

export const NGLComponent = (props: requiredProps) => (
  <ResidueContext.Consumer>
    {({
      addLockedResiduePair,
      addCandidateResidue,
      candidateResidue,
      lockedResiduePairs,
      removeAllLockedResiduePairs,
      removeCandidateResidue,
    }) => (
      <NGLComponentWithDefaultProps
        {...props}
        addCandidateResidue={addCandidateResidue}
        addLockedResiduePair={addLockedResiduePair}
        candidateResidue={candidateResidue}
        lockedResiduePairs={lockedResiduePairs}
        removeAllLockedResiduePairs={removeAllLockedResiduePairs}
        removeCandidateResidue={removeCandidateResidue}
      />
    )}
  </ResidueContext.Consumer>
);
