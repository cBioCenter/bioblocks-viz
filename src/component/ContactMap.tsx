import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { createContainerActions, createResiduePairActions } from '~bioblocks-viz~/action';
import {
  ComponentCard,
  ContactMapChart,
  generateChartDataEntry,
  IContactMapChartData,
  IContactMapChartPoint,
} from '~bioblocks-viz~/component';
import {
  BIOBLOCKS_CSS_STYLE,
  BioblocksChartEvent,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CouplingContainer,
  IContactMapData,
  ICouplingScore,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_KEYS,
  SECONDARY_STRUCTURE_SECTION,
  SliderWidgetConfig,
} from '~bioblocks-viz~/data';
import { ColorMapper, EMPTY_FUNCTION } from '~bioblocks-viz~/helper';
import { ILockedResiduePair } from '~bioblocks-viz~/reducer';
import { getCandidates, getHovered, getLocked, selectCurrentItems } from '~bioblocks-viz~/selector';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export interface IContactMapProps {
  candidateResidues: RESIDUE_TYPE[];
  configurations: BioblocksWidgetConfig[];
  data: IContactMapData;
  formattedPoints: IContactMapChartData[];
  height: number | string;
  highlightColor: string;
  hoveredResidues: RESIDUE_TYPE[];
  hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  isDataLoading: boolean;
  lockedResiduePairs: ILockedResiduePair;
  observedColor: string;
  secondaryStructureColors?: ColorMapper<SECONDARY_STRUCTURE_KEYS>;
  selectedSecondaryStructures: SECONDARY_STRUCTURE;
  showConfigurations: boolean;
  style?: BIOBLOCKS_CSS_STYLE;
  width: number | string;
  addHoveredResidues(residues: RESIDUE_TYPE[]): void;
  addHoveredSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  addSelectedSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  removeAllLockedResiduePairs(): void;
  removeSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  removeHoveredResidues(): void;
  removeHoveredSecondaryStructure(section: SECONDARY_STRUCTURE_SECTION): void;
  onBoxSelection?(residues: RESIDUE_TYPE[]): void;
  toggleLockedResiduePair(residuePair: ILockedResiduePair): void;
}

export const initialContactMapState = {
  pointsToPlot: new Array<IContactMapChartData>(),
};

export type ContactMapState = Readonly<typeof initialContactMapState>;

export class ContactMapClass extends React.Component<IContactMapProps, ContactMapState> {
  public static defaultProps = {
    addHoveredResidues: EMPTY_FUNCTION,
    addHoveredSecondaryStructure: EMPTY_FUNCTION,
    addSelectedSecondaryStructure: EMPTY_FUNCTION,
    candidateResidues: [],
    configurations: new Array<BioblocksWidgetConfig>(),
    data: {
      couplingScores: new CouplingContainer(),
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    enableSliders: true,
    formattedPoints: new Array<IContactMapChartData>(),
    height: '100%',
    highlightColor: '#ff8800',
    hoveredResidues: [],
    hoveredSecondaryStructures: [],
    isDataLoading: false,
    lockedResiduePairs: {},
    observedColor: '#0000ff',
    removeAllLockedResiduePairs: EMPTY_FUNCTION,
    removeHoveredResidues: EMPTY_FUNCTION,
    removeHoveredSecondaryStructure: EMPTY_FUNCTION,
    removeSecondaryStructure: EMPTY_FUNCTION,
    selectedSecondaryStructures: [],
    showConfigurations: true,
    toggleLockedResiduePair: EMPTY_FUNCTION,
    width: '100%',
  };

  public readonly state: ContactMapState = initialContactMapState;

  constructor(props: IContactMapProps) {
    super(props);
  }

  public componentDidMount() {
    this.setupPointsToPlot(this.props.data.couplingScores);
  }

  public componentDidUpdate(prevProps: IContactMapProps) {
    const { data, lockedResiduePairs } = this.props;
    if (data !== prevProps.data || lockedResiduePairs !== prevProps.lockedResiduePairs) {
      this.setupPointsToPlot(data.couplingScores);
    }
  }

  public onNodeSizeChange = (index: number) => (value: number) => {
    const { pointsToPlot } = this.state;

    this.setState({
      pointsToPlot: [
        ...pointsToPlot.slice(0, index),
        {
          ...pointsToPlot[index],
          nodeSize: value,
        },
        ...pointsToPlot.slice(index + 1),
      ],
    });
  };

  public render() {
    const { pointsToPlot } = this.state;

    return this.renderContactMapChart(pointsToPlot);
  }

  protected generateNodeSizeSliderConfigs = (entries: IContactMapChartData[]) =>
    entries.map(
      (entry, index): SliderWidgetConfig => {
        return {
          id: `node-size-slider-${index}`,
          name: `Node size for ${entry.name}`,
          onChange: this.onNodeSizeChange(index),
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: entry.nodeSize,
            defaultValue: 4,
            max: 20,
            min: 1,
          },
        };
      },
    );

  protected getFilterConfigs = (): BioblocksWidgetConfig[] => {
    const { configurations } = this.props;

    return [
      ...configurations,
      /*
      {
        name: 'Maximum Rank',
        onChange: this.onLinearDistFilterChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: this.state.linearDistFilter,
          defaultValue: 5,
          max: 10,
          min: 1,
        },
      },
      {
        name: 'Top N Predictions to Show',
        onChange: this.onNumPredictionsToShowChange(),
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: this.state.numPredictionsToShow,
          defaultValue: 100,
          max: this.props.data.couplingScores.chainLength,
          min: 1,
        },
      },
      */
    ];
  };

  protected getSettingsConfigs = (): BioblocksWidgetConfig[] => {
    const { removeAllLockedResiduePairs } = this.props;
    const { pointsToPlot } = this.state;

    return [
      {
        name: 'Clear Selections',
        onClick: removeAllLockedResiduePairs,
        type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
      },
      ...this.generateNodeSizeSliderConfigs(pointsToPlot),
    ];
  };

  protected onMouseClick = (cb: (residues: ILockedResiduePair) => void) => (e: BioblocksChartEvent) => {
    if (e.isAxis()) {
      const { addSelectedSecondaryStructure, data, removeSecondaryStructure, selectedSecondaryStructures } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            if (selectedSecondaryStructures.includes(section)) {
              removeSecondaryStructure(section);
            } else {
              addSelectedSecondaryStructure(section);
            }
          }
        }
      }
    } else {
      cb({ [e.selectedPoints.sort().toString()]: e.selectedPoints });
    }
  };

  protected onMouseEnter = (cb: (residue: RESIDUE_TYPE[]) => void) => (e: BioblocksChartEvent) => {
    if (e.isAxis()) {
      const { addHoveredSecondaryStructure, hoveredSecondaryStructures, data } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (
            section.contains(...e.selectedPoints) &&
            !hoveredSecondaryStructures.find(
              secStruct =>
                secStruct.end === section.end && secStruct.label === section.label && secStruct.start === section.start,
            )
          ) {
            addHoveredSecondaryStructure(section);
          }
        }
      }
    } else {
      cb(e.selectedPoints);
    }
  };

  protected onMouseLeave = (cb?: (residue: RESIDUE_TYPE[]) => void) => (e: BioblocksChartEvent) => {
    if (e.isAxis()) {
      const { data, hoveredSecondaryStructures, removeHoveredSecondaryStructure } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          const searchResult = hoveredSecondaryStructures.find(
            secStruct =>
              secStruct.end === section.end && secStruct.label === section.label && secStruct.start === section.start,
          );
          if (section.contains(...e.selectedPoints) && searchResult) {
            removeHoveredSecondaryStructure(searchResult);
          }
        }
      }
    } else if (cb) {
      cb(e.selectedPoints);
    }
  };

  protected onMouseSelect = (cb?: (residues: RESIDUE_TYPE[]) => void) => (e: BioblocksChartEvent) => {
    if (cb) {
      // For the contact map, all the x/y values are mirrored and correspond directly with i/j values.
      // Thus, all the residue numbers can be obtained by getting either all x or values from ths selected points.
      cb(e.selectedPoints.map(point => point));
    }
  };

  protected renderContactMapChart(pointsToPlot: IContactMapChartData[]) {
    const {
      addHoveredResidues,
      candidateResidues,
      data,
      height,
      isDataLoading,
      onBoxSelection,
      removeHoveredResidues,
      secondaryStructureColors,
      selectedSecondaryStructures,
      showConfigurations,
      toggleLockedResiduePair,
      width,
    } = this.props;

    return (
      <ComponentCard
        componentName={'Contact Map'}
        menuItems={[
          {
            component: {
              configs: this.getFilterConfigs(),
              name: 'POPUP',
            },
            description: 'Filter',
            iconName: 'filter',
          },
          {
            component: {
              configs: this.getSettingsConfigs(),
              name: 'POPUP',
            },
            description: 'Settings',
          },
        ]}
      >
        <ContactMapChart
          candidateResidues={candidateResidues}
          contactData={pointsToPlot}
          height={height}
          isDataLoading={isDataLoading}
          onClickCallback={this.onMouseClick(toggleLockedResiduePair)}
          onHoverCallback={this.onMouseEnter(addHoveredResidues)}
          onSelectedCallback={this.onMouseSelect(onBoxSelection)}
          onUnHoverCallback={this.onMouseLeave(removeHoveredResidues)}
          range={data.couplingScores.residueIndexRange.max + 20}
          secondaryStructures={data.secondaryStructures ? data.secondaryStructures : []}
          secondaryStructureColors={secondaryStructureColors}
          selectedSecondaryStructures={[selectedSecondaryStructures]}
          showConfigurations={showConfigurations}
          width={width}
        />
      </ComponentCard>
    );
  }

  protected setupPointsToPlot(couplingContainer: CouplingContainer) {
    const { data, lockedResiduePairs, hoveredResidues, formattedPoints, observedColor, highlightColor } = this.props;
    const { pointsToPlot } = this.state;

    const chartNames = {
      selected: 'Selected Residue Pairs',
      structure: `${data.pdbData ? (data.pdbData.known ? 'Known' : 'Predicted') : 'Unknown'} Structure Contact`,
    };

    const knownPointsIndex = pointsToPlot.findIndex(entry => entry.name === chartNames.structure);
    const selectedPointIndex = pointsToPlot.findIndex(entry => entry.name === chartNames.selected);

    const observedContactPoints = couplingContainer.getObservedContacts();
    const result = new Array<IContactMapChartData>(
      generateChartDataEntry(
        'text',
        { start: observedColor, end: 'rgb(100,177,200)' },
        chartNames.structure,
        '(from PDB structure)',
        knownPointsIndex >= 0 ? pointsToPlot[knownPointsIndex].nodeSize : 4,
        observedContactPoints,
        {
          text: observedContactPoints.map(point => {
            let hoverText =
              point && point.A_i && point.A_j
                ? `(${point.i}${point.A_i}, ${point.j}${point.A_j})`
                : `(${point.i}, ${point.j})`;
            if (point && point.score) {
              hoverText = `${hoverText}<br>Score: ${point.score}`;
            }
            if (point && point.probability) {
              hoverText = `${hoverText}<br>Probability: ${point.probability.toFixed(1)}`;
            }

            return hoverText;
          }),
        },
      ),
      ...formattedPoints,
    );

    const chartPoints = new Array<IContactMapChartPoint>();

    if (hoveredResidues.length >= 1) {
      chartPoints.push({
        i: hoveredResidues[0],
        j: hoveredResidues.length === 1 ? hoveredResidues[0] : hoveredResidues[1],
      });
    }

    if (Object.keys(lockedResiduePairs).length >= 1) {
      chartPoints.push(
        ...Array.from(Object.keys(lockedResiduePairs)).reduce((reduceResult: IContactMapChartPoint[], key) => {
          const keyPair = lockedResiduePairs[key];
          if (keyPair && keyPair.length === 2) {
            reduceResult.push({ i: keyPair[0], j: keyPair[1], dist: 0 });
          }

          return reduceResult;
        }, new Array<IContactMapChartPoint>()),
      );
    }

    result.push(
      generateChartDataEntry(
        'none',
        highlightColor,
        chartNames.selected,
        '',
        selectedPointIndex >= 0 ? pointsToPlot[selectedPointIndex].nodeSize : 4,
        chartPoints,
        {
          marker: {
            color: new Array<string>(chartPoints.length * 2).fill(highlightColor),
            line: {
              color: highlightColor,
              width: 3,
            },
            symbol: 'circle-open',
          },
        },
      ),
    );

    this.setState({
      ...this.state,
      pointsToPlot: [...result],
    });
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  candidateResidues: getCandidates(state).toArray(),
  hoveredResidues: getHovered(state).toArray(),
  hoveredSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/hovered',
  ).toArray(),
  lockedResiduePairs: getLocked(state).toJS(),
  selectedSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/selected',
  ).toArray(),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addHoveredResidues: createResiduePairActions().hovered.set,
      addHoveredSecondaryStructure: createContainerActions('secondaryStructure/hovered').add,
      addSelectedSecondaryStructure: createContainerActions('secondaryStructure/selected').add,
      removeAllLockedResiduePairs: createResiduePairActions().locked.clear,
      removeHoveredResidues: createResiduePairActions().hovered.clear,
      removeHoveredSecondaryStructure: createContainerActions('secondaryStructure/hovered').remove,
      removeSecondaryStructure: createContainerActions('secondaryStructure/selected').remove,
      toggleLockedResiduePair: createResiduePairActions().locked.toggle,
    },
    dispatch,
  );

export const ContactMap = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactMapClass);
