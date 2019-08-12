import * as Papa from 'papaparse';
import * as React from 'react';
import { UMAP } from 'umap-js';
// tslint:disable-next-line: no-submodule-imports
import { euclidean } from 'umap-js/dist/umap';

import { ComponentCard, defaultPlotlyLayout, PlotlyChart } from '~bioblocks-viz~/component';
import { ILabel, Marker, SeqRecord } from '~bioblocks-viz~/data';

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
  dataMatrix: number[][];
  dataLabels?: Array<ILabel | undefined>;
  numIterationsBeforeReRender: number;
  errorMessages: string[];
  tooltipNames?: string[];
  distanceFn?: DISTANCE_FN_TYPE;

  // the initial min/max of the x-axis and y-axis. If null, will be set from data.
  xRange: number[];
  yRange: number[];

  iconSrc?: string;
}

export interface IUMAPVisualizationState {
  currentEpoch: number | undefined;
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
export function subsample(arr: any[], n: number, returnIndices: boolean = false): any[] {
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
    numSequencesToShow: 2000,
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
    if (
      prevProps.allSequences !== this.props.allSequences ||
      prevProps.numSequencesToShow !== this.props.numSequencesToShow ||
      prevProps.labelCategory !== this.props.labelCategory ||
      prevProps.taxonomyText !== this.props.taxonomyText
    ) {
      this.prepareData();
    }
  }

  public render() {
    const { numIterationsBeforeReRender, ...rest } = this.props;
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
        <UMAPVisualization
          dataLabels={dataLabels}
          dataMatrix={randomSequencesDataMatrix}
          distanceFn={this.equalityHammingDistance}
          errorMessages={[]}
          numIterationsBeforeReRender={numIterationsBeforeReRender}
          tooltipNames={tooltipNames}
          {...rest}
        />
      );
    }

    return null;
  }

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
    const { numSequencesToShow, labelCategory: labelCategory } = this.props;

    // load taxonomy
    if (this.props.taxonomyText) {
      this.parseTaxonomy(this.props.taxonomyText); // await taxonomyFile.text());
    }
    // load sequences
    console.log(`all ${this.props.allSequences.length} fasta sequences:`, this.props.allSequences);

    // slice reasonable number of sequences if needed
    let subsampledSequences = this.state ? this.state.subsampledSequences : undefined;
    if (!subsampledSequences || subsampledSequences.length !== numSequencesToShow) {
      subsampledSequences = subsample(this.props.allSequences, numSequencesToShow);
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
      Papa.parse(taxonomyText, {
        complete: results => {
          // simple stats
          console.log(`Raw taxonomy contains ${results.data.length} sequences:`, results.data);

          // const labelProperties = this.getClassPhylumLabelDescription(); // todo: auto compute
          this.setState({
            seqNameToTaxonomyMetadata: results.data.reduce<{
              [seqName: string]: {};
            }>((acc, seqMetadata: { seq_name: string }) => {
              acc[seqMetadata.seq_name] = seqMetadata;

              return acc;
            }, {}),
          });
        },
        header: true,
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
}

// tslint:disable-next-line: max-classes-per-file
export class UMAPVisualization extends React.Component<IUMAPVisualizationProps, IUMAPVisualizationState> {
  public static defaultProps = {
    distanceFn: euclidean,
    errorMessages: [],
    numIterationsBeforeReRender: 1,
    xRange: [-20, 20],
    yRange: [-20, 20],
  };

  private timeout1: number | undefined;
  private timeout2: number | undefined;

  constructor(props: IUMAPVisualizationProps) {
    super(props);
    this.state = {
      currentEpoch: undefined,
      totalNumberEpochs: undefined,
      umapEmbedding: new Array(new Array<number>()),
    };
  }

  public componentDidMount() {
    this.executeUMAP();
  }

  // tslint:disable-next-line: max-func-body-length
  public componentDidUpdate(prevProps: IUMAPVisualizationProps, prevState: IUMAPVisualizationState) {
    if (this.props.distanceFn !== prevProps.distanceFn || this.props.dataMatrix !== prevProps.dataMatrix) {
      this.executeUMAP();
    }
  }
  public render() {
    const { iconSrc, tooltipNames, xRange, yRange } = this.props;

    let plotType: string = 'scattergl';
    const dataX = new Float32Array(this.state.umapEmbedding.map(datum => datum[0]));
    const dataY = new Float32Array(this.state.umapEmbedding.map(datum => datum[1]));
    let dataZ: Float32Array | undefined;
    if (this.state.umapEmbedding && this.state.umapEmbedding.length > 0 && this.state.umapEmbedding[0].length > 2) {
      dataZ = new Float32Array(this.state.umapEmbedding.map(datum => datum[3]));
      plotType = 'scatter3d';
    }

    let colors = new Array<string>();
    if (
      this.props.dataLabels &&
      this.state.umapEmbedding &&
      this.props.dataLabels.length === this.state.umapEmbedding.length
    ) {
      colors = this.props.dataLabels.map(lbl => {
        if (lbl) {
          return lbl.color;
        }

        return 'gray';
      });
    }

    // smart range setting
    if (xRange[0] > Math.min(...dataX)) {
      xRange[0] = Math.min(...dataX) - 5;
    }
    if (xRange[1] < Math.max(...dataX)) {
      xRange[1] = Math.max(...dataX) + 5;
    }
    if (yRange[0] > Math.min(...dataY)) {
      yRange[0] = Math.min(...dataY) - 5;
    }
    if (yRange[1] < Math.max(...dataY)) {
      yRange[1] = Math.max(...dataY) + 5;
    }

    let epochInfo: string | undefined;
    if (this.state.totalNumberEpochs && this.state.currentEpoch) {
      epochInfo = `epoch ${this.state.currentEpoch}/${this.state.totalNumberEpochs}`;
    }

    return (
      <div>
        <ComponentCard
          componentName={'UMAP'}
          dockItems={[{ text: epochInfo ? epochInfo : '', isLink: false }]}
          iconSrc={iconSrc}
          isDataReady={epochInfo !== undefined}
        >
          <PlotlyChart
            layout={{
              ...defaultPlotlyLayout,
              dragmode: 'zoom', // 'select',
              margin: {
                b: 20,
              },
              xaxis: { autorange: false, range: xRange },
              yaxis: { autorange: false, range: yRange },
            }}
            data={[
              {
                marker: {
                  color: colors,
                },
                mode: 'markers',
                text: tooltipNames,
                type: 'scattergl' as const, // scatter3d
                x: dataX,
                y: dataY,
                // z: dataZ,
              },
            ]}
            showLoader={true}
          />
        </ComponentCard>
      </div>
    );
  }

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
      const umap = new UMAP({
        distanceFn,
        minDist: 0.99,
        nComponents: 2,
        nNeighbors: 15,
        spread: 1,
      });

      const optimalNumberEpochs = umap.initializeFit(dataMatrix);
      console.log(`UMAP wants to do ${optimalNumberEpochs} epochs`);

      const stepUmapFn = (epochCounter: number) => {
        if (epochCounter % this.props.numIterationsBeforeReRender === 0 && epochCounter < optimalNumberEpochs) {
          if (epochCounter % 50 === 0) {
            console.log(`${epochCounter} :: ${(performance.now() - t0) / 1000} sec`);
          }
          const embedding = umap.getEmbedding();
          if (epochCounter === 0) {
            console.log('embedding:', embedding);
          }

          this.setState({
            currentEpoch: epochCounter + 1,
            totalNumberEpochs: optimalNumberEpochs,
            umapEmbedding: embedding,
          });
        }
        umap.step();
        if (epochCounter <= optimalNumberEpochs) {
          this.timeout2 = setTimeout(() => {
            stepUmapFn(epochCounter + 1);
          });
        }
      };

      stepUmapFn(0);
    });
  }
}
