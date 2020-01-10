import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { ICategoricalAnnotation } from '~bioblocks-viz~/component';
import { SpringContainer, UMAPTranscriptionalContainer } from '~bioblocks-viz~/container';
import { SeqIO, SeqRecord, SEQUENCE_FILE_TYPES } from '~bioblocks-viz~/data';
import { fetchJSONFile, fetchMatrixData } from '~bioblocks-viz~/helper';
import { BBStore } from '~bioblocks-viz~/reducer';

export interface IExampleAppProps {
  fastaFilename: string;
  style: Exclude<React.CSSProperties, 'height' | 'width'>;
  taxonomyFilename?: string;
}

export interface IExampleAppState {
  isDragHappening: boolean;
  datasetLocation: string;
  errorMsg: string;
  isLoading: boolean;
  taxonomyText?: string;
  allSequences: SeqRecord[];
  scRNAseqMatrix: number[][];
  scRNAseqCategoricalData: ICategoricalAnnotation;
  scRNAseqCategorySelected: string;
}

// TODO: Move to helper.
export const fetchFastaFile = async (filename: string) => {
  const response = await fetch(filename);
  if (response.ok) {
    return SeqIO.parseFile(await response.text(), SEQUENCE_FILE_TYPES.fasta);
  } else {
    throw new Error(`error ${response}`);
  }
};

class ExampleAppClass extends React.Component<IExampleAppProps, IExampleAppState> {
  public static initialState: IExampleAppState = {
    allSequences: new Array<SeqRecord>(),
    datasetLocation: 'hpc/full', // tabula_muris/full
    errorMsg: '',
    isDragHappening: false,
    isLoading: false,
    scRNAseqCategoricalData: {},
    scRNAseqCategorySelected: 'Sample', // 'Louvain cluster',
    scRNAseqMatrix: new Array<number[]>(),
    taxonomyText: '',
  };

  public static defaultProps = {
    fastaFilename: 'datasets/betalactamase_alignment/PSE1_natural_top5K_subsample.a2m',
    style: {
      backgroundColor: '#ffffff',
    },
  };

  public constructor(props: IExampleAppProps) {
    super(props);
    this.state = ExampleAppClass.initialState;
  }

  public async componentDidMount() {
    await this.setupUMAPData();
  }

  public async componentDidUpdate(prevProps: IExampleAppProps, prevState: IExampleAppState) {
    const { datasetLocation } = this.state;

    if (prevState.datasetLocation !== datasetLocation) {
      await this.setupUMAPData();
    }
  }

  public render({ style } = this.props) {
    return (
      <div id={'BioblocksVizApp'} style={{ ...style, height: '1000px' }}>
        <meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
        <Segment attached={true} raised={true}>
          <Header as={'h1'} attached={'top'}>
            Bioblocks-Viz: Visualization Component Library
          </Header>
          {this.renderStartMessage()}
        </Segment>
        {this.renderSPRINGAndUMAP()}
      </div>
    );
  }

  protected async setupUMAPData() {
    const { datasetLocation } = this.state;
    let taxonomyText;
    if (this.props.taxonomyFilename) {
      taxonomyText = await (await fetch(this.props.taxonomyFilename)).text();
    }

    this.setState({
      allSequences: await fetchFastaFile(this.props.fastaFilename),
      scRNAseqCategoricalData: (await fetchJSONFile(
        `datasets/${datasetLocation}/categorical_coloring_data.json`,
      )) as ICategoricalAnnotation,
      scRNAseqMatrix: await fetchMatrixData(`datasets/${datasetLocation}/tsne_matrix.csv`),
      taxonomyText,
    });
  }

  protected onSwitchDataset = () => {
    this.setState({
      allSequences: [],
      datasetLocation: this.state.datasetLocation === 'hpc/full' ? 'tabula_muris/10k' : 'hpc/full',
      scRNAseqCategoricalData: {},
      scRNAseqCategorySelected: this.state.datasetLocation === 'hpc/full' ? 'cell_ontology_class' : 'Sample', // 'Louvain cluster',
      scRNAseqMatrix: new Array(new Array<number>()),
    });
  };

  protected renderStartMessage = () => (
    <Segment>
      <Message>{`Demonstration of UMAP and SPRING visualizations of the '${this.state.datasetLocation}' dataset. `}</Message>
      <Button onClick={this.onSwitchDataset}>
        {`Switch to '${this.state.datasetLocation === 'hpc/full' ? 'tabula_muris/10k' : 'hpc/full'}' dataset`}
      </Button>
    </Segment>
  );

  protected renderSPRINGAndUMAP = () => {
    const { datasetLocation, scRNAseqCategoricalData, scRNAseqCategorySelected, scRNAseqMatrix } = this.state;

    return (
      <Grid centered={true} columns={2} padded={true} relaxed={true}>
        <Grid.Row>
          <Grid.Column>
            <UMAPTranscriptionalContainer
              categoricalAnnotations={scRNAseqCategoricalData}
              dataMatrix={scRNAseqMatrix}
              labelCategory={scRNAseqCategorySelected}
              numSamplesToShow={scRNAseqMatrix.length}
              nComponents={2}
            />
          </Grid.Column>
          <Grid.Column>
            <SpringContainer datasetLocation={`datasets/${datasetLocation}`} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({}, dispatch);

const ExampleApp = connect(null, mapDispatchToProps)(ExampleAppClass);

ReactDOM.render(
  <Provider store={BBStore}>
    <ExampleApp />
  </Provider>,
  document.getElementById('example-root'),
);

if (module.hot) {
  module.hot.accept();
}
