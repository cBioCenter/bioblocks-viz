import * as NGL from 'ngl';
import { PickingProxy, Stage, StructureComponent, StructureRepresentationType } from 'ngl';
import * as React from 'react';
import { Button, GridRow } from 'semantic-ui-react';

import { initialResidueContext, IResidueSelection, ResidueContext } from '../context/ResidueContext';
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
  height: 400,
  ...initialResidueContext,
  padding: 0,
  width: 400,
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

      if (structureComponent && prevProps.lockedResiduePairs !== lockedResiduePairs) {
        this.removeHighlights(structureComponent, prevProps.lockedResiduePairs);
        Object.keys(lockedResiduePairs).forEach(key => {
          this.highlightElement(structureComponent, lockedResiduePairs[key]);
        });
      }

      if (
        structureComponent &&
        this.props.hoveredResidue !== 'none' &&
        this.props.hoveredResidue !== prevProps.hoveredResidue
      ) {
        this.removeNonLockedRepresentations(structureComponent);
        this.highlightElement(structureComponent, [this.props.hoveredResidue]);
      }
    }

    /**
     * Renders the NGL canvas.
     *
     * Because we are working with WebGL via the canvas, updating this visualization happens through the canvas reference.
     *
     * @returns The NGL Component
     */
    public render() {
      const { height, padding, width } = this.props;
      return (
        <div id="NGLComponent" style={{ padding }}>
          <div ref={el => (this.canvas = el)} style={{ height, width }} />
          <GridRow>
            <Button onClick={this.props.removeAllLockedResiduePairs}>Remove Locked Residues</Button>
          </GridRow>
        </div>
      );
    }

    /**
     * Adds a NGL structure to the stage.
     *
     * @param data A NGL Structure.
     * @param stage A NGL Stage.
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
        this.props.addHoveredResidue(resno);

        const { candidateResidue } = this.props;
        if (candidateResidue !== 'none') {
          this.highlightElement(structureComponent, [candidateResidue, resno]);
        }
      }
    }

    protected onClick = (pickingProxy: PickingProxy) => {
      const {
        addCandidateResidue,
        addLockedResiduePair,
        candidateResidue,
        removeCandidateResidue,
        removeHoveredResidue,
      } = this.props;
      const { structureComponent } = this.state;

      if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
        const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
        const resno = atom.resno + this.state.residueOffset;

        if (candidateResidue !== 'none') {
          addLockedResiduePair([candidateResidue, resno]);
          removeCandidateResidue();
        } else {
          addCandidateResidue(resno);
        }
      } else if (structureComponent) {
        // User clicked off-structure, so clear non-locked residue state.
        this.removeNonLockedRepresentations(structureComponent);
        removeCandidateResidue();
        removeHoveredResidue();
      }
    };

    protected removeHighlights(structureComponent: StructureComponent, residues: IResidueSelection) {
      const repDict = this.residueSelectionRepresentations;
      Object.keys(residues).forEach(prevKey => {
        repDict[prevKey].map(rep => structureComponent.removeRepresentation(rep));
      });
    }

    /**
     * Highlight a specific residue on a 3D structure.
     *
     * @param structureComponent The structure for which the residue to highlight belongs.
     * @param selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
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
      addHoveredResidue,
      addCandidateResidue,
      candidateResidue,
      hoveredResidue,
      lockedResiduePairs,
      removeAllLockedResiduePairs,
      removeCandidateResidue,
      removeHoveredResidue,
    }) => (
      <NGLComponentWithDefaultProps
        {...props}
        addCandidateResidue={addCandidateResidue}
        addHoveredResidue={addHoveredResidue}
        addLockedResiduePair={addLockedResiduePair}
        candidateResidue={candidateResidue}
        hoveredResidue={hoveredResidue}
        lockedResiduePairs={lockedResiduePairs}
        removeAllLockedResiduePairs={removeAllLockedResiduePairs}
        removeCandidateResidue={removeCandidateResidue}
        removeHoveredResidue={removeHoveredResidue}
      />
    )}
  </ResidueContext.Consumer>
);
