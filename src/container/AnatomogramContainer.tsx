// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import { Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createToggleableActions } from '~chell-viz~/action';
import { ComponentCard } from '~chell-viz~/component';
import { ChellVisualization } from '~chell-viz~/container';
import { AnatomogramMapping, CHELL_CSS_STYLE, SPECIES_TYPE } from '~chell-viz~/data';
import { LabeledCellsState, ToggleableReducer } from '~chell-viz~/reducer';

interface IAnatomogramContainerProps {
  height: number | string;
  selectIds: Set<string>;
  species: SPECIES_TYPE;
  style: CHELL_CSS_STYLE;
  width: number | string;
  addLabel(label: string): void;
}

interface IAnatomogramContainerState {
  ids: string[];
}

class AnatomogramContainerClass extends ChellVisualization<IAnatomogramContainerProps, IAnatomogramContainerState> {
  public static defaultProps = {
    height: '300px',
    style: {},
    width: '400px',
  };

  public static displayName = 'Anatomogram';

  protected divRef: HTMLDivElement | null = null;
  protected svgIntervalTimer: number | null = null;

  constructor(props: IAnatomogramContainerProps) {
    super(props);
    this.state = {
      ids: this.deriveIdsFromSpecies(props.species),
    };
  }

  public componentDidMount() {
    // We are __currently__ unable to known when Anatomogram finishes loading the svg.
    // So, we have to wait.
    this.svgIntervalTimer = window.setInterval(this.resizeSVGElement, 1000 / 60);
    ToggleableReducer('anat');
  }

  public componentWillUnmount() {
    if (this.svgIntervalTimer) {
      clearInterval(this.svgIntervalTimer);
      this.svgIntervalTimer = null;
    }
  }

  public componentDidUpdate(prevProps: IAnatomogramContainerProps) {
    const { species } = this.props;
    if (species !== prevProps.species) {
      this.setState({
        ids: this.deriveIdsFromSpecies(species),
      });
    }
    this.resizeSVGElement();
  }

  public render() {
    const { species, selectIds } = this.props;
    const { ids } = this.state;
    console.log(ids);

    return (
      <div
        className={'anatomogram-container'}
        ref={node => {
          if (node) {
            this.divRef = node.getElementsByTagName('div')[0];
          }
        }}
      >
        <ComponentCard componentName={'Anatomogram'}>
          <Anatomogram
            atlasUrl={``}
            highlightColour={'yellow'}
            onClick={this.onClick}
            onMouseOut={this.onMouseOut}
            onMouseOver={this.onMouseOver}
            selectColour={'ffaa00'}
            selectIds={selectIds.toArray()}
            showIds={ids}
            species={species}
            selectedView={species === 'mus_musculus' ? 'female' : 'male'}
          />
        </ComponentCard>
      </div>
    );
  }

  protected onClick = (ids: string[]) => {
    const { addLabel } = this.props;
    addLabel(ids[0]);
  };

  protected deriveIdsFromSpecies = (species: SPECIES_TYPE) => Object.keys(AnatomogramMapping[species]);

  protected onMouseOut = (id: string) => {
    return;
  };

  protected onMouseOver = (id: string) => {
    return;
  };

  protected parseCategory = (category: string) => {
    const splitCategories = category.split(/-|_/);

    return splitCategories[0];
  };

  protected resizeSVGElement = () => {
    if (this.divRef) {
      const svgElements = this.divRef.getElementsByTagName('svg');
      if (svgElements.length >= 1) {
        const svgElement = svgElements[0];
        const isSvgHeightBigger = svgElement.height.baseVal.value > svgElement.width.baseVal.value;

        // The Anatomogram Component internally sets the svg height to 'auto'.
        // So, to allow more flexibility in sizing it, we have to manually override it here. Sorry.
        svgElement.style.height = isSvgHeightBigger ? `calc(${this.divRef.style.height} - 50px)` : 'auto';
        svgElement.style.padding = '0';
        svgElement.style.width = isSvgHeightBigger ? 'auto' : `calc(${this.divRef.style.width} - 75px)`;
      }
    }
  };
}

const mapStateToProps = (state: { labeledCells: LabeledCellsState; anat?: { items: Set<string> } }) => ({
  selectIds: state.anat ? state.anat.items : Set<string>('foo'),
  species: state.labeledCells.species,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addLabel: createToggleableActions<string>().add,
    },
    dispatch,
  );

export const AnatomogramContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnatomogramContainerClass);
