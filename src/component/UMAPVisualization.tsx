import * as React from 'react';
import { UMAP } from 'umap-js';
// tslint:disable-next-line: no-submodule-imports
import { euclidean } from 'umap-js/dist/umap';

import { Dropdown, DropdownProps } from 'semantic-ui-react';
import {
  ComponentCard,
  defaultPlotlyConfig,
  defaultPlotlyLayout,
  IButtonType,
  IComponentMenuBarItem,
  IPopupType,
  PlotlyChart,
} from '~bioblocks-viz~/component';
import {
  BioblocksChartEvent,
  BioblocksWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  ILabel,
  IPlotlyData,
} from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION } from '~bioblocks-viz~/helper';

export interface ICategoricalAnnotation {
  [labelCategoryName: string]: {
    label_colors: {
      [labelName: string]: string;
    };
    label_list: string[]; // Discrete labels for each sample in the dataMatrix. Length must equal dataMatrix.length.
  };
}

export type DISTANCE_FN_TYPE = (arg1: number[], arg2: number[]) => number;

export interface IUMAPVisualizationProps {
  currentLabel: string;
  // the data to display (will be subsampled) - if sampleNames are provided sampleNames.length must equal dataMatrix.length
  dataLabels?: Array<ILabel | undefined>;
  dataMatrix: number[][];
  distanceFn?: DISTANCE_FN_TYPE;
  errorMessages: string[];
  iconSrc?: string;
  labels: string[];
  minDist: number;
  nComponents: 2 | 3;
  nNeighbors: number;
  numIterationsBeforeReRender: number;
  spread: number;
  tooltipNames?: string[];
  onLabelChange(...args: any[]): void;
}

export type IUMAPVisualizationState = typeof UMAPVisualization.initialState & {
  dragMode: 'orbit' | 'pan' | 'turntable' | 'zoom';
};

export class UMAPVisualization extends React.Component<IUMAPVisualizationProps, IUMAPVisualizationState> {
  public static defaultProps = {
    currentLabel: '',
    distanceFn: euclidean,
    errorMessages: [],
    labels: [],
    minDist: 0.99,
    nComponents: 2 as 2 | 3,
    nNeighbors: 15,
    numIterationsBeforeReRender: 1,
    onLabelChange: EMPTY_FUNCTION,
    spread: 1,
  };

  public static initialState = {
    currentEpoch: undefined as number | undefined,
    // tslint:disable-next-line: no-object-literal-type-assertion
    dataVisibility: {} as Record<number, boolean>,
    dragMode: 'turntable' as 'orbit' | 'pan' | 'turntable' | 'zoom',
    numDimensions: UMAPVisualization.defaultProps.nComponents,
    numMinDist: UMAPVisualization.defaultProps.minDist,
    numNeighbors: UMAPVisualization.defaultProps.nNeighbors,
    numSpread: UMAPVisualization.defaultProps.spread,
    plotlyData: new Array<IPlotlyData>(),
    ranges: {
      maxX: -20,
      maxY: -20,
      maxZ: -20,
      minX: 20,
      minY: 20,
      minZ: 20,
    },
    totalNumberEpochs: undefined as number | undefined,
    umapEmbedding: new Array(new Array<number>()),
  };

  private timeout1: number | undefined;
  private timeout2: number | undefined;

  constructor(props: IUMAPVisualizationProps) {
    super(props);
    this.state = {
      ...UMAPVisualization.initialState,
      numDimensions: props.nComponents,
      numMinDist: props.minDist,
      numNeighbors: props.nNeighbors,
      numSpread: props.spread,
    };
  }

  public componentDidMount() {
    this.executeUMAP();
  }

  public componentDidUpdate(prevProps: IUMAPVisualizationProps, prevState: IUMAPVisualizationState) {
    const { dataLabels, dataMatrix, distanceFn, minDist, nComponents, nNeighbors, spread, tooltipNames } = this.props;
    const { dataVisibility, umapEmbedding } = this.state;
    if (distanceFn !== prevProps.distanceFn || dataMatrix !== prevProps.dataMatrix) {
      this.executeUMAP();
    } else if (
      dataLabels !== prevProps.dataLabels ||
      tooltipNames !== prevProps.tooltipNames ||
      dataVisibility !== prevState.dataVisibility
    ) {
      this.setState({
        plotlyData: this.getData(umapEmbedding, dataLabels, tooltipNames),
      });
    } else if (nComponents !== prevProps.nComponents) {
      this.setState({
        numDimensions: nComponents,
      });
    } else if (spread !== prevProps.spread) {
      this.setState({
        numSpread: spread,
      });
    } else if (minDist !== prevProps.minDist) {
      this.setState({
        numMinDist: minDist,
      });
    } else if (nNeighbors !== prevProps.nNeighbors) {
      this.setState({
        numNeighbors: nNeighbors,
      });
    }
  }

  public render() {
    const { iconSrc } = this.props;
    const { currentEpoch, totalNumberEpochs, umapEmbedding } = this.state;
    let epochInfo: string | undefined;
    if (totalNumberEpochs && currentEpoch) {
      epochInfo = `epoch ${currentEpoch}/${totalNumberEpochs}`;
    }

    const legendStats = this.getLegendStats();

    return (
      <div>
        <ComponentCard
          componentName={'UMAP'}
          expandedStyle={{
            height: '80vh',
            width: `calc(${legendStats.legendWidth}px + 80vh)`,
          }}
          dockItems={[
            {
              isLink: false,
              text: `${umapEmbedding.length} sequence${umapEmbedding.length !== 1 ? 's' : ''} | ${
                epochInfo ? epochInfo : ''
              }`,
            },
          ]}
          height={'575px'}
          iconSrc={iconSrc}
          isDataReady={epochInfo !== undefined}
          menuItems={this.getMenuItems()}
          width={`${legendStats.legendWidth + 535}px`}
        >
          {this.renderCategoryDropdown()}
          {umapEmbedding.length >= 1 && umapEmbedding[0].length === 3
            ? this.render3D(legendStats.showLegend)
            : this.render2D(legendStats.showLegend)}
        </ComponentCard>
      </div>
    );
  }

  protected getLegendStats = () => {
    const { plotlyData } = this.state;
    const legend: SVGGElement | undefined = document.getElementsByClassName('legend')[0] as SVGGElement;
    // const legendWidth = legend ? legend.getBBox().width * 0.75 : 0;
    const legendWidth = legend ? 200 : 0;

    // Show legend if:
    // 2 or more data arrays.
    // Only 1 data array with no name - OR - a name that is not unannotated.
    const showLegend =
      plotlyData.length >= 2 ||
      (plotlyData.length === 1 &&
        (plotlyData[0].name === undefined ||
          (plotlyData[0].name !== undefined && !plotlyData[0].name.includes('Unannotated'))));

    return {
      legendWidth,
      showLegend,
    };
  };

  protected render2D = (showLegend: boolean) => {
    const { ranges, plotlyData } = this.state;

    return (
      <PlotlyChart
        layout={{
          ...defaultPlotlyLayout,
          dragmode: 'zoom',
          legend: {
            itemdoubleclick: false,
            traceorder: 'grouped',
            x: 1,
            y: 0.95,
          },
          margin: {
            b: 50,
            l: 40,
          },
          showlegend: showLegend,
          xaxis: {
            autorange: false,
            range: [Math.floor(ranges.minX), Math.ceil(ranges.maxX)],
            title: 'Dim 1',
            titlefont: { size: 12 },
          },
          yaxis: {
            autorange: false,
            range: [Math.floor(ranges.minY), Math.ceil(ranges.maxY)],
            title: 'Dim 2',
            titlefont: { size: 12 },
          },
        }}
        data={plotlyData}
        onLegendClickCallback={this.onLegendClick}
        showLoader={true}
      />
    );
  };

  protected render3D = (showLegend: boolean) => {
    const { dragMode, ranges, plotlyData } = this.state;

    return (
      <PlotlyChart
        config={{
          ...defaultPlotlyConfig,
          displayModeBar: false,
          displaylogo: false,
          scrollZoom: true,
        }}
        layout={{
          ...defaultPlotlyLayout,
          dragmode: dragMode,
          legend: {
            itemdoubleclick: false,
            traceorder: 'grouped',
            x: 0.85,
            y: 0.95,
          },
          margin: {
            b: 10,
            l: 0,
            r: 5,
          },
          scene: {
            aspectmode: 'cube',
            xaxis: { autorange: false, range: [Math.floor(ranges.minX), Math.ceil(ranges.maxX)], title: 'Dim 1' },
            yaxis: { autorange: false, range: [Math.floor(ranges.minY), Math.ceil(ranges.maxY)], title: 'Dim 2' },
            zaxis: { autorange: false, range: [Math.floor(ranges.minZ), Math.ceil(ranges.maxZ)], title: 'Dim 3' },
          },
          showlegend: showLegend,
        }}
        data={plotlyData}
        onLegendClickCallback={this.onLegendClick}
        showLoader={true}
      />
    );
  };

  protected getData = (
    umapEmbedding: number[][],
    dataLabels: Array<ILabel | undefined> = [],
    tooltipNames: string[] = [],
  ) => {
    const result =
      umapEmbedding.length > 0 && umapEmbedding[0].length > 2
        ? this.getData3D(umapEmbedding, dataLabels, tooltipNames)
        : this.getData2D(umapEmbedding, dataLabels, tooltipNames);

    const plotlyData = Object.values(result) as IPlotlyData[];
    const unannotated = plotlyData.splice(plotlyData.findIndex(datum => datum.legendgroup === 'Unannotated'), 1);
    const MAX_LEGEND_LENGTH = 20;

    return unannotated.concat(plotlyData.sort((a, b) => b.x.length - a.x.length)).map((data, index) => {
      const { dataVisibility } = this.state;
      data.visible = dataVisibility[index] === undefined || dataVisibility[index] === true ? true : 'legendonly';
      if (data.name.length > MAX_LEGEND_LENGTH) {
        const countStartPos = data.name.lastIndexOf('(');
        const count = data.name.slice(countStartPos);
        data.name =
          data.name.length - count.length - 1 > MAX_LEGEND_LENGTH
            ? `${data.name.slice(0, MAX_LEGEND_LENGTH - count.length + 1)}... ${count}`
            : data.name;
      }

      return data;
    });
  };

  protected getData2D = (
    umapEmbedding: number[][],
    dataLabels: Array<ILabel | undefined> = [],
    tooltipNames: string[] = [],
  ) => {
    return umapEmbedding.reduce<Record<string, Partial<IPlotlyData>>>((acc, umapRow, index) => {
      const label = dataLabels[index];
      const { color, name } = label ? label : { color: 'gray', name: 'Unannotated' };
      if (acc[name]) {
        (acc[name].text as string[]).push(tooltipNames[index]);
        (acc[name].x as number[]).push(umapRow[0]);
        (acc[name].y as number[]).push(umapRow[1]);
        acc[name].name = `${name} (${(acc[name].x as number[]).length})`;
      } else {
        acc[name] = {
          hoverinfo: 'none',
          hovertemplate: '%{data.name}<br>%{text}<extra></extra>',
          legendgroup: name === 'Unannotated' ? 'Unannotated' : 'Annotated',
          marker: {
            color: color ? color : 'gray',
          },
          mode: 'markers',
          name: `${name} (${1})`,
          text: [tooltipNames[index]],
          type: 'scattergl',
          x: [umapRow[0]],
          y: [umapRow[1]],
        };
      }

      return acc;
    }, {});
  };

  protected getData3D = (
    umapEmbedding: number[][],
    dataLabels: Array<ILabel | undefined> = [],
    tooltipNames: string[] = [],
  ) => {
    return umapEmbedding.reduce<Record<string, Partial<IPlotlyData>>>((acc, umapRow, index) => {
      const label = dataLabels[index];
      const { color, name } = label ? label : { color: 'gray', name: 'Unannotated' };
      if (acc[name]) {
        (acc[name].text as string[]).push(tooltipNames[index]);
        (acc[name].x as number[]).push(umapRow[0]);
        (acc[name].y as number[]).push(umapRow[1]);
        (acc[name].z as number[]).push(umapRow[2]);
        acc[name].name = `${name} (${(acc[name].x as number[]).length + 1})`;
      } else {
        acc[name] = {
          hoverinfo: 'none',
          hovertemplate: '%{data.name}<br>%{text}<extra></extra>',
          legendgroup: name === 'Unannotated' ? 'Unannotated' : 'Annotated',
          marker: {
            color: color ? color : 'gray',
            size: 4,
          },
          mode: 'markers',
          name: `${name} (${1})`,
          text: [tooltipNames[index]],
          type: 'scatter3d',
          x: [umapRow[0]],
          y: [umapRow[1]],
          z: [umapRow[2]],
        };
      }

      return acc;
    }, {});
  };

  protected get3DMenuItems = (): Array<IComponentMenuBarItem<IButtonType>> => {
    const { currentEpoch, dragMode, totalNumberEpochs } = this.state;
    const disabled = currentEpoch === undefined || totalNumberEpochs === undefined || currentEpoch < totalNumberEpochs;

    return [
      {
        component: {
          name: 'BUTTON',
          onClick: disabled ? EMPTY_FUNCTION : this.onZoomClick,
          props: {
            active: dragMode === 'zoom',
            disabled,
          },
        },
        description: 'Zoom',
        iconName: 'zoom',
      },
      {
        component: {
          name: 'BUTTON',
          onClick: disabled ? EMPTY_FUNCTION : this.onPanClick,
          props: {
            active: dragMode === 'pan',
            disabled,
          },
        },
        description: 'Pan',
        iconName: 'arrows alternate',
      },
      {
        component: {
          name: 'BUTTON',
          onClick: disabled ? EMPTY_FUNCTION : this.onOrbitClick,
          props: {
            active: dragMode === 'orbit',
            disabled,
          },
        },
        description: 'Orbit',
        iconName: 'sync alternate',
      },
      {
        component: {
          name: 'BUTTON',
          onClick: disabled ? EMPTY_FUNCTION : this.onTurntableClick,
          props: {
            active: dragMode === 'turntable',
            disabled,
          },
        },
        description: 'Turntable',
        iconName: 'weight',
      },
    ];
  };

  protected onOrbitClick = () => {
    this.setState({
      dragMode: 'orbit',
    });
  };

  protected onPanClick = () => {
    this.setState({
      dragMode: 'pan',
    });
  };

  protected onTurntableClick = () => {
    this.setState({
      dragMode: 'turntable',
    });
  };

  protected onZoomClick = () => {
    this.setState({
      dragMode: 'zoom',
    });
  };

  protected getMenuItems = () => {
    const { umapEmbedding } = this.state;

    const result: Array<IComponentMenuBarItem<IButtonType | IPopupType>> = [
      {
        component: {
          configs: this.getSettingsConfigs(),
          name: 'POPUP',
          props: {
            disabled: umapEmbedding.length === 0,
            position: 'top center',
            wide: false,
          },
        },
        description: 'Settings',
      },
    ];

    if (umapEmbedding.length >= 1 && umapEmbedding[0].length === 3) {
      result.push(...this.get3DMenuItems());
    }

    return result;
  };

  protected getSettingsConfigs = () => {
    // const { maxNumSequences, numSequencesToShow, onNumSequenceChange } = this.props;
    const { numDimensions, numMinDist, numNeighbors, numSpread, umapEmbedding } = this.state;

    return {
      Settings: [
        {
          marks: {
            0: '0',
            5: '5',
          },
          name: 'Min Dist',
          onChange: this.onMinDistChange,
          step: 0.01,
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: numMinDist,
            defaultValue: 0.99,
            max: 5,
            min: 0,
          },
        },
        {
          marks: {
            0: '0',
            30: '30',
          },
          name: 'Neighbors',
          onChange: this.onNumNeighborsChange,
          step: 1,
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: numNeighbors,
            defaultValue: 15,
            max: 30,
            min: 0,
          },
        },
        {
          marks: {
            0: '0',
            10: '10',
          },
          name: 'Spread',
          onChange: this.onSpreadChange,
          step: 1,
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: numSpread,
            defaultValue: 1,
            max: 10,
            min: 0,
          },
        },
        /*
        {
          marks: {
            [maxNumSequences]: maxNumSequences,
            [Math.min(1000, umapEmbedding.length)]: Math.min(1000, umapEmbedding.length),
          },
          name: 'Sequences',
          onAfterChange: onNumSequenceChange,
          step: 1,
          type: CONFIGURATION_COMPONENT_TYPE.SLIDER,
          values: {
            current: numSequencesToShow,
            max: maxNumSequences,
            min: Math.min(1000, umapEmbedding.length),
          },
        },
        */
        {
          current: numDimensions.toString(),
          name: 'Dimensions',
          onChange: this.onDimensionChange,
          options: ['2', '3'],
          type: CONFIGURATION_COMPONENT_TYPE.RADIO,
        },

        {
          name: 'Re-Run UMAP',
          onClick: this.executeUMAP,
          type: CONFIGURATION_COMPONENT_TYPE.BUTTON,
        },
      ] as BioblocksWidgetConfig[],
    };
  };

  protected renderCategoryDropdown = () => {
    const { currentLabel, labels } = this.props;

    return (
      labels.length >= 1 && (
        <div
          style={{
            float: 'right',
            fontSize: '14px',
            paddingRight: '5px',
            position: 'relative',
            width: '30%',
            zIndex: 777,
          }}
        >
          Annotation:{' '}
          <Dropdown
            direction={'right'}
            fluid={false}
            inline={true}
            onChange={this.onLabelChange}
            options={labels.map(label => ({
              text: label,
              value: label,
            }))}
            text={currentLabel}
          />{' '}
        </div>
      )
    );
  };

  protected onDimensionChange = (value: number) => {
    this.setState({
      numDimensions: value === 0 ? 2 : 3,
    });
  };

  protected onLabelChange = (event: React.SyntheticEvent, data: DropdownProps) => {
    const { onLabelChange } = this.props;
    this.setState({
      dataVisibility: {},
    });
    onLabelChange(event, data);
  };

  protected onMinDistChange = (value: number) => {
    this.setState({
      numMinDist: value,
    });
  };

  protected onNumNeighborsChange = (value: number) => {
    this.setState({
      numNeighbors: value,
    });
  };

  protected onSpreadChange = (value: number) => {
    this.setState({
      numSpread: value,
    });
  };

  private executeUMAP = () => {
    const { dataMatrix, distanceFn } = this.props;

    console.log('dataMatrix', dataMatrix);
    console.log('distanceFn', distanceFn);

    // is this an update? if so, halt any previous executions
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    this.setState({
      currentEpoch: undefined,
      plotlyData: new Array<IPlotlyData>(),
      ranges: UMAPVisualization.initialState.ranges,
      totalNumberEpochs: undefined,
      umapEmbedding: [],
    });

    // start processing umap
    const t0 = performance.now();
    this.timeout1 = setTimeout(() => {
      const { numDimensions, numNeighbors, numSpread, numMinDist } = this.state;
      const umap = new UMAP({
        distanceFn,
        minDist: numMinDist,
        nComponents: numDimensions,
        nNeighbors: numNeighbors,
        spread: numSpread,
      });

      const optimalNumberEpochs = umap.initializeFit(dataMatrix);
      console.log(`UMAP wants to do ${optimalNumberEpochs} epochs`);

      const stepUmapFn = (epochCounter: number) => {
        if (epochCounter % this.props.numIterationsBeforeReRender === 0 && epochCounter < optimalNumberEpochs) {
          if (epochCounter % 50 === 0) {
            console.log(`${epochCounter} :: ${(performance.now() - t0) / 1000} sec`);
          }
          const umapEmbedding = umap.getEmbedding();
          if (epochCounter === 0) {
            console.log('embedding:', umapEmbedding);
          }

          const ranges = { ...UMAPVisualization.initialState.ranges };
          umapEmbedding.forEach(row => {
            ranges.maxX = Math.max(ranges.maxX, row[0] + 2);
            ranges.maxY = Math.max(ranges.maxY, row[1] + 2);
            ranges.maxZ = Math.max(ranges.maxZ, row[2] + 2);
            ranges.minX = Math.min(ranges.minX, row[0] - 2);
            ranges.minY = Math.min(ranges.minY, row[1] - 2);
            ranges.minZ = Math.min(ranges.minZ, row[2] - 2);
          });

          const plotlyData = this.getData(umapEmbedding, this.props.dataLabels, this.props.tooltipNames);

          this.setState({
            currentEpoch: epochCounter + 1,
            plotlyData,
            ranges,
            totalNumberEpochs: optimalNumberEpochs,
            umapEmbedding,
          });
        }
        umap.step();
        if (epochCounter <= optimalNumberEpochs) {
          this.timeout2 = setTimeout(() => {
            stepUmapFn(epochCounter + 1);
          });
        }
      };

      this.setState({
        dataVisibility: {},
      });
      stepUmapFn(0);
    });
  };

  private onLegendClick = (event: BioblocksChartEvent) => {
    if ('expandedIndex' in event.plotlyEvent && event.plotlyEvent.expandedIndex !== undefined) {
      const { dataVisibility } = this.state;
      const { expandedIndex } = event.plotlyEvent;

      this.setState({
        dataVisibility: {
          ...dataVisibility,
          [expandedIndex]: dataVisibility[expandedIndex] === undefined ? false : !dataVisibility[expandedIndex],
        },
      });
    }

    return false;
  };
}
