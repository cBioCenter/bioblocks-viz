import * as React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

import ResidueContext, { initialResidueContext, ResidueSelection } from '../context/ResidueContext';
import { initialSecondaryStructureContext, SecondaryStructureContext } from '../context/SecondaryStructureContext';
import { CONFIGURATION_COMPONENT_TYPE, ICouplingScore, RESIDUE_TYPE, SECONDARY_STRUCTURE } from '../data/chell-data';
import ChellChartEvent from '../data/event/ChellChartEvent';
import { withDefaultProps } from '../helper/ReactHelper';
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

export const defaultContactMapProps = {
  chainLength: 59,
  configurations: new Array<IContactMapConfiguration>(),
  data: {
    computedPoints: new Array<IContactMapChartData>(),
    secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
  },
  enableSliders: true,
  height: 400,
  highlightColor: '#ff8800',
  ...initialResidueContext,
  ...initialSecondaryStructureContext,
  onBoxSelection: undefined as undefined | ((residues: RESIDUE_TYPE[]) => void),
  padding: 0,
  width: 400,
};

export const initialContactMapState = {
  pointsToPlot: new Array<IContactMapChartData>(),
  showConfiguration: false,
};

export type ContactMapProps = {} & typeof defaultContactMapProps;
export type ContactMapState = Readonly<typeof initialContactMapState>;

export class ContactMapClass extends React.Component<ContactMapProps, ContactMapState> {
  public readonly state: ContactMapState = initialContactMapState;

  constructor(props: ContactMapProps) {
    super(props);
  }

  public componentDidMount() {
    this.setupPointsToPlot(this.props.data.computedPoints);
  }

  public componentDidUpdate(prevProps: ContactMapProps) {
    const { data, lockedResiduePairs } = this.props;
    if (data !== prevProps.data) {
      this.props.clearAllResidues();
      this.props.clearSecondaryStructure();
      this.setupPointsToPlot(data.computedPoints);
    } else if (lockedResiduePairs !== prevProps.lockedResiduePairs) {
      this.setupPointsToPlot(data.computedPoints, lockedResiduePairs);
    }
  }

  public render() {
    const { enableSliders, padding, width } = this.props;
    const { pointsToPlot } = this.state;

    const sliderStyle = { width: width * 0.9 };

    return (
      <div id="ContactMapComponent" style={{ padding }}>
        {this.renderContactMapChart(pointsToPlot)}
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

  protected setupPointsToPlot(points: IContactMapChartData[], lockedResiduePairs: ResidueSelection = new Map()) {
    const { highlightColor } = this.props;
    const { pointsToPlot } = this.state;

    const pointsLength = pointsToPlot.length;
    const nodeSize = pointsLength >= 2 && pointsToPlot[pointsLength - 1] ? pointsToPlot[pointsLength - 1].nodeSize : 6;

    const highlightedPoints = generateChartDataEntry(
      'none',
      highlightColor,
      'Selected Res. Pairs',
      '',
      nodeSize,
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
    );

    this.setState({
      ...this.state,
      pointsToPlot: [...points, highlightedPoints],
    });
  }

  protected renderContactMapChart(pointsToPlot: IContactMapChartData[]) {
    const {
      addHoveredResidues,
      candidateResidues,
      chainLength,
      data,
      onBoxSelection,
      toggleLockedResiduePair,
    } = this.props;
    return (
      <ContactMapChart
        candidateResidues={candidateResidues}
        contactData={pointsToPlot}
        onClickCallback={this.onMouseClick(toggleLockedResiduePair)}
        onHoverCallback={this.onMouseEnter(addHoveredResidues)}
        onSelectedCallback={this.onMouseSelect(onBoxSelection)}
        onUnHoverCallback={this.onMouseLeave()}
        range={chainLength + 5}
        secondaryStructures={data.secondaryStructures}
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
    const result = [];
    for (const config of configurations) {
      const id = config.name
        .toLowerCase()
        .split(' ')
        .join('-');
      switch (config.type) {
        case CONFIGURATION_COMPONENT_TYPE.SLIDER:
          result.push(this.renderConfigurationSlider(config, id, sliderStyle));
          break;
        case CONFIGURATION_COMPONENT_TYPE.RADIO:
          result.push(this.renderConfigurationRadioButton(config, id));
          break;
      }
    }
    return result;
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
      const { toggleSecondaryStructure, data } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            toggleSecondaryStructure(section);
          }
        }
      }
    } else {
      cb(e.selectedPoints);
    }
  };

  protected onMouseLeave = (cb?: (residue: RESIDUE_TYPE[]) => void) => (e: ChellChartEvent) => {
    if (e.isAxis()) {
      const { selectedSecondaryStructures, data, removeSecondaryStructure } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            if (!selectedSecondaryStructures.includes(section)) {
              removeSecondaryStructure(section);
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
      const { addSecondaryStructure, data, removeSecondaryStructure, selectedSecondaryStructures } = this.props;

      for (const secondaryStructure of data.secondaryStructures) {
        for (const section of secondaryStructure) {
          if (section.contains(...e.selectedPoints)) {
            if (selectedSecondaryStructures.includes(section)) {
              removeSecondaryStructure(section);
            } else {
              addSecondaryStructure(section);
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

export const ContactMapWithDefaultProps = withDefaultProps(defaultContactMapProps, ContactMapClass);

// TODO The required props should be discernable from `withDefaultProps` without needing to duplicate.
// However the Context consumer syntax is still new to me and I can't find the right combination :(
type requiredProps = Partial<typeof defaultContactMapProps> &
  Required<Omit<ContactMapProps, keyof typeof defaultContactMapProps>>;

const ContactMap = (props: requiredProps) => (
  <SecondaryStructureContext.Consumer>
    {secStructContext => (
      <ResidueContext.Consumer>
        {residueContext => <ContactMapWithDefaultProps {...props} {...residueContext} {...secStructContext} />}
      </ResidueContext.Consumer>
    )}
  </SecondaryStructureContext.Consumer>
);

export default ContactMap;
export { ContactMap };
