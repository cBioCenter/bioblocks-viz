import * as Papa from 'papaparse';
import * as React from 'react';
import { UMAP } from 'umap-js';

import { ComponentCard, defaultPlotlyLayout, PlotlyChart } from '~bioblocks-viz~/component';

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

export function hammingDistance(x: number[], y: number[]) {
  let result = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) {
      result += 1;
    }
  }

  return result;
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
      },
      download: true,
      header: true,
    });

    const fastaSequences = await fetchFastaFile('datasets/betalactamase_alignment/PSE1_natural_top5K_subsample.a2m');
    console.log('all fasta sequences:', fastaSequences);

    const randomFastaSequences = fastaSequences.getRandomSetOfSequences(numSequencesToShow);
    console.log('random fasta sequences:', randomFastaSequences);

    const integerAASequences = randomFastaSequences.getIntegerAASequences(); // faster than binary
    const t0 = performance.now();

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
