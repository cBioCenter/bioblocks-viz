import * as Papa from 'papaparse';
import * as React from 'react';
import { UMAP } from 'umap-js';
// tslint:disable-next-line: no-submodule-imports
import { euclidean } from 'umap-js/dist/umap';

import { ComponentCard, defaultPlotlyLayout, PlotlyChart } from '~bioblocks-viz~/component';
import { ILabel, ILabelCategory } from '~bioblocks-viz~/data/Label';
import { Marker } from '~bioblocks-viz~/data/Markers';
import { SeqIO, SEQUENCE_FILE_TYPES } from '~bioblocks-viz~/data/SeqIO';
import { SeqRecord } from '~bioblocks-viz~/data/SeqRecord';

export interface IUMAPSequenceContainerProps {
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

  initialLabelCategory: string;

  // text from multiple sequence alignment file (in fasta format)
  allSequences: SeqRecord[];
}
export interface IUMAPSequenceContainerState {
  selectedLabelCategory: string;
  seqnameToTaxonomyMetadata: Record<string, Record<string, string>>;
  subsampledSequences: SeqRecord[];
  randomSequencesDataMatrix: number[][];
}

export interface IUMAPTranscriptionalContainerProps {
  // if the number of data points are too large, the container will randomly subsample points
  numSamplesToShow: number;
}
export interface IUMAPTranscriptionalContainerState {
  placeholder: number;
}

export type DISTANCE_FN_TYPE = (arg1: number[], arg2: number[]) => number;

export interface IUMAPVisualizationProps {
  dataMatrix: number[][];
  dataLabels?: Array<ILabel | undefined>;
  numIterationsBeforeReRender: number;
  tooltipNames?: string[];
  distanceFn?: DISTANCE_FN_TYPE;

  // the initial min/max of the x-axis and y-axis. If null, will be set from data.
  xRange: number[];
  yRange: number[];
}

export interface IUMAPVisualizationState {
  umapEmbedding: number[][];
}

export class UMAPTransciptionalContainer extends React.Component<
  IUMAPTranscriptionalContainerProps,
  IUMAPTranscriptionalContainerState
> {
  public static defaultProps = {};
}

// tslint:disable-next-line: max-classes-per-file
export class UMAPSequenceContainer extends React.Component<IUMAPSequenceContainerProps, IUMAPSequenceContainerState> {
  public static defaultProps = {
    initialLabelCategory: 'class',
    numIterationsBeforeReRender: 1,
    numSequencesToShow: 2000,
  };

  constructor(props: IUMAPSequenceContainerProps) {
    super(props);
  }

  public async componentDidMount() {
    this.loadFiles();
  }

  public async componentDidUpdate(prevProps: IUMAPSequenceContainerProps, prevState: IUMAPSequenceContainerState) {
    if (prevProps.taxonomyText !== this.props.taxonomyText || prevProps.allSequences !== this.props.allSequences) {
      this.loadFiles();
    }
  }

  public render() {
    const { numIterationsBeforeReRender } = this.props;
    if (this.state && this.state.subsampledSequences) {
      const { seqnameToTaxonomyMetadata, subsampledSequences, randomSequencesDataMatrix } = this.state;
      const tooltipNames = subsampledSequences.map(seq => (seq.annotations.name ? seq.annotations.name : ''));

      let dataLabels = new Array<ILabel | undefined>();
      if (seqnameToTaxonomyMetadata) {
        const seqStates = subsampledSequences.map(seq => {
          if (seq.annotations.name && seqnameToTaxonomyMetadata[seq.annotations.name]) {
            return seqnameToTaxonomyMetadata[seq.annotations.name][this.state.selectedLabelCategory];
          }

          return undefined;
        });

        dataLabels = Marker.colors.autoColorFromStates(seqStates);
      }

      return (
        <UMAPVisualization
          dataLabels={dataLabels}
          dataMatrix={randomSequencesDataMatrix}
          tooltipNames={tooltipNames}
          numIterationsBeforeReRender={numIterationsBeforeReRender}
          distanceFn={this.equalityHammingDistance}
        />
      );
    }

    return null;
  }

  /*
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

  private loadFiles() {
    const { numSequencesToShow, initialLabelCategory } = this.props;

    // load taxonomy
    if (this.props.taxonomyText) {
      this.parseTaxonomy(this.props.taxonomyText); // await taxonomyFile.text());
    }
    // load sequences
    console.log(`all ${this.props.allSequences.length} fasta sequences:`, this.props.allSequences);

    // slice reasonable number of sequences
    const subsampledSequences = SeqIO.getRandomSetOfSequences(this.props.allSequences, numSequencesToShow);
    console.log(`random ${subsampledSequences.length} fasta sequences:`, subsampledSequences);

    this.setState({
      randomSequencesDataMatrix: subsampledSequences.map(seq => {
        return seq.integerRepresntation(['-']);
      }),
      selectedLabelCategory: initialLabelCategory,
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
            seqnameToTaxonomyMetadata: results.data.reduce<{
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
    numIterationsBeforeReRender: 1,
    xRange: [-20, 20],
    yRange: [-20, 20],
  };

  private timeout1: number | undefined;
  private timeout2: number | undefined;

  constructor(props: IUMAPVisualizationProps) {
    super(props);
    this.state = {
      umapEmbedding: new Array<number[]>(),
    };
  }

  public async componentDidMount() {
    this.executeUMAP();
  }

  // tslint:disable-next-line: max-func-body-length
  public async componentDidUpdate(prevProps: IUMAPVisualizationProps, prevState: IUMAPVisualizationState) {
    if (this.props.distanceFn !== prevProps.distanceFn || this.props.dataMatrix !== prevProps.dataMatrix) {
      this.executeUMAP();
    }
    /* // WORKING FOR UMAP scRNAseq dataset
    const { numIterationsBeforeReRender } = this.props;

    const data = await fetchMatrixData('datasets/hpc/full/tsne_matrix.csv');

    const { numIterationsBeforeReRender } = this.props;
    console.log(`UMAP got data (${data.length}, ${data[0].length})`);

    const umap = new UMAP({ nComponents: 2 });
    const nEpochs = umap.initializeFit(data);
    console.log(`UMAP wants to do ${nEpochs} epochs`);

    const stepUmapFn = (counter: number) => {
      if (counter % numIterationsBeforeReRender === 0 && counter <= nEpochs) {
        console.log(`UMAP on iteration ${counter}`);
        const embedding = umap.getEmbedding();
        this.setState({
          twoDimensionalData: embedding,
        });
      }
      umap.step();
      if (counter <= nEpochs) {
        setTimeout(() => {
          stepUmapFn(counter + 1);
        });
      }
    };

    setTimeout(() => {
      stepUmapFn(0);
    });*/
  }
  public render() {
    const { tooltipNames, xRange, yRange } = this.props;

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

    return (
      <div>
        <ComponentCard componentName={'UMAPVisualization'}>
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
            showLoader={false}
          />
        </ComponentCard>
      </div>
    );
  }

  private executeUMAP() {
    const { dataMatrix, distanceFn } = this.props;

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
        if (epochCounter % this.props.numIterationsBeforeReRender === 0 && epochCounter <= optimalNumberEpochs) {
          if (epochCounter % 50 === 0) {
            console.log(`${epochCounter} :: ${(performance.now() - t0) / 1000} sec`);
          }
          const embedding = umap.getEmbedding();
          if (epochCounter === 0) {
            console.log('embedding:', embedding);
          }

          this.setState({
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
