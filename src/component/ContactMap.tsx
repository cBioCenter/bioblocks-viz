import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import {
  initialResidueContext,
  IResidueContext,
  ResidueContextWrapper,
  ResidueSelection,
} from '../context/ResidueContext';
import SecondaryStructureContextWrapper, {
  initialSecondaryStructureContext,
  ISecondaryStructureContext,
} from '../context/SecondaryStructureContext';
import { ChellWidgetConfig, CONFIGURATION_COMPONENT_TYPE, SliderWidgetConfig } from '../data/ChellConfig';
import { IContactMapData, ICouplingScore, RESIDUE_TYPE, SECONDARY_STRUCTURE } from '../data/ChellData';
import { CouplingContainer } from '../data/CouplingContainer';
import ChellChartEvent from '../data/event/ChellChartEvent';
import ContactMapChart, { generateChartDataEntry, IContactMapChartData } from './chart/ContactMapChart';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export interface IContactMapProps {
  configurations: ChellWidgetConfig[];
  data: IContactMapData;
  formattedPoints: IContactMapChartData[];
  height: number;
  highlightColor: string;
  isDataLoading: boolean;
  observedColor: string;
  onBoxSelection?: ((residues: RESIDUE_TYPE[]) => void);
  residueContext: IResidueContext;
  secondaryStructureContext: ISecondaryStructureContext;
  style?: React.CSSProperties;
  width: number;
}

export const initialContactMapState = {
  pointsToPlot: new Array<IContactMapChartData>(),
  showConfiguration: false,
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
    height: 400,
    highlightColor: '#ff8800',
    isDataLoading: false,
    observedColor: '#0000ff',
    residueContext: {
      ...initialResidueContext,
    },
    secondaryStructureContext: {
      ...initialSecondaryStructureContext,
    },
    width: 400,
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
      this.setupPointsToPlot(data.couplingScores, residueContext.lockedResiduePairs);
    }
  }

  public render() {
    const { configurations, isDataLoading, style, width } = this.props;
    const { pointsToPlot } = this.state;

    const sliderStyle = { width: width * 0.9 };

    return (
      <div id="ContactMapComponent" style={{ ...style }}>
        <Dimmer.Dimmable dimmed={true}>
          <Dimmer active={isDataLoading}>
            <Loader />
          </Dimmer>

          {this.renderContactMapChart(pointsToPlot, [
            ...configurations,
            ...this.generateNodeSizeSliderConfigs(pointsToPlot, sliderStyle),
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

  protected setupPointsToPlot(points: CouplingContainer, lockedResiduePairs: ResidueSelection = new Map()) {
    const { formattedPoints, observedColor, highlightColor } = this.props;
    const { pointsToPlot } = this.state;

    const chartNames = {
      known: 'Known Structure Contact',
      selected: 'Selected Res. Pairs',
    };

    const nodeSizes = {
      known: pointsToPlot.findIndex(entry => entry.name === chartNames.known),
      selected: pointsToPlot.findIndex(entry => entry.name === chartNames.selected),
    };

    const result = new Array<IContactMapChartData>(
      generateChartDataEntry(
        'x+y',
        { start: observedColor, end: 'rgb(100,177,200)' },
        chartNames.known,
        '(from PDB structure)',
        nodeSizes.known >= 0 ? pointsToPlot[nodeSizes.known].nodeSize : 4,
        points.getObservedContacts(),
      ),
      ...formattedPoints,
    );

    if (lockedResiduePairs.size > 0) {
      result.push(
        generateChartDataEntry(
          'none',
          highlightColor,
          chartNames.selected,
          '',
          nodeSizes.selected >= 0 ? pointsToPlot[nodeSizes.selected].nodeSize : 6,
          Array.from(lockedResiduePairs.keys())
            .filter(key => lockedResiduePairs.get(key)!.length === 2)
            .map(key => ({ i: lockedResiduePairs.get(key)![0], j: lockedResiduePairs.get(key)![1], dist: 0 })),
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
    const { data, onBoxSelection, residueContext, secondaryStructureContext } = this.props;
    return (
      <ContactMapChart
        candidateResidues={residueContext.candidateResidues}
        configurations={configurations}
        contactData={pointsToPlot}
        onClickCallback={this.onMouseClick(residueContext.toggleLockedResiduePair)}
        onHoverCallback={this.onMouseEnter(residueContext.addHoveredResidues)}
        onSelectedCallback={this.onMouseSelect(onBoxSelection)}
        onUnHoverCallback={this.onMouseLeave(residueContext.removeHoveredResidues)}
        range={data.couplingScores.residueIndexRange.max + 20}
        secondaryStructures={data.pdbData ? data.pdbData.secondaryStructureSections : []}
        selectedSecondaryStructures={[secondaryStructureContext.selectedSecondaryStructures]}
      />
    );
  }

  protected generateNodeSizeSliderConfigs = (
    entries: IContactMapChartData[],
    style: React.CSSProperties,
  ): SliderWidgetConfig[] =>
    entries.map((entry, index) => {
      const config: SliderWidgetConfig = {
        id: `node-size-slider-${index}`,
        name: `Node size for ${entry.name}`,
        onChange: this.onNodeSizeChange(index),
        style,
        type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
        values: {
          current: entry.nodeSize,
          max: 20,
          min: 1,
        },
      };
      return config;
    });

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
            if (!secondaryStructureContext.selectedSecondaryStructures.includes(section)) {
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
  <SecondaryStructureContextWrapper.Consumer>
    {secondaryStructureContext => (
      <ResidueContextWrapper.Consumer>
        {residueContext => (
          <ContactMapClass
            {...props}
            residueContext={{ ...residueContext }}
            secondaryStructureContext={{ ...secondaryStructureContext }}
          />
        )}
      </ResidueContextWrapper.Consumer>
    )}
  </SecondaryStructureContextWrapper.Consumer>
);

export default ContactMap;
export { ContactMap };
