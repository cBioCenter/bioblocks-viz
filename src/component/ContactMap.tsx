import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

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
import {
  CONFIGURATION_COMPONENT_TYPE,
  IContactMapData,
  ICouplingScore,
  RESIDUE_TYPE,
  SECONDARY_STRUCTURE,
} from '../data/chell-data';
import { CouplingContainer } from '../data/CouplingContainer';
import ChellChartEvent from '../data/event/ChellChartEvent';
import { withDimmedLoader } from '../hoc/DimmedComponent';
import ContactMapChart, { generateChartDataEntry, IContactMapChartData } from './chart/ContactMapChart';
import ChellRadioGroup from './widget/ChellRadioGroup';
import ChellSlider from './widget/ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

export interface IContactMapConfiguration {
  name: string;
  // onChange: ChellSliderCallback | ((args: any[]) => void);
  onChange: any;
  type: CONFIGURATION_COMPONENT_TYPE;
  values: {
    current: number;
    max: number;
    min: number;
    options?: string[];
  };
}

export interface IContactMapProps {
  configurations: IContactMapConfiguration[];
  data: IContactMapData;
  enableSliders: boolean;
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
    configurations: new Array<IContactMapConfiguration>(),
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
    const { enableSliders, isDataLoading, style, width } = this.props;
    const { pointsToPlot } = this.state;

    const sliderStyle = { width: width * 0.9 };

    return (
      <div id="ContactMapComponent" style={{ ...style }}>
        {withDimmedLoader(this.renderContactMapChart(pointsToPlot), isDataLoading)}
        {enableSliders && this.renderConfigSliders(sliderStyle, pointsToPlot)}
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

  protected renderContactMapChart(pointsToPlot: IContactMapChartData[]) {
    const { data, onBoxSelection, residueContext, secondaryStructureContext } = this.props;
    return (
      <ContactMapChart
        candidateResidues={residueContext.candidateResidues}
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

  protected renderConfigSliders(
    sliderStyle: React.CSSProperties[] | React.CSSProperties,
    entries: IContactMapChartData[],
  ) {
    const { showConfiguration } = this.state;
    return (
      <Accordion fluid={true} styled={true}>
        <Accordion.Title
          active={showConfiguration}
          className={'contact-map-configuration-toggle'}
          index={1}
          onClick={this.onShowConfigurationToggle()}
        >
          <Icon name="dropdown" />
          Configuration
        </Accordion.Title>
        <Accordion.Content active={showConfiguration}>
          {this.renderNodeSizeSliders(entries, sliderStyle)}
          {this.renderConfigurations(this.props.configurations, sliderStyle)}
        </Accordion.Content>
      </Accordion>
    );
  }

  protected renderNodeSizeSliders(
    entries: IContactMapChartData[],
    sliderStyle: React.CSSProperties[] | React.CSSProperties,
  ) {
    return entries.map((entry, index) => {
      const key = `node-size-slider-${index}`;
      return (
        <ChellSlider
          className={key}
          key={key}
          value={entry.nodeSize}
          label={`${entry.name} - Node Size`}
          max={20}
          min={1}
          onChange={this.onNodeSizeChange(index)}
          style={sliderStyle}
        />
      );
    });
  }

  protected renderConfigurations(
    configurations: IContactMapConfiguration[],
    sliderStyle: React.CSSProperties[] | React.CSSProperties,
  ) {
    return configurations.map(config => {
      const id = config.name
        .toLowerCase()
        .split(' ')
        .join('-');
      switch (config.type) {
        case CONFIGURATION_COMPONENT_TYPE.SLIDER:
          return this.renderConfigurationSlider(config, id, sliderStyle);
        case CONFIGURATION_COMPONENT_TYPE.RADIO:
          return this.renderConfigurationRadioButton(config, id);
      }
    });
  }

  protected renderConfigurationSlider(
    config: IContactMapConfiguration,
    id: string,
    sliderStyle: React.CSSProperties[] | React.CSSProperties,
  ) {
    return (
      <ChellSlider
        className={id}
        key={id}
        value={config.values.current}
        label={config.name}
        max={config.values.max}
        min={config.values.min}
        onChange={config.onChange}
        style={sliderStyle}
      />
    );
  }

  protected renderConfigurationRadioButton(config: IContactMapConfiguration, id: string) {
    return (
      <ChellRadioGroup key={`radio-group-${id}`} id={id} options={config.values.options!} onChange={config.onChange} />
    );
  }

  protected onShowConfigurationToggle = () => () => this.setState({ showConfiguration: !this.state.showConfiguration });

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
