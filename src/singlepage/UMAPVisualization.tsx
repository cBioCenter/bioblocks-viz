import * as Papa from 'papaparse';
import * as React from 'react';
import { UMAP } from 'umap-js';
// tslint:disable-next-line: no-submodule-imports
import { euclidean } from 'umap-js/dist/umap';

import { Button, Dropdown, DropdownProps, Grid, Label, Popup } from 'semantic-ui-react';
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
  Marker,
  SeqRecord,
} from '~bioblocks-viz~/data';
import { EMPTY_FUNCTION, readFileAsText } from '~bioblocks-viz~/helper';

export interface IUMAPSequenceContainerProps extends Partial<IUMAPVisualizationProps> {
  // if the number of data points are too large, the container will randomly subsample points
  numSequencesToShow: number;
  numIterationsBeforeReRender: number;

  // Text from taxonomy file - only valid when umap is showing sequences:
  //   1. tab delimited with each row being a sequence
  //   2. first row is a header with column names
  //   3. must contain columns 'seq_name': values matched to fasta sequence names
  //                           'phylum': the phylum of the organism the sequence originated from
  //                           'class': the class of the organism the sequence originated from
  taxonomyText?: string;

  labelCategory: string;

  // the sequences to display (will be subsampled)
  allSequences: SeqRecord[];
  showUploadButton: boolean;
}

export interface IUMAPSequenceContainerState {
  labelCategory: string;
  labels: string[];
  seqNameToTaxonomyMetadata: {
    [seqName: string]: {
      [taxonomyCategory: string]: string;
    };
  };
  subsampledSequences: SeqRecord[];
  randomSequencesDataMatrix: number[][];
}

export interface ICategoricalAnnotation {
  [labelCategoryName: string]: {
    label_colors: {
      [labelName: string]: string;
    };
    label_list: string[]; // Discrete labels for each sample in the dataMatrix. Length must equal dataMatrix.length.
  };
}

export type IUMAPTranscriptionalContainerProps = Required<
  Pick<IUMAPVisualizationProps, 'dataMatrix' | 'numIterationsBeforeReRender'>
> &
  Partial<IUMAPVisualizationProps> & {
    // if the number of data points are too large, the container will randomly subsample points
    numSamplesToShow: number;
    categoricalAnnotations?: ICategoricalAnnotation;
    labelCategory?: string;

    // names of the samples (will be displayed in tooltip)
    sampleNames?: string[];
  };

export interface IUMAPTranscriptionalContainerState {
  // completeSampleAnnotations: ILabelCategory2;
  completeSampleAnnotations: {
    [labelCategoryName: string]: Array<ILabel | undefined>;
  };
  errorMessages: string[];
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

/**
 * TODO: move to a math or array helper class
 *
 * Randomly select and return "n" objects or indices (if returnIndices==true) and return
 * in a new array.
 *
 * If "n" is larger than the array, return the array directly or all the indices in the
 * array (if returnIndices==true).
 *
 * No duplicates are returned
 */
export function subsample<T, U extends boolean>(
  arr: T[],
  n: number,
  returnIndices: boolean = false,
): Array<T | number> {
  const unselectedObjBowl = returnIndices ? arr.map((obj, idx) => idx) : [...arr];
  if (n >= arr.length) {
    return unselectedObjBowl;
  }

  const toReturn = new Array<any>();
  while (toReturn.length < n) {
    // tslint:disable-next-line: insecure-random
    const randomIdx = Math.floor(Math.random() * unselectedObjBowl.length); // btw 0 and length of in sequenceBowl
    toReturn.push(unselectedObjBowl[randomIdx]);
    unselectedObjBowl.splice(randomIdx, 1);
  }

  return toReturn;
}

export class UMAPTranscriptionalContainer extends React.Component<
  IUMAPTranscriptionalContainerProps,
  IUMAPTranscriptionalContainerState
> {
  public static defaultProps = {
    numIterationsBeforeReRender: 1,
    numSamplesToShow: 4000,
  };

  private subsampledIndices = new Array<number>();

  constructor(props: IUMAPTranscriptionalContainerProps) {
    super(props);
    this.state = {
      completeSampleAnnotations: {},
      errorMessages: [],
    };
  }

  public componentDidMount() {
    this.prepareData();
  }

  public componentDidUpdate(
    prevProps: IUMAPTranscriptionalContainerProps,
    prevState: IUMAPTranscriptionalContainerState,
  ) {
    if (
      prevProps.dataMatrix !== this.props.dataMatrix ||
      prevProps.numSamplesToShow !== this.props.numSamplesToShow ||
      prevProps.sampleNames !== this.props.sampleNames ||
      prevProps.categoricalAnnotations !== this.props.categoricalAnnotations ||
      prevProps.labelCategory !== this.props.labelCategory
    ) {
      console.log('UMAP T Preparing data');
      this.prepareData(prevProps.categoricalAnnotations === this.props.categoricalAnnotations);
    }
  }

  public render() {
    const { dataMatrix, labelCategory, numIterationsBeforeReRender, numSamplesToShow, ...rest } = this.props;
    const { completeSampleAnnotations, errorMessages } = this.state;

    let dataLabels = new Array<ILabel | undefined>();
    let subsampledSampleNames = new Array<string>();
    let subsampledData = new Array(new Array<number>());

    if (this.subsampledIndices.length > 0) {
      subsampledData = this.subsampledIndices.map(idx => dataMatrix[idx]);

      if (labelCategory && completeSampleAnnotations && completeSampleAnnotations[labelCategory]) {
        const labelAnnotations = completeSampleAnnotations[labelCategory];
        dataLabels = this.subsampledIndices.map(idx => {
          return labelAnnotations[idx];
        });
        subsampledSampleNames = this.subsampledIndices.map(idx => {
          const sampleLabel = labelAnnotations[idx];

          return sampleLabel ? sampleLabel.name : 'unannotated';
        });
      }
    }

    return (
      <UMAPVisualization
        dataLabels={dataLabels}
        dataMatrix={subsampledData}
        errorMessages={errorMessages}
        tooltipNames={subsampledSampleNames}
        numIterationsBeforeReRender={numIterationsBeforeReRender}
        {...rest}
      />
    );
  }

  private prepareData(annotationsUnchanged: boolean = false) {
    const { categoricalAnnotations, dataMatrix, numSamplesToShow, sampleNames } = this.props;

    // rudimentary error checking
    const errorMessages = new Array<string>();
    if (sampleNames && dataMatrix.length !== sampleNames.length) {
      errorMessages.push(
        `The ${sampleNames.length} sample names provided do not account for all ${dataMatrix.length} data matrix rows.`,
      );
    }
    if (annotationsUnchanged === false && categoricalAnnotations) {
      Object.keys(categoricalAnnotations).forEach(labelCategory => {
        const category = categoricalAnnotations[labelCategory];
        if (category.label_list.length !== dataMatrix.length) {
          errorMessages.push(
            `Label category ${labelCategory} does not provide labels for all ${dataMatrix.length} samples in the data matrix.`,
          );
        }
      });
    }

    // auto generate marker properties if they are not explicitly set
    let annotations = this.state.completeSampleAnnotations;
    if (annotationsUnchanged === false) {
      annotations = {};
      if (categoricalAnnotations) {
        Object.keys(categoricalAnnotations).forEach(catName => {
          // build the annotations state object from the prop
          const propLabelList = categoricalAnnotations[catName].label_list;
          const propLabelColors = categoricalAnnotations[catName].label_colors;

          let stateLabelStyles;
          if (!propLabelColors || Object.keys(propLabelColors).length === 0) {
            // auto generate styles for the labels
            stateLabelStyles = Marker.colors.autoColorFromStates(propLabelList);
          } else {
            stateLabelStyles = propLabelList.map(labelName => {
              if (propLabelColors[labelName]) {
                return {
                  color: propLabelColors[labelName],
                  name: labelName,
                };
              }

              return undefined;
            });
          }

          annotations[catName] = stateLabelStyles;
        });
      }
    }

    // subsample data if needed
    if (!this.subsampledIndices || this.subsampledIndices.length !== numSamplesToShow) {
      this.subsampledIndices = subsample(this.props.dataMatrix, numSamplesToShow, true) as number[];
    }
    this.setState({
      completeSampleAnnotations: annotations,
      errorMessages,
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UMAPSequenceContainer extends React.Component<IUMAPSequenceContainerProps, IUMAPSequenceContainerState> {
  public static defaultProps = {
    labelCategory: 'class',
    numIterationsBeforeReRender: 1,
    numSequencesToShow: 4000,
    showUploadButton: false,
  };

  constructor(props: IUMAPSequenceContainerProps) {
    super(props);
    this.state = {
      labelCategory: '',
      labels: [],
      randomSequencesDataMatrix: new Array(new Array<number>()),
      seqNameToTaxonomyMetadata: {},
      subsampledSequences: new Array(),
    };
  }

  public componentDidMount() {
    this.prepareData();
  }

  public componentDidUpdate(prevProps: IUMAPSequenceContainerProps, prevState: IUMAPSequenceContainerState) {
    const { allSequences, labelCategory, numSequencesToShow, taxonomyText } = this.props;

    if (
      prevProps.allSequences !== allSequences ||
      prevProps.numSequencesToShow !== numSequencesToShow ||
      prevProps.labelCategory !== labelCategory ||
      prevProps.taxonomyText !== taxonomyText
    ) {
      let onlyAnnotationChanged = true;
      prevProps.allSequences.forEach((seq, index) => {
        if (seq.sequence.localeCompare(allSequences[index].sequence) !== 0) {
          onlyAnnotationChanged = false;

          return;
        }
      });
      if (onlyAnnotationChanged) {
        if (taxonomyText) {
          this.parseTaxonomy(taxonomyText);
        } else {
          // If sequence metadata only was updated, don't re-sample data.
          this.setupSequenceAnnotation(allSequences, labelCategory);
        }
      } else {
        this.prepareData();
      }
    }
  }

  public render() {
    const { allSequences, numIterationsBeforeReRender, showUploadButton, ...rest } = this.props;
    const {
      labelCategory,
      labels,
      randomSequencesDataMatrix,
      seqNameToTaxonomyMetadata,
      subsampledSequences,
    } = this.state;
    if (subsampledSequences) {
      const tooltipNames = subsampledSequences.map(seq => (seq.annotations.name ? seq.annotations.name : ''));

      let dataLabels = new Array<ILabel | undefined>();
      if (seqNameToTaxonomyMetadata) {
        const seqStates = subsampledSequences.map(seq => {
          if (seq.annotations.name && seqNameToTaxonomyMetadata[seq.annotations.name]) {
            return seqNameToTaxonomyMetadata[seq.annotations.name][labelCategory];
          }

          return undefined;
        });

        dataLabels = Marker.colors.autoColorFromStates(seqStates);
      }

      return (
        <Grid centered={true} padded={true}>
          <Grid.Row>
            <UMAPVisualization
              currentLabel={labelCategory}
              dataLabels={dataLabels}
              dataMatrix={randomSequencesDataMatrix}
              distanceFn={this.equalityHammingDistance}
              errorMessages={[]}
              labels={labels}
              numIterationsBeforeReRender={numIterationsBeforeReRender}
              onLabelChange={this.onLabelChange}
              tooltipNames={tooltipNames}
              {...rest}
            />
          </Grid.Row>
          {showUploadButton && <Grid.Row>{this.renderTaxonomyUpload()}</Grid.Row>}
        </Grid>
      );
    }

    return null;
  }

  protected renderTaxonomyUpload = () => {
    return (
      <Popup
        trigger={
          <Label as={'label'} basic={true} htmlFor={'upload-taxonomy'}>
            <Button
              icon={'upload'}
              label={{
                basic: true,
                content: 'Upload Taxonomy File',
              }}
              labelPosition={'right'}
            />
            <input
              hidden={true}
              id={'upload-taxonomy'}
              multiple={false}
              onChange={this.onTaxonomyUpload}
              required={true}
              type={'file'}
            />
          </Label>
        }
        content={
          <>
            <span>A tab delimited file with 2 columns and optional headers:</span>
            <br />
            <span>- First column is sequence name.</span>
            <br />
            <span>- Second column is how to group sequences.</span>
          </>
        }
      />
    );
  };

  protected onLabelChange = (event: React.SyntheticEvent, data: DropdownProps) => {
    this.setState({
      labelCategory: data.value as string,
    });
  };

  protected onTaxonomyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const file = files.item(0) as File;
    this.parseTaxonomy(await readFileAsText(file));
  };

  protected onNumSequenceChange = (value: number) => {
    console.log(`Setting num seqs to ${value}`);
  };

  /* testing
  public flipAnnotation() {
    const thisObj = this;
    const selectedCat = this.state.selectedLabelCategory;
    setTimeout(() => {
      if (selectedCat === 'class') {
        thisObj.setState({
          selectedLabelCategory: 'phylum',
        });
      } else if (selectedCat === 'phylum') {
        thisObj.setState({
          selectedLabelCategory: 'class',
        });
      }

      thisObj.flipAnnotation();
    }, 5000);
  }*/

  private prepareData() {
    const { allSequences, labelCategory, numSequencesToShow, taxonomyText } = this.props;

    // load taxonomy
    if (taxonomyText) {
      this.parseTaxonomy(taxonomyText); // await taxonomyFile.text());
    } else {
      this.setupSequenceAnnotation(allSequences, labelCategory);
    }

    // load sequences
    console.log(`all ${allSequences.length} fasta sequences:`, allSequences);

    // slice reasonable number of sequences if needed
    let subsampledSequences = this.state ? this.state.subsampledSequences : undefined;
    if (!subsampledSequences || subsampledSequences.length !== numSequencesToShow) {
      subsampledSequences = subsample(this.props.allSequences, numSequencesToShow) as SeqRecord[];
    }
    console.log(`random ${subsampledSequences.length} fasta sequences:`, subsampledSequences);

    this.setState({
      labelCategory,
      randomSequencesDataMatrix: subsampledSequences.map(seq => {
        return seq.integerRepresentation(['-']);
      }),
      subsampledSequences,
    });

    // temporary for testing - flip the color annotation
    // this.flipAnnotation();
  }

  private parseTaxonomy(taxonomyText: string) {
    if (taxonomyText) {
      const isHeaderPresent = taxonomyText.split('\n')[0].includes('seq_name');
      Papa.parse(taxonomyText, {
        complete: results => {
          // simple stats
          // const labelProperties = this.getClassPhylumLabelDescription(); // todo: auto compute
          this.setState({
            labels: isHeaderPresent
              ? results.meta.fields.filter(field => field.toLocaleLowerCase() !== 'sequence')
              : [],
            seqNameToTaxonomyMetadata: results.data.reduce<{
              [seqName: string]: {};
            }>((acc, seqMetadata: { seq_name: string } | string[]) => {
              if (isHeaderPresent) {
                acc[(seqMetadata as { seq_name: string }).seq_name] = seqMetadata;
              } else {
                const seqRow = seqMetadata as string[];
                acc[seqRow[0]] = {
                  seq_name: seqRow[0],
                  [this.props.labelCategory]: seqRow[1],
                };
              }

              return acc;
            }, {}),
          });
        },
        header: isHeaderPresent,
      });
    }
  }

  /**
   * A special hamming distance function that is speed optimized for sequence comparisons.
   * Assumes that sequences are passed with a single integer for each position. If
   * the position is the same in each position then the distance is zero, otherwise
   * the distance is one. The total distance is then the sum of each positional distance.
   * @returns the total distance between a pair of sequences.
   */
  private equalityHammingDistance = (seq1: number[], seq2: number[]) => {
    let result = 0;
    for (let i = 0; i < seq1.length; i++) {
      if (seq1[i] !== seq2[i]) {
        result += 1;
      }
    }

    return result;
  };

  private setupSequenceAnnotation = (allSequences: SeqRecord[], labelCategory: string) => {
    this.setState({
      seqNameToTaxonomyMetadata: allSequences.reduce<{
        [seqName: string]: {};
      }>((acc, seq) => {
        if (seq.annotations.name && seq.annotations.metadata) {
          acc[seq.annotations.name] = {
            [labelCategory]: seq.annotations.metadata[labelCategory],
          };
        }

        return acc;
      }, {}),
    });
  };
}

// tslint:disable-next-line: max-classes-per-file
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
