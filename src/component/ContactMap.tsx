import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import {
  ContactMapChart,
  generateChartDataEntry,
  IContactMapChartData,
  IContactMapChartPoint,
} from '~chell-viz~/component';
import {
  initialResidueContext,
  initialSecondaryStructureContext,
  IResidueContext,
  ISecondaryStructureContext,
  ResidueContextConsumer,
  SecondaryStructureContextConsumer,
} from '~chell-viz~/context';
import {
  CHELL_CSS_STYLE,
  ChellChartEvent,
  ChellWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  CouplingContainer,
  IContactMapData,
  ICouplingScore,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
  SliderWidgetConfig,
} from '~chell-viz~/data';
import { ContextConsumerComposer } from '~chell-viz~/hoc';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export interface IContactMapProps {
  configurations: ChellWidgetConfig[];
  data: IContactMapData;
  formattedPoints: IContactMapChartData[];
  height: number | string;
  highlightColor: string;
  isDataLoading: boolean;
  observedColor: string;
  onBoxSelection?: ((residues: RESIDUE_TYPE[]) => void);
  residueContext: IResidueContext;
  secondaryStructureContext: ISecondaryStructureContext;
  showConfigurations: boolean;
  style?: CHELL_CSS_STYLE;
  width: number | string;
}

export const initialContactMapState = {
  pointsToPlot: new Array<IContactMapChartData>(),
};

export type ContactMapState = Readonly<typeof initialContactMapState>;

export class ContactMapClass extends React.Component<IContactMapProps, ContactMapState> {
  public static defaultProps = {
    configurations: new Array<ChellWidgetConfig>(),
    data: {
      couplingScores: new CouplingContainer(),
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    enableSliders: true,
    formattedPoints: new Array<IContactMapChartData>(),
    height: '100%',
    highlightColor: '#ff8800',
    isDataLoading: false,
    observedColor: '#0000ff',
    residueContext: {
      ...initialResidueContext,
    },
    secondaryStructureContext: {
      ...initialSecondaryStructureContext,
    },
    showConfigurations: true,
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
    const { data, residueContext } = this.props;
    if (data !== prevProps.data || residueContext.lockedResiduePairs !== prevProps.residueContext.lockedResiduePairs) {
      this.setupPointsToPlot(data.couplingScores);
    }
  }

  public render() {
    const { configurations, isDataLoading, residueContext, style } = this.props;
    const { pointsToPlot } = this.state;

    return (
      <div className="ContactMapComponent" style={{ ...style }}>
        <Dimmer.Dimmable dimmed={true}>
          <Dimmer active={isDataLoading}>
            <Loader />
          </Dimmer>

          {this.renderContactMapChart(pointsToPlot, [
            {
              name: 'Clear Selections',
              onClick: residueContext.removeAllLockedResiduePairs,
              type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
            },
            ...configurations,
            ...this.generateNodeSizeSliderConfigs(pointsToPlot),
          ])}
        </Dimmer.Dimmable>
      </div>
    );
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

  protected setupPointsToPlot(couplingContainer: CouplingContainer) {
    const { formattedPoints, observedColor, highlightColor, residueContext } = this.props;
    const { pointsToPlot } = this.state;

    const chartNames = {
      known: 'Known Structure Contact',
      selected: 'Selected Residue Pairs',
    };

    const knownPointsIndex = pointsToPlot.findIndex(entry => entry.name === chartNames.known);
    const selectedPointIndex = pointsToPlot.findIndex(entry => entry.name === chartNames.selected);

    const observedContactPoints = couplingContainer.getObservedContacts();
    const result = new Array<IContactMapChartData>(
      generateChartDataEntry(
        'text',
        { start: observedColor, end: 'rgb(100,177,200)' },
        chartNames.known,
        '(from PDB structure)',
        knownPointsIndex >= 0 ? pointsToPlot[knownPointsIndex].nodeSize : 4,
        observedContactPoints,
        {
          text: observedContactPoints.map(point => {
            const score = couplingContainer.getCouplingScore(point.i, point.j);

            return score && score.A_i && score.A_j
              ? `(${point.i}${score.A_i}, ${point.j}${score.A_j})`
              : `(${point.i}, ${point.j})`;
          }),
        },
      ),
      ...formattedPoints,
    );

    const { lockedResiduePairs, hoveredResidues } = residueContext;

    if (hoveredResidues.length >= 1) {
      result.push(
        generateChartDataEntry(
          'none',
          highlightColor,
          chartNames.selected,
          '',
          selectedPointIndex >= 0 ? pointsToPlot[selectedPointIndex].nodeSize : 6,
          [{ i: hoveredResidues[0], j: hoveredResidues.length === 1 ? hoveredResidues[0] : hoveredResidues[1] }],
          {
            marker: {
              color: new Array<string>(hoveredResidues.length * 2).fill(highlightColor),
              line: {
                color: highlightColor,
                width: 3,
              },
              symbol: 'circle-open',
            },
          },
        ),
      );
    }

    if (lockedResiduePairs.size > 0) {
      const chartPoints = Array.from(lockedResiduePairs.keys()).reduce((reduceResult: IContactMapChartPoint[], key) => {
        const keyPair = lockedResiduePairs.get(key);
        if (keyPair && keyPair.length === 2) {
          reduceResult.push({ i: keyPair[0], j: keyPair[1], dist: 0 });
        }

        return reduceResult;
      }, new Array<IContactMapChartPoint>());

      result.push(
        generateChartDataEntry(
          'none',
          highlightColor,
          chartNames.selected,
          '',
          selectedPointIndex >= 0 ? pointsToPlot[selectedPointIndex].nodeSize : 6,
          chartPoints,
          {
            marker: {
              color: new Array<string>(lockedResiduePairs.size * 2).fill(highlightColor),
              line: {
                color: highlightColor,
                width: 3,
              },
              symbol: 'circle-open',
            },
          },
        ),
      );
    }

    this.setState({
      ...this.state,
      pointsToPlot: [...result],
    });
  }

  protected renderContactMapChart(pointsToPlot: IContactMapChartData[], configurations: ChellWidgetConfig[]) {
    const {
      data,
      height,
      onBoxSelection,
      residueContext,
      showConfigurations,
      secondaryStructureContext,
      width,
    } = this.props;

    return (
      <ContactMapChart
        candidateResidues={residueContext.candidateResidues}
        configurations={configurations}
        contactData={pointsToPlot}
        height={height}
        onClickCallback={this.onMouseClick(residueContext.toggleLockedResiduePair)}
        onHoverCallback={this.onMouseEnter(residueContext.addHoveredResidues)}
        onSelectedCallback={this.onMouseSelect(onBoxSelection)}
        onUnHoverCallback={this.onMouseLeave(residueContext.removeHoveredResidues)}
        range={data.couplingScores.residueIndexRange.max + 20}
        secondaryStructures={data.pdbData ? data.pdbData.secondaryStructureSections : []}
        showConfigurations={showConfigurations}
        selectedSecondaryStructures={[secondaryStructureContext.selectedSecondaryStructures]}
        width={width}
      />
    );
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
            max: 20,
            min: 1,
          },
        };
      },
    );

  protected onMouseEnter = (cb: (residue: RESIDUE_TYPE[]) => void) => (e: ChellChartEvent) => {
    if (e.isAxis()) {
      const { secondaryStructureContext, data } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            secondaryStructureContext.toggleSecondaryStructure(section);
          }
        }
      }
    } else {
      cb(e.selectedPoints);
    }
  };

  protected onMouseLeave = (cb?: (residue: RESIDUE_TYPE[]) => void) => (e: ChellChartEvent) => {
    if (e.isAxis()) {
      const { data, secondaryStructureContext } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            if (
              !secondaryStructureContext.selectedSecondaryStructures.includes(section) &&
              secondaryStructureContext.temporarySecondaryStructures.includes(section)
            ) {
              secondaryStructureContext.removeSecondaryStructure(section);
            }
          }
        }
      }
    } else if (cb) {
      cb(e.selectedPoints);
    }
  };

  protected onMouseClick = (cb: (residues: RESIDUE_TYPE[]) => void) => (e: ChellChartEvent) => {
    if (e.isAxis()) {
      const { data, secondaryStructureContext } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            if (secondaryStructureContext.selectedSecondaryStructures.includes(section)) {
              secondaryStructureContext.removeSecondaryStructure(section);
            } else {
              secondaryStructureContext.addSecondaryStructure(section);
            }
          }
        }
      }
    } else {
      cb(e.selectedPoints);
    }
  };

  protected onMouseSelect = (cb?: (residues: RESIDUE_TYPE[]) => void) => (e: ChellChartEvent) => {
    if (cb) {
      // For the contact map, all the x/y values are mirrored and correspond directly with i/j values.
      // Thus, all the residue numbers can be obtained by getting either all x or values from ths selected points.
      cb(e.selectedPoints.map(point => point));
    }
  };
}

type requiredProps = Omit<IContactMapProps, keyof typeof ContactMapClass.defaultProps> & Partial<IContactMapProps>;

const ContactMap = (props: requiredProps) => (
  <ContextConsumerComposer components={[ResidueContextConsumer, SecondaryStructureContextConsumer]}>
    {([resContext, secStructContext]) => (
      <ContactMapClass
        {...{
          ...props,
          residueContext: resContext as IResidueContext,
          secondaryStructureContext: secStructContext as ISecondaryStructureContext,
        }}
      />
    )}
  </ContextConsumerComposer>
);

export { ContactMap };
