// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import { Set } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createContainerActions } from '~chell-viz~/action';
import { ComponentCard } from '~chell-viz~/component';
import { ChellVisualization } from '~chell-viz~/container';
import { AnatomogramMapping, CHELL_CSS_STYLE, SPECIES_TYPE } from '~chell-viz~/data';
import { ChellMiddlewareTransformer, RootState } from '~chell-viz~/reducer';
import { selectCurrentItems } from '~chell-viz~/selector/ContainerSelectors';
import { getSpecies, getSpring } from '~chell-viz~/selector/SpringSelectors';

interface IAnatomogramContainerProps {
  height: number | string;
  selectIds: Set<string>;
  species: SPECIES_TYPE;
  style: CHELL_CSS_STYLE;
  width: number | string;
  addLabel(label: string): void;
  removeLabel(label: string): void;
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

  public setupDataServices() {
    this.addDatasets(['cells', 'labels']);
    ChellMiddlewareTransformer.addTransform('labels', 'cells', state => {
      const anatomogramMap = AnatomogramMapping[this.props.species];
      let candidateLabels = Set<string>();
      this.props.selectIds.forEach(id => {
        candidateLabels = id && anatomogramMap[id] ? candidateLabels.merge(anatomogramMap[id]) : candidateLabels;
      });

      let cellIndices = Set<number>();
      getSpring(state).graphData.nodes.forEach(node => {
        candidateLabels.forEach(label => {
          if (label && Object.values(node.labelForCategory).includes(label)) {
            cellIndices = cellIndices.add(node.number);

            return;
          }
        });
      });

      return cellIndices;
    });
    ChellMiddlewareTransformer.addTransform('cells', 'labels', state => {
      const { species } = this.props;
      const currentCells = selectCurrentItems<number>(state, 'cells').toArray();
      const { category, graphData } = getSpring(state);
      let result = Set<string>();

      for (const cellIndex of currentCells) {
        const labelForCategory = graphData.nodes[cellIndex] ? graphData.nodes[cellIndex].labelForCategory : {};

        const labels = AnatomogramMapping[species][labelForCategory[category]];
        if (labels) {
          labels.forEach(label => (result = result.add(label)));
        }

        for (const id of Object.keys(AnatomogramMapping[species])) {
          for (const label of Object.values(labelForCategory)) {
            if (AnatomogramMapping[species][id].includes(label)) {
              result = result.add(id);
            }
          }
        }
      }

      return result;
    });
  }

  public componentDidMount() {
    // We are __currently__ unable to known when Anatomogram finishes loading the svg.
    // So, we have to wait.
    this.svgIntervalTimer = window.setInterval(this.resizeSVGElement, 1000 / 60);
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
    // Anatomogram returns an array of strings for click events, but we only ever work with a single id.
    const id = ids[0];
    const { addLabel, removeLabel, selectIds } = this.props;

    if (selectIds.includes(id)) {
      removeLabel(id);
    } else {
      addLabel(id);
    }
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

const mapStateToProps = (state: RootState) => ({
  selectIds: selectCurrentItems<string>(state, 'labels'),
  species: getSpecies(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addLabel: createContainerActions<string>('labels').add,
      removeLabel: createContainerActions<string>('labels').remove,
    },
    dispatch,
  );

export const AnatomogramContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnatomogramContainerClass);
