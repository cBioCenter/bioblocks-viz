import * as React from 'react';
import PlotlyChart from '../helper/PlotlyHelper';

import { CONTACT_MAP_DATA_TYPE, ICouplingScore, IResiduePair } from 'chell';
import { Config, Layout } from 'plotly.js';
import { ResidueContext } from '../context/ResidueContext';
import { withDefaultProps } from '../helper/ReactHelper';
import { ChellSlider } from './ChellSlider';

export type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;

const defaultProps = {
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
      const { data } = this.props;
      const isFreshDataView = data !== prevProps.data || this.state.probabilityFilter !== prevState.probabilityFilter;
      if (isFreshDataView) {
        this.setupData(data);
      }
    }

    public render() {
      const { data } = this.props;
      if (data) {
        return this.renderPlotly();
      } else {
        return null;
      }
    }

    protected renderPlotly() {
      const { contactColor, couplingColor, data } = this.props;
      const { blackDots } = this.state;
      const config: Partial<Config> = {
        displayModeBar: true,
        modeBarButtons: [['zoomOut2d', 'zoomIn2d'], ['resetScale2d', 'autoScale2d'], ['select2d', 'pan2d']],
      };
      const layout: Partial<Layout> = {
        dragmode: 'pan',
        height: 440,
        legend: {},
        showlegend: false,
        title: '',
        width: 440,
        xaxis: {},
        yaxis: {
          autorange: 'reversed',
          tickmode: 'auto',
        },
      };
      const geom = new Float32Array(data.contactMonomer.length * 2);
      data.contactMonomer.forEach((contact, index) => {
        geom[index * 2] = contact.i;
        geom[index * 2 + 1] = contact.j;
      });
      return (
        <ResidueContext.Consumer>
          {({ currentResiduePair, selectNewResiduePair }) => (
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
                  {
                    marker: {
                      color: 'yellow',
                      sizemax: this.state.nodeSize * 2,
                      sizemin: this.state.nodeSize,
                    },
                    mode: 'markers',
                    type: 'pointcloud',
                    xy: new Float32Array([currentResiduePair.i, currentResiduePair.j]),
                  },
                ]}
                layout={layout}
                onHoverCallback={this.onMouseEnter(selectNewResiduePair)}
                onClickCallback={this.onMouseClick()}
                onSelectedCallback={this.onMouseSelect()}
              />
              {this.renderSliders()}
            </div>
          )}
        </ResidueContext.Consumer>
      );
    }

    protected renderSliders() {
      return (
        <div>
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

    protected onMouseEnter = (cb: (coupling: IResiduePair) => void) => (e: Plotly.PlotMouseEvent) => {
      const { points } = e;
      cb({
        i: points[0].x,
        j: points[0].y,
      });
    };

    protected onMouseClick = () => (e: Plotly.PlotMouseEvent) => {
      console.log(`onMouseClick: ${e}`);
    };

    protected onMouseSelect = () => (e: Plotly.PlotSelectionEvent) => {
      console.log(`onMouseSelect: ${e}`);
    };
  },
);
