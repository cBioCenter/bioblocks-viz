// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import { Set } from 'immutable';
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createContainerActions } from '~bioblocks-viz~/action';
import { ComponentCard } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import { AnatomogramMapping, SPECIES_TYPE } from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION } from '~bioblocks-viz~/helper';
import { BBStore, BioblocksMiddlewareTransformer, RootState } from '~bioblocks-viz~/reducer';
import { getSpring, selectCurrentItems } from '~bioblocks-viz~/selector';

interface IAnatomogramContainerProps {
  iconSrc?: string;
  selectIds: Set<string>;
  species: SPECIES_TYPE;
  addLabel(label: string): void;
  removeLabel(label: string): void;
}

interface IAnatomogramContainerState {
  ids: string[];
}

export class AnatomogramContainerClass extends BioblocksVisualization<
  IAnatomogramContainerProps,
  IAnatomogramContainerState
> {
  public static defaultProps = {
    addLabel: EMPTY_FUNCTION,
    removeLabel: EMPTY_FUNCTION,
    selectIds: Set<string>(),
  };

  public static displayName = 'Anatomogram';

  protected divRef: HTMLDivElement | null = null;

  constructor(props: IAnatomogramContainerProps) {
    super(props);
    this.state = {
      ids: this.deriveIdsFromSpecies(props.species),
    };
  }

  public setupDataServices() {
    this.registerDataset('cells', []);
    this.registerDataset('labels', []);
    BioblocksMiddlewareTransformer.addTransform({
      fn: state => {
        const { species, selectIds } = this.props;
        const { graphData } = getSpring(state);
        const anatomogramMap = AnatomogramMapping[species];
        let candidateLabels = Set<string>();
        selectIds.forEach(id => {
          candidateLabels = id && anatomogramMap[id] ? candidateLabels.merge(anatomogramMap[id]) : candidateLabels;
        });

        let cellIndices = Set<number>();
        graphData.nodes.forEach(node => {
          candidateLabels.forEach(label => {
            if (label && Object.values(node.labelForCategory).includes(label)) {
              cellIndices = cellIndices.add(node.number);

              return;
            }
          });
        });

        return cellIndices;
      },
      fromState: 'bioblocks/labels',
      toState: 'bioblocks/cells',
    });
    BioblocksMiddlewareTransformer.addTransform({
      fn: state => {
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
      },
      fromState: { stateName: 'cells' },
      toState: { stateName: 'labels' },
    });
  }

  public componentDidUpdate(prevProps: IAnatomogramContainerProps) {
    const { species } = this.props;
    if (species !== prevProps.species) {
      this.setState({
        ids: this.deriveIdsFromSpecies(species),
      });
    }
  }

  public render() {
    const { iconSrc, species, selectIds } = this.props;
    const { ids } = this.state;

    return (
      <Provider store={BBStore}>
        <div
          className={'anatomogram-container'}
          ref={node => {
            if (node) {
              this.divRef = node.getElementsByTagName('div')[0];
            }
          }}
        >
          <ComponentCard componentName={'Anatomogram'} iconSrc={iconSrc}>
            <Anatomogram
              atlasUrl={``}
              highlightColour={'yellow'}
              onClick={this.onClick}
              onInjected={this.resizeSVGElement}
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
      </Provider>
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

  protected resizeSVGElement = (error: any, svgDomNode: SVGSVGElement) => {
    if (this.divRef) {
      const isSvgHeightBigger = svgDomNode.height.baseVal.value > svgDomNode.width.baseVal.value;

      // The Anatomogram Component internally sets the svg height to 'auto'.
      // So, to allow more flexibility in sizing it, we have to manually override it here. Sorry.
      svgDomNode.style.height = isSvgHeightBigger ? `calc(${this.divRef.style.height} - 50px)` : 'auto';
      svgDomNode.style.padding = '0';
      svgDomNode.style.width = isSvgHeightBigger ? 'auto' : `calc(${this.divRef.style.width} - 75px)`;
    }
  };
}

const mapStateToProps = (state: RootState) => ({
  selectIds: selectCurrentItems<string>(state, 'labels'),
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
