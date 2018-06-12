import * as NGL from 'ngl';
import { PickingProxy, Stage, StructureComponent, StructureRepresentationType } from 'ngl';
import * as React from 'react';
import { Button, GridRow } from 'semantic-ui-react';

import ResidueContext, { initialResidueContext, IResidueSelection } from '../context/ResidueContext';
import { RESIDUE_TYPE } from '../data/chell-data';
import { createBallStickRepresentation, createDistanceRepresentation } from '../helper/NGLHelper';
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

export const defaultNGLProps = {
  data: undefined as NGL.Structure | undefined,
  height: 400,
  ...initialResidueContext,
  padding: 0,
  width: 400,
};

export const initialNGLState = {
  residueOffset: 0,
  residueSelectionRepresentations: {} as IRepresentationDict,
  stage: undefined as NGL.Stage | undefined,
  structureComponent: undefined as NGL.StructureComponent | undefined,
};

export type NGLComponentProps = {} & typeof defaultNGLProps;
export type NGLComponentState = Readonly<typeof initialNGLState>;

export class NGLComponentClass extends React.Component<NGLComponentProps, NGLComponentState> {
  public readonly state: NGLComponentState = initialNGLState;

  public canvas: HTMLElement | null = null;

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
        residueSelectionRepresentations: {},
        stage: undefined,
      });
    }
  }

  public componentDidUpdate(prevProps: NGLComponentProps, prevState: NGLComponentState) {
    const { data, lockedResiduePairs } = this.props;
    const { stage, structureComponent } = this.state;

    const isNewData = data && data !== prevProps.data;
    if (data && stage && isNewData) {
      stage.removeAllComponents();
      this.addStructureToStage(data, stage);
    } else {
      if (structureComponent && prevProps.lockedResiduePairs !== lockedResiduePairs) {
        this.removeHighlights(structureComponent, prevProps.lockedResiduePairs);
        this.highlightResidues(structureComponent, lockedResiduePairs);
      }
      if (structureComponent && this.props.hoveredResidues !== prevProps.hoveredResidues) {
        this.removeNonLockedRepresentations(structureComponent);
        this.highlightResidues(structureComponent, this.props.hoveredResidues);
      }
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
    const structureComponent = stage.addComponentFromObject(data);
    /*
    TODO https://github.com/arose/ngl/issues/541
    data.eachResidue(outerResidue => {
      data.eachResidue(innerResidue => {
        if (outerResidue.resno !== innerResidue.resno) {
          const dist = outerResidue.distanceTo(innerResidue);
          console.log(`Distance between ${innerResidue.resno} and ${outerResidue.resno} is ${dist}`);
        }
      });
    });
    */
    this.setState({
      residueOffset: data.residueStore.resno[0],
      structureComponent,
    });

    stage.defaultFileRepresentation(structureComponent);

    structureComponent.stage.mouseControls.add(
      NGL.MouseActions.HOVER_PICK,
      (aStage: Stage, pickingProxy: PickingProxy) => this.onHover(aStage, pickingProxy),
    );

    stage.signals.clicked.add(this.onClick);
  }

  protected onHover(aStage: Stage, pickingProxy: PickingProxy) {
    const { structureComponent } = this.state;
    if (structureComponent && pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
      const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
      const resno = atom.resno + this.state.residueOffset;

      this.removeNonLockedRepresentations(structureComponent);

      this.highlightResidues(structureComponent, [resno]);
      this.props.addHoveredResidues([resno]);

      const { candidateResidues } = this.props;
      if (candidateResidues.length >= 1) {
        this.highlightResidues(structureComponent, [...candidateResidues, resno]);
      }
    }
  }

  protected onClick = (pickingProxy: PickingProxy) => {
    const {
      addCandidateResidues,
      addLockedResiduePair,
      candidateResidues,
      removeCandidateResidues,
      removeHoveredResidues,
    } = this.props;
    const { structureComponent } = this.state;

    if (pickingProxy && (pickingProxy.atom || pickingProxy.closestBondAtom)) {
      const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
      const resno = atom.resno + this.state.residueOffset;

      if (candidateResidues.length >= 1) {
        addLockedResiduePair([...candidateResidues, resno]);
        removeCandidateResidues();
      } else {
        addCandidateResidues([resno]);
      }
    } else if (structureComponent) {
      // User clicked off-structure, so clear non-locked residue state.
      this.removeNonLockedRepresentations(structureComponent);
      removeCandidateResidues();
      removeHoveredResidues();
    }
  };

  protected removeHighlights(structureComponent: StructureComponent, residues: IResidueSelection = {}) {
    const repDict = this.state.residueSelectionRepresentations;
    Object.keys(residues).forEach(prevKey => {
      repDict[prevKey].map(rep => structureComponent.removeRepresentation(rep));
    });
    this.setState({
      residueSelectionRepresentations: {},
    });
  }

  /**
   * Highlight a specific residue on a 3D structure.
   *
   * @param structureComponent The structure for which the residue to highlight belongs.
   * @param selection [NGL Selection](https://github.com/arose/ngl/blob/master/doc/usage/selection-language.md) for what to highlight.
   */
  protected highlightResidues(
    structureComponent: StructureComponent,
    residuesToHighlight: IResidueSelection | RESIDUE_TYPE[],
  ) {
    const { residueOffset } = this.state;
    const repDict = this.state.residueSelectionRepresentations;

    const allResidues = Array.isArray(residuesToHighlight) ? { 0: residuesToHighlight } : residuesToHighlight;
    Object.keys(allResidues).forEach(key => {
      const residues = allResidues[key];

      const residueKey = residues.toString();
      const residueWithOffset = residues.map(res => res - residueOffset);

      if (repDict[residueKey]) {
        repDict[residueKey].map(rep => structureComponent.removeRepresentation(rep));
      } else {
        repDict[residueKey] = [];
      }

      if (residueWithOffset.length >= 2) {
        const selection = residueWithOffset.join('.CA, ') + '.CA';
        repDict[residueKey].push(createDistanceRepresentation(structureComponent, selection));
      }

      if (residueWithOffset.length !== 0) {
        repDict[residueKey].push(createBallStickRepresentation(structureComponent, residueWithOffset));
      }
    });
    this.setState({
      residueSelectionRepresentations: repDict,
    });
  }

  protected removeNonLockedRepresentations(structureComponent: NGL.StructureComponent) {
    const repDict = this.state.residueSelectionRepresentations;
    for (const key of Object.keys(repDict)) {
      if (!this.props.lockedResiduePairs[key]) {
        repDict[key]
          .filter(rep => structureComponent.hasRepresentation(rep))
          .forEach(rep => structureComponent.removeRepresentation(rep));
        delete this.state.residueSelectionRepresentations[key];
      }
    }
  }
}

export const NGLComponentWithDefaultProps = withDefaultProps(defaultNGLProps, NGLComponentClass);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultNGLProps> & Required<Omit<NGLComponentProps, keyof typeof defaultNGLProps>>;

const NGLComponent = (props: requiredProps) => (
  <ResidueContext.Consumer>
    {context => <NGLComponentWithDefaultProps {...props} {...context} />}
  </ResidueContext.Consumer>
);

export default NGLComponent;
export { NGLComponent };
