// import { fromJS, List } from 'immutable';
import * as Papa from 'papaparse';
import * as React from 'react';
import { UMAP } from 'umap-js';

// import { setTimeout } from 'timers';
// import { Seq } from 'immutable';
import { ComponentCard, defaultPlotlyLayout, PlotlyChart } from '~bioblocks-viz~/component';
// import { parsePath } from 'history';
// import { fetchMatrixData } from '~bioblocks-viz~/helper';

export interface IUMAPVisualizationProps {
  numIterationsBeforeReRender: number;
  numSequencesToShow: number;
}

export interface IUMAPVisualizationState {
  allSequencesFastaFile: null | FastaFile;
  selectedSequencesFastaFile: null | FastaFile;
  taxonomy: null | { [key: string]: { [key: string]: string } };
  twoDimensionalData: number[][];
}

export const fetchFastaFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return FastaFile.fromFileText(await response.text());
  } else {
    throw new Error('error' + response);
  }
};

export interface SequenceEntry {
  title: string;
  aaSequence: string;
  binaryAASequence: number[];
}

export function hammingDistance(x: number[], y: number[]) {
  let result = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) {
      result += 1;
    }
  }

  return result;
}

export class FastaFile {
  public static getBinarySequenceFromAASequence(aaSequence: string) {
    return aaSequence.split('').reduce((binAccumulator, aaCode) => {
      const arr = new Array(21).fill(0);
      arr[FastaFile.aaList.indexOf(aaCode)] = 1;
      binAccumulator.push(...arr);

      return binAccumulator;
    }, new Array<number>());
  }
  public static fromFileText(fileText: string) {
    // parse fasta file line by line
    const sequences = fileText.split(/\r|\n/).reduce((accumulator, line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.length > 0) {
        if (trimmedLine[0] === '>') {
          accumulator.push({
            aaSequence: '',
            binaryAASequence: [],
            title: trimmedLine.substr(1),
          });
        } else if (accumulator.length > 0) {
          const aaSequnceOnLine = trimmedLine.replace(/\./g, '-').toUpperCase();
          accumulator[accumulator.length - 1].aaSequence += aaSequnceOnLine;
          accumulator[accumulator.length - 1].binaryAASequence.push(
            ...FastaFile.getBinarySequenceFromAASequence(aaSequnceOnLine),
          );
        }
      }

      return accumulator;
    }, new Array<SequenceEntry>());

    return new FastaFile(sequences);
  }

  private static aaList = 'ACDEFGHIKLMNPQRSTVWY-';
  private sequences: SequenceEntry[];

  constructor(sequences: SequenceEntry[]) {
    this.sequences = sequences;
  }

  public getSequenceObjects() {
    return this.sequences;
  }

  public getBinarySequencesFlat() {
    return this.sequences.map(seqEntry => {
      return seqEntry.binaryAASequence;
    });
  }

  public getIntegerAASequences() {
    // Returns an array of integers for each sequence. The numbers
    // have no meaning other than to check for equality in a hamming
    // distance function.
    return this.sequences.map(seqEntry => {
      return seqEntry.aaSequence.split('').map(aaCode => {
        return FastaFile.aaList.indexOf(aaCode);
      });
    });
  }

  public getRandomSetOfSequences(n: number) {
    // randomly select "n" sequences from this FastaFile's sequences and
    // return a new FastaFile object with the new random set. If "n" is
    // larger than the number of sequences, return all sequences.
    if (n > this.sequences.length) {
      return new FastaFile([...this.sequences]);
    }
    let sequenceBowl = [...this.sequences];
    const randomSequences = new Array<SequenceEntry>();
    while (randomSequences.length < n) {
      // tslint:disable-next-line: insecure-random
      const randomIdx = Math.floor(Math.random() * sequenceBowl.length); // btw 0 and length of in sequenceBowl
      randomSequences.push(sequenceBowl[randomIdx]);
      sequenceBowl = sequenceBowl.reduce((accumulator, currentValue, currentIdx) => {
        if (currentIdx !== randomIdx) {
          accumulator.push(currentValue);
        }

        return accumulator;
      }, new Array<SequenceEntry>());
    }

    return new FastaFile(randomSequences);
  }
}

// tslint:disable-next-line: max-classes-per-file
export class UMAPVisualization extends React.Component<IUMAPVisualizationProps, IUMAPVisualizationState> {
  public static defaultProps = {
    numIterationsBeforeReRender: 1,
    numSequencesToShow: 5000,
  };

  private xRange: number[] = [-20, 20];
  private yRange: number[] = [-20, 20];
  private classColors = {
    asdf: 'asdf',
    32: 'asdf',
  };

  private phylumColors = {
    Actinobacteria: '#1f77b4',
    Alphaproteobacteria: '#ff7f0e',
    Bacilli: '#2ca02c',
    Betaproteobacteria: '#d62728',
    Clostridia: '#9467bd',
    Gammaproteobacteria: '#17becf',
  };

  // public componentDidUpdate(prevProps: IUMAPVisualizationProps, prevState: IUMAPVisualizationState) { }

  private counter = 0;

  constructor(props: IUMAPVisualizationProps) {
    super(props);
    this.state = {
      allSequencesFastaFile: null,
      selectedSequencesFastaFile: null,
      taxonomy: null,
      twoDimensionalData: new Array<number[]>(),
    };
  }

  public async componentDidMount() {
    const { numIterationsBeforeReRender, numSequencesToShow } = this.props;
    /*const fastaSequences = await fetchFastaFile(
      'datasets/betalactamase_alignment/7fa1c5691376beab198788a726917d48_b0.4.a2m',
    );*/

    let taxonomy: null | { [key: string]: { [key: string]: string } } = null;
    Papa.parse('datasets/betalactamase_alignment/PSE1_NATURAL_TAXONOMY.csv', {
      complete(results) {
        console.log('csv results', results);

        taxonomy = results.data.reduce(
          (accumulator, seqTaxonomy) => {
            accumulator[seqTaxonomy.seq_name] = {
              class: seqTaxonomy.class,
              phylum: seqTaxonomy.phylum,
            };

            return accumulator;
          },
          {} as { [key: string]: { [key: string]: string } },
        );
        // console.log('taxonomy');
        // console.log(taxonomy);
      },
      download: true,
      header: true,
    });

    // const fastaSequences = await fetchFastaFile(
    //  'datasets/AQP4_alignment/AQP4_HUMAN_eval2_region_22to255_raw_focus.fasta',
    // );
    const fastaSequences = await fetchFastaFile('datasets/betalactamase_alignment/PSE1_natural_top5K_subsample.a2m');
    console.log('all fasta sequences:', fastaSequences);

    const randomFastaSequences = fastaSequences.getRandomSetOfSequences(numSequencesToShow);
    console.log('random fasta sequences:', randomFastaSequences);

    const integerAASequences = randomFastaSequences.getIntegerAASequences(); // faster than binary
    const t0 = performance.now();
    /*
    const umap = new UMAP({ nComponents: 2, distanceFn: hammingDistance });
    umap.fitAsync(integerAASequences, epochNum => {
      console.log(epochNum + '::' + (performance.now() - t0) / 1000 + ' sec');
      this.setState({
        twoDimensionalData: umap.getEmbedding(),
      });
    });*/

    // WORKING FOR UMAP sequences dataset
    setTimeout(() => {
      const umap = new UMAP({ nComponents: 2, distanceFn: hammingDistance, minDist: 0.1, spread: 1 });

      const nEpochs = umap.initializeFit(integerAASequences);
      console.log(`UMAP wants to do ${nEpochs} epochs`);

      const stepUmapFn = (counter: number) => {
        if (counter % numIterationsBeforeReRender === 0 && counter <= nEpochs) {
          if (counter % 50 === 0) {
            console.log(counter + '::' + (performance.now() - t0) / 1000 + ' sec');
          }
          const embedding = umap.getEmbedding();
          if (counter === 0) {
            console.log('embedding:', embedding);
          }

          this.setState({
            allSequencesFastaFile: fastaSequences,
            selectedSequencesFastaFile: randomFastaSequences,
            taxonomy,
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

      stepUmapFn(0);
    });

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
    // console.log(`UMAP render with length ${data.length}:`, JSON.stringify(data));

    let plotType: string = 'scattergl';
    const dataX = new Float32Array(this.state.twoDimensionalData.map(datum => datum[0]));
    const dataY = new Float32Array(this.state.twoDimensionalData.map(datum => datum[1]));
    let dataZ: Float32Array | undefined;
    if (
      this.state.twoDimensionalData &&
      this.state.twoDimensionalData.length > 0 &&
      this.state.twoDimensionalData[0].length > 2
    ) {
      dataZ = new Float32Array(this.state.twoDimensionalData.map(datum => datum[3]));
      plotType = 'scatter3d';
    }

    let seqTitles = new Array<string>();
    if (this.state.selectedSequencesFastaFile) {
      seqTitles = this.state.selectedSequencesFastaFile.getSequenceObjects().map(seqObj => {
        return seqObj.title;
      });
    }

    let colors = new Array<string>();
    if (this.state.selectedSequencesFastaFile && this.state.taxonomy) {
      colors = this.state.selectedSequencesFastaFile.getSequenceObjects().map(seqObj => {
        if (this.state.taxonomy) {
          const taxProps = this.state.taxonomy[seqObj.title];
          const color = taxProps && taxProps.phylum ? this.getClassColor(taxProps.class) : null;
          if (color) {
            return color;
          }
        }

        return 'gray';
      });
    }

    // smart range setting
    if (this.xRange[0] > Math.min(...dataX)) {
      this.xRange[0] = Math.min(...dataX) - 5;
    }
    if (this.xRange[1] < Math.max(...dataX)) {
      this.xRange[1] = Math.max(...dataX) + 5;
    }
    if (this.yRange[0] > Math.min(...dataY)) {
      this.yRange[0] = Math.min(...dataY) - 5;
    }
    if (this.yRange[1] < Math.max(...dataY)) {
      this.yRange[1] = Math.max(...dataY) + 5;
    }

    return (
      <div>
        asdf
        <ComponentCard componentName={'UMAPVisualization'}>
          <PlotlyChart
            layout={{
              ...defaultPlotlyLayout,
              dragmode: 'zoom', // 'select',
              margin: {
                b: 20,
              },
              xaxis: { autorange: false, range: this.xRange },
              yaxis: { autorange: false, range: this.yRange },
            }}
            data={[
              {
                marker: {
                  color: colors,
                },
                mode: 'markers',
                text: seqTitles,
                type: 'scattergl', // scatter3d
                x: dataX,
                y: dataY,
                z: dataZ,
              },
            ]}
            showLoader={false}
          />
        </ComponentCard>
      </div>
    );
  }

  private getPhylumColor(phylumToFind: string | undefined): string | undefined {
    const phylumColors: { [key: string]: string } = {
      Actinobacteria: '#ff7f0e',
      Bacteroidetes: '#2ca02c',
      Firmicutes: '#8c564b',
      Proteobacteria: '#e377c2',
    };
    if (phylumToFind) {
      return phylumColors[phylumToFind];
    }

    return undefined;
  }

  private getClassColor(classToFind: string | undefined): string | undefined {
    const classColors: { [key: string]: string } = {
      Actinobacteria: '#ff7f0e',
      Alphaproteobacteria: '#1f77b4',
      Bacilli: '#2ca02c',
      Betaproteobacteria: '#d62728',
      Clostridia: '#9467bd',
      Gammaproteobacteria: '#17becf',
    };
    if (classToFind) {
      return classColors[classToFind];
    }
  }
}
