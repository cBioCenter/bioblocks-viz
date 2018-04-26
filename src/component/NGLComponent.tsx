import * as NGL from 'ngl';
import * as React from 'react';

import { PickingProxy, Stage, StructureComponent, StructureRepresentationType } from 'ngl';
import { initialResidueContext, ResidueContext } from '../context/ResidueContext';
import { withDefaultProps } from '../helper/ReactHelper';

export type NGL_HOVER_CB_RESULT_TYPE = number;

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

type Props = {} & Partial<typeof defaultProps>;
type State = Readonly<typeof initialState>;

export const NGLComponentClass = withDefaultProps(
  defaultProps,
  class NGLComponentInnerClass extends React.Component<Props, State> {
    public readonly state: State = initialState;

    protected canvas: HTMLElement | null = null;
    protected residueSelectionRepresentations: { [key: string]: NGL.RepresentationElement[] } = {};

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
          this.setupStage(data, stage);
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
      const { data, currentResidueSelections } = this.props;
      const { residueOffset, stage, structureComponent } = this.state;

      const isNewData = data && data !== prevProps.data;
      if (stage && isNewData) {
        stage.removeAllComponents();
      }
      if (stage && isNewData && data) {
        this.setupStage(data, stage);
      } else if (
        currentResidueSelections &&
        currentResidueSelections !== prevProps.currentResidueSelections &&
        structureComponent
      ) {
        Object.keys(currentResidueSelections).forEach(key => {
          this.highlightElement(structureComponent, currentResidueSelections[key].map(res => res - residueOffset));
        });
      } else if (structureComponent) {
        const representations = this.residueSelectionRepresentations;
        Object.keys(representations).forEach(key => {
          representations[key].forEach(rep => structureComponent.removeRepresentation(rep));
        });
      }
    }

    public render() {
      return (
        <div id="NGLComponent" style={{ padding: 15 }}>
          <div ref={el => (this.canvas = el)} style={{ height: 370, width: 370 }} />
        </div>
      );
    }

    protected setupStage(data: NGL.Structure, stage: NGL.Stage) {
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
        this.props.addNewResidues!([resno]);
      }
    }

    /**
     * Highlight a specific residue on a 3D structure.
     *
     * @protected
     * @param {StructureComponent} structureComponent The structure for which the residue to highlight belongs.
     * @param {string} selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
     * @memberof NGLComponent
     */
    protected highlightElement(structureComponent: StructureComponent, residues: number[]) {
      const residueKey = residues.toString();
      const representations = this.residueSelectionRepresentations;
      if (representations[residueKey]) {
        representations[residueKey].map(rep => structureComponent.removeRepresentation(rep));
      } else {
        representations[residueKey] = [];
      }

      const selection = residues.join('.CA, ') + '.CA';
      if (residues.length >= 2) {
        representations[residueKey].push(
          structureComponent.addRepresentation('distance', {
            atomPair: [selection.split(',')],
            color: 'skyblue',
            labelUnit: 'nm',
          }),
        );
      }

      representations[residueKey].push(
        structureComponent.addRepresentation('ball+stick', {
          sele: residues.join(', '),
        }),
      );
    }
  },
);

export const NGLComponent = (props: Props) => (
  <ResidueContext.Consumer>
    {({ addNewResidues, currentResidueSelections }) => (
      <NGLComponentClass
        {...props}
        addNewResidues={addNewResidues}
        currentResidueSelections={currentResidueSelections}
      />
    )}
  </ResidueContext.Consumer>
);
