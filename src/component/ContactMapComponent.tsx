/* global Plotly:true */
import * as React from 'react';
import PlotlyChart from 'react-plotlyjs-ts';

import Dygraph from 'dygraphs';
import * as ReactHighcharts from 'react-highcharts';
import { Dot, ReferenceLine, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

import { CONTACT_MAP_DATA_TYPE, ICouplingScore } from 'chell';
import { Config, Layout } from 'plotly.js';
import { withDefaultProps } from '../helper/ReactHelper';
import { ChellSlider } from './ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

const defaultProps = {
  chartLib: 'rechart' as 'dygraph' | 'highchart' | 'plotly' | 'rechart',
  contactColor: '#009999',
  couplingColor: '#000000',
  data: {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
  } as CONTACT_MAP_DATA_TYPE,
  onClick: undefined as ContactMapCallback | undefined,
  onMouseEnter: undefined as ContactMapCallback | undefined,
  selectedData: undefined as number | undefined,
};

const initialState = {
  blackDots: new Array<ICouplingScore>(),
  domain: [1, 100],
  max_x: 1,
  min_x: 1000,
  nodeSize: 4,
  probabilityFilter: 0.99,
};

type Props = {} & typeof defaultProps;
type State = Readonly<typeof initialState>;

export const ContactMapComponent = withDefaultProps(
  defaultProps,
  class ContactMapComponentClass extends React.Component<Props, State> {
    public readonly state: State = initialState;

    protected dygraphElement: HTMLElement | null = null;
    protected dygraph?: Dygraph;

    constructor(props: Props) {
      super(props);
    }

    public componentDidMount() {
      const { data } = this.props;
      if (data) {
        this.setupData(data);
      }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
      const { chartLib, data } = this.props;
      const isFreshDataView = data !== prevProps.data || this.state.probabilityFilter !== prevState.probabilityFilter;
      if (isFreshDataView) {
        this.setupData(data);
      }
      if (chartLib === 'dygraph' && this.dygraphElement && data.contactMonomer.length >= 1) {
        this.dygraph = new Dygraph(this.dygraphElement, data.contactMonomer.map(contact => [contact.i, contact.j]), {
          drawAxesAtZero: true,
          drawGrid: true,
          drawPoints: true,
          pointSize: this.state.nodeSize,
          strokeWidth: 0.0,
        });
      }
    }

    public render() {
      const { chartLib, data } = this.props;
      if (data) {
        switch (chartLib) {
          case 'dygraph':
            return this.renderDygraph();
          case 'highchart':
            return this.renderHighChart();
          case 'plotly':
            return this.renderPlotly();
          case 'rechart':
            return this.renderRechart();
          default:
            throw new Error(`Unsupported Chart rendering library '${chartLib}`);
        }
      } else {
        return null;
      }
    }

    protected renderPlotly() {
      const { contactColor, couplingColor, data } = this.props;
      const { blackDots } = this.state;
      const config: Partial<Config> = {
        displayModeBar: true,
      };
      const layout: Partial<Layout> = {
        height: 440,
        legend: {},
        showlegend: false,
        width: 440,
        yaxis: {
          autorange: 'reversed',
        },
      };
      const geom = new Float32Array(data.contactMonomer.length * 2);
      data.contactMonomer.forEach((contact, index) => {
        geom[index * 2] = contact.i;
        geom[index * 2 + 1] = contact.j;
      });
      return (
        <div style={{ padding: 10 }}>
          <PlotlyChart
            config={config}
            data={[
              {
                marker: {
                  color: contactColor,
                  sizemax: this.state.nodeSize * 2,
                  sizemin: this.state.nodeSize,
                },
                mode: 'markers',
                type: 'pointcloud',
                // x: data.contactMonomer.map(contact => contact.i),
                // y: data.contactMonomer.map(contact => contact.j),
                xy: geom,
              },
              {
                marker: {
                  color: couplingColor,
                  sizemax: this.state.nodeSize * 2,
                  sizemin: this.state.nodeSize,
                },
                mode: 'markers',
                type: 'pointcloud',
                x: blackDots.map(dot => dot.i),
                y: blackDots.map(dot => dot.j),
              },
            ]}
            layout={layout}
          />
          <ChellSlider
            max={100}
            min={0}
            label={'Probability'}
            defaultValue={99}
            onChange={this.onProbabilityChange()}
          />
          <ChellSlider
            max={5}
            min={1}
            label={'Node Size'}
            defaultValue={this.state.nodeSize}
            onChange={this.onNodeSizeChange()}
          />
        </div>
      );
    }

    protected renderRechart() {
      const { contactColor, couplingColor, data, selectedData } = this.props;
      const { blackDots, domain } = this.state;
      return (
        <div style={{ padding: 10 }}>
          <ScatterChart width={370} height={370}>
            <XAxis type="number" dataKey={'i'} orientation={'top'} domain={domain} />
            <YAxis type="number" dataKey={'j'} reversed={true} domain={domain} />
            {typeof selectedData === 'number' && <ReferenceLine x={selectedData} stroke={'#ff0000'} />}
            {typeof selectedData === 'number' && <ReferenceLine y={selectedData} stroke={'#ff0000'} />}
            <Scatter
              name="contacts_monomer"
              data={data.contactMonomer}
              fill={contactColor}
              onClick={this.onClick()}
              shape={<Dot r={this.state.nodeSize} />}
            />
            <Scatter
              name="CouplingScoresCompared"
              data={blackDots}
              fill={couplingColor}
              onClick={this.onClick()}
              onMouseEnter={this.onMouseEnter()}
              shape={<Dot r={this.state.nodeSize} />}
            />
            <Tooltip />
          </ScatterChart>
          <ChellSlider
            max={100}
            min={0}
            label={'Probability'}
            defaultValue={99}
            onChange={this.onProbabilityChange()}
          />
          <ChellSlider
            max={5}
            min={1}
            label={'Node Size'}
            defaultValue={this.state.nodeSize}
            onChange={this.onNodeSizeChange()}
          />
        </div>
      );
    }

    protected renderHighChart() {
      const { contactColor, couplingColor, data } = this.props;
      const { blackDots } = this.state;

      const config = {
        legend: {
          enabled: false,
        },
        series: [
          {
            color: contactColor,
            data: data.contactMonomer.map(contact => [contact.i, contact.j]),
            type: 'scatter',
          },
          {
            color: couplingColor,
            data: blackDots.map(coupling => [coupling.i, coupling.j]),
            type: 'scatter',
          },
        ],
        title: '',
        yAxis: {
          reversed: true,
        },
      };
      return (
        <div style={{ padding: 10 }}>
          <ReactHighcharts config={config} />
          <ChellSlider
            max={100}
            min={0}
            label={'Probability'}
            defaultValue={99}
            onChange={this.onProbabilityChange()}
          />
          <ChellSlider
            max={5}
            min={1}
            label={'Node Size'}
            defaultValue={this.state.nodeSize}
            onChange={this.onNodeSizeChange()}
          />
        </div>
      );
    }

    protected renderDygraph() {
      return (
        <div style={{ padding: 10 }}>
          <div ref={el => (this.dygraphElement = el)} style={{ height: 370, width: 370 }} />
        </div>
      );
    }

    protected setupData(data: CONTACT_MAP_DATA_TYPE) {
      let max = initialState.max_x;
      const blackDots = new Array<ICouplingScore>();
      data.contactMonomer.forEach(contact => {
        max = Math.max(max, contact.i);
      });
      data.couplingScore.filter(coupling => coupling.probability >= this.state.probabilityFilter).forEach(coupling => {
        max = Math.max(max, coupling.i);
        blackDots.push(coupling);
        blackDots.push({
          ...coupling,
          i: coupling.j,
          // tslint:disable-next-line:object-literal-sort-keys
          A_i: coupling.A_j,
          j: coupling.i,
          A_j: coupling.A_i,
        });
      });

      this.setState({
        blackDots,
        domain: [1, max],
      });
    }

    protected onClick = () => (coupling: ICouplingScore) => {
      if (this.props.onClick) {
        this.props.onClick(coupling);
      }
    };

    protected onProbabilityChange = () => (value: number) => {
      this.setState({
        probabilityFilter: value / 100,
      });
    };

    protected onNodeSizeChange = () => (value: number) => {
      this.setState({
        nodeSize: value,
      });
    };

    protected onMouseEnter = () => (e: { [key: string]: any; payload: ICouplingScore }) => {
      const { payload } = e;
      const { onMouseEnter } = this.props;

      if (onMouseEnter) {
        onMouseEnter(payload);
      }
    };

    /*
  Exposed recharts mouse events to potentially become props:
  - onMouseDown
  - onMouseUp
  - onMouseMove
  - onMouseOut
  - onMouseOver
  - onMouseLeave
  */
  },
);
