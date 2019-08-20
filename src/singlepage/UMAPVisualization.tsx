import * as Papa from 'papaparse';
import * as React from 'react';
import { UMAP } from 'umap-js';
// tslint:disable-next-line: no-submodule-imports
import { euclidean } from 'umap-js/dist/umap';

import { Button, Grid, Label, Popup } from 'semantic-ui-react';
import {
  ComponentCard,
  defaultPlotlyConfig,
  defaultPlotlyLayout,
  IComponentMenuBarItem,
  PlotlyChart,
} from '~bioblocks-viz~/component';
import { BioblocksChartEvent, ILabel, IPlotlyData, Marker, SeqRecord } from '~bioblocks-viz~/data';
import { readFileAsText } from '~bioblocks-viz~/helper';

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
  // the data to display (will be subsampled) - if sampleNames are provided sampleNames.length must equal dataMatrix.length
  dataLabels?: Array<ILabel | undefined>;
  dataMatrix: number[][];
  distanceFn?: DISTANCE_FN_TYPE;
  errorMessages: string[];
  iconSrc?: string;
  minDist: number;
  nComponents: 2 | 3;
  nNeighbors: number;
  numIterationsBeforeReRender: number;
  spread: number;
  tooltipNames?: string[];
}

export interface IUMAPVisualizationState {
  currentEpoch: number | undefined;
  dataVisibility: Record<number, boolean>;
  plotlyData: Array<Partial<IPlotlyData>>;
  ranges: {
    maxX: number;
    maxY: number;
    maxZ: number;
    minX: number;
    minY: number;
    minZ: number;
  };
  totalNumberEpochs: number | undefined;
  umapEmbedding: number[][];
}

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
  console.log(`n: ${n}`);
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
    const { dataMatrix, labelCategory, numIterationsBeforeReRender, ...rest } = this.props;
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
    const { categoricalAnnotations, sampleNames, dataMatrix, numSamplesToShow } = this.props;
    const {} = this.state;

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
      randomSequencesDataMatrix: new Array(new Array<number>()),
      seqNameToTaxonomyMetadata: {},
      subsampledSequences: new Array(),
    };
  }

  public componentDidMount() {
    this.prepareData();
  }

  public componentDidUpdate(prevProps: IUMAPSequenceContainerProps, prevState: IUMAPSequenceContainerState) {
    const { allSequences, numSequencesToShow, labelCategory, taxonomyText } = this.props;

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
    const { numIterationsBeforeReRender, showUploadButton, ...rest } = this.props;
    const { labelCategory, randomSequencesDataMatrix, seqNameToTaxonomyMetadata, subsampledSequences } = this.state;
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
              dataLabels={dataLabels}
              dataMatrix={randomSequencesDataMatrix}
              distanceFn={this.equalityHammingDistance}
              errorMessages={[]}
              numIterationsBeforeReRender={numIterationsBeforeReRender}
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

  protected onTaxonomyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    const files = (e.target as HTMLInputElement).files;
    if (!files) {
      return;
    }
    const file = files.item(0) as File;
    this.parseTaxonomy(await readFileAsText(file));
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
    const { allSequences, numSequencesToShow, labelCategory, taxonomyText } = this.props;

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
          console.log(`Raw taxonomy contains ${results.data.length} sequences:`, results.data);

          // const labelProperties = this.getClassPhylumLabelDescription(); // todo: auto compute
          this.setState({
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
    distanceFn: euclidean,
    errorMessages: [],
    minDist: 0.99,
    nComponents: 2,
    nNeighbors: 15,
    numIterationsBeforeReRender: 1,
    spread: 1,
  };

  private timeout1: number | undefined;
  private timeout2: number | undefined;

  constructor(props: IUMAPVisualizationProps) {
    super(props);
    this.state = {
      currentEpoch: undefined,
      dataVisibility: {},
      plotlyData: new Array(),
      ranges: {
        maxX: 20,
        maxY: 20,
        maxZ: 20,
        minX: -20,
        minY: -20,
        minZ: -20,
      },
      totalNumberEpochs: undefined,
      umapEmbedding: new Array(new Array<number>()),
    };
  }

  public componentDidMount() {
    this.executeUMAP();
  }

  // tslint:disable-next-line: max-func-body-length
  public componentDidUpdate(prevProps: IUMAPVisualizationProps, prevState: IUMAPVisualizationState) {
    const { distanceFn, dataMatrix, dataLabels, tooltipNames } = this.props;
    const { dataVisibility } = this.state;
    if (distanceFn !== prevProps.distanceFn || dataMatrix !== prevProps.dataMatrix) {
      this.executeUMAP();
    } else if (
      dataLabels !== prevProps.dataLabels ||
      tooltipNames !== prevProps.tooltipNames ||
      dataVisibility !== prevState.dataVisibility
    ) {
      this.setState({
        plotlyData: this.getData(this.state.umapEmbedding, this.props.dataLabels, this.props.tooltipNames),
      });
    }
  }

  public render() {
    const { iconSrc, nComponents } = this.props;
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
          dockItems={[{ text: `${umapEmbedding.length} sequences | ${epochInfo ? epochInfo : ''}`, isLink: false }]}
          iconSrc={iconSrc}
          isDataReady={epochInfo !== undefined}
          menuItems={this.getMenuItems()}
          width={`${legendStats.legendWidth + 525}px`}
        >
          {nComponents === 2 ? this.render2D(legendStats.showLegend) : this.render3D(legendStats.showLegend)}
        </ComponentCard>
      </div>
    );
  }

  protected getLegendStats = () => {
    const { plotlyData } = this.state;
    const legend: SVGGElement | undefined = document.getElementsByClassName('legend')[0] as SVGGElement;
    const legendWidth = legend ? legend.getBBox().width * 0.75 : 0;

    return {
      legendWidth,
      // Show legend if:
      // 2 or more data arrays.
      // Only 1 data array with no name - OR - a name that is not unannotated.
      showLegend:
        plotlyData.length >= 2 ||
        (plotlyData.length === 1 &&
          (plotlyData[0].name === undefined ||
            (plotlyData[0].name !== undefined && !plotlyData[0].name.includes('Unannotated')))),
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
            traceorder: 'reversed',
            x: 1,
            y: 1,
          },
          margin: {
            b: 20,
          },
          showlegend: showLegend,
          xaxis: { autorange: false, range: [Math.floor(ranges.minX), Math.ceil(ranges.maxX)] },
          yaxis: { autorange: false, range: [Math.floor(ranges.minY), Math.ceil(ranges.maxY)] },
        }}
        data={plotlyData}
        onLegendClickCallback={this.onLegendClick}
        showLoader={true}
      />
    );
  };

  protected render3D = (showLegend: boolean) => {
    const { ranges, plotlyData } = this.state;

    return (
      <PlotlyChart
        config={{
          ...defaultPlotlyConfig,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            'resetCameraDefault3d',
            'resetCameraLastSave3d',
            'hoverClosest3d',
            'toggleHover',
            'toImage',
          ],
          scrollZoom: true,
        }}
        layout={{
          ...defaultPlotlyLayout,
          dragmode: 'turntable',
          legend: {
            itemdoubleclick: false,
            traceorder: 'reversed',
            x: 0.85,
            y: 0.95,
          },
          margin: {
            b: 20,
            l: 0,
            r: 5,
          },
          scene: {
            aspectmode: 'cube',
            xaxis: { autorange: false, range: [Math.floor(ranges.minX), Math.ceil(ranges.maxX)] },
            yaxis: { autorange: false, range: [Math.floor(ranges.minY), Math.ceil(ranges.maxY)] },
            zaxis: { autorange: false, range: [Math.floor(ranges.minZ), Math.ceil(ranges.maxZ)] },
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

    return (Object.values(result) as IPlotlyData[])
      .sort((a, b) => a.x.length - b.x.length)
      .reverse()
      .map((data, index) => {
        const { dataVisibility } = this.state;
        data.visible = dataVisibility[index] === undefined || dataVisibility[index] === true ? true : 'legendonly';

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
          marker: {
            color: color ? color : 'gray',
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

  protected getMenuItems = (): IComponentMenuBarItem[] => {
    return [
      {
        component: {
          name: 'POPUP',
          props: {
            children: <Button />,
            disabled: false,
            position: 'top center',
            wide: 'very',
          },
        },
        description: 'settings',
      },
    ];
  };

  private executeUMAP() {
    const { dataMatrix, distanceFn } = this.props;

    console.log('dataMatrix', dataMatrix);
    console.log('distanceFn', distanceFn);

    // is this an update? if so, halt any previous executions
    clearTimeout(this.timeout1);
    clearTimeout(this.timeout2);

    // start processing umap
    const t0 = performance.now();
    this.timeout1 = setTimeout(() => {
      const { minDist, nComponents, nNeighbors, spread } = this.props;
      const umap = new UMAP({
        distanceFn,
        minDist,
        nComponents,
        nNeighbors,
        spread,
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

          const { ranges } = this.state;
          umapEmbedding.forEach(row => {
            ranges.maxX = Math.max(ranges.maxX, row[0] + 1);
            ranges.maxY = Math.max(ranges.maxY, row[1] + 1);
            ranges.maxZ = Math.max(ranges.maxZ, row[2] + 1);
            ranges.minX = Math.min(ranges.minX, row[0] - 1);
            ranges.minY = Math.min(ranges.minY, row[1] - 1);
            ranges.minZ = Math.min(ranges.minZ, row[2] - 1);
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
  }

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
