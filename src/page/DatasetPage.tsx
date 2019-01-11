import { fromJS, List } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Message } from 'semantic-ui-react';

import { fetchLabeledSpringData, LabeledCellsActions } from '~chell-viz~/action';
import { AnatomogramContainer, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { SPECIES_TYPE, VizData } from '~chell-viz~/data';

export interface IDatasetPageProps extends Partial<RouteComponentProps> {
  fetchSpringData(datasetLocation: string): void;
  setSpecies(species: SPECIES_TYPE): void;
}

export interface IDatasetPageState {
  visualizations: List<string>;
  datasetLocation: string;
}

class DatasetPageClass extends React.Component<IDatasetPageProps, IDatasetPageState> {
  constructor(props: IDatasetPageProps) {
    super(props);
    this.state = {
      datasetLocation: '',
      visualizations: List<string>(),
    };
  }

  public componentDidMount() {
    if (this.props.location) {
      this.setupSearchParameters(this.props.location.search);
    }
  }

  public componentDidUpdate(prevProps: IDatasetPageProps, prevState: IDatasetPageState) {
    const { location, setSpecies } = this.props;
    const { datasetLocation } = this.state;
    if (location && location !== prevProps.location) {
      this.setupSearchParameters(location.search);
    } else if (datasetLocation !== prevState.datasetLocation) {
      setSpecies(datasetLocation.includes('hpc') ? 'homo_sapiens' : 'mus_musculus');
    }
  }

  public render() {
    const { visualizations, datasetLocation } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
          {datasetLocation.length >= 1 &&
            visualizations.map((visualization, index) => (
              <Grid.Column key={`dataset-visualization-${index}`} style={{ width: 'auto' }}>
                {this.renderVisualization(visualization, datasetLocation)}
              </Grid.Column>
            ))}
        </Grid>
      </div>
    );
  }

  protected setupSearchParameters(query: string) {
    const { fetchSpringData } = this.props;
    const params = new URLSearchParams(query);
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const datasetLocation = params.get('name');
    const visualizations = fromJS(params.getAll('viz')) as List<string>;

    fetchSpringData(datasetLocation ? datasetLocation : '');
    this.setState({
      datasetLocation: datasetLocation ? datasetLocation : '',
      visualizations,
    });
  }

  protected renderVisualization(viz: string | undefined, datasetLocation: string) {
    const isFullPage = this.state.visualizations.size === 1;
    switch (viz) {
      case VizData.spring.name.toLocaleLowerCase():
        return <SpringContainer datasetLocation={datasetLocation} isFullPage={isFullPage} />;
      case VizData.tfjsTsne.name.toLocaleLowerCase():
        return <TensorTContainer datasetLocation={datasetLocation} isFullPage={isFullPage} />;
      case VizData.anatomogram.name.toLocaleLowerCase():
        return <AnatomogramContainer />;
      default:
        return <Message error={true}>{`Currently unsupported visualization '${viz}'`}</Message>;
    }
  }
}

const UnconnectedDatasetPage = (props: IDatasetPageProps) => <DatasetPageClass {...props} />;

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchSpringData: fetchLabeledSpringData,
      setSpecies: LabeledCellsActions.setSpecies,
    },
    dispatch,
  );

// tslint:disable-next-line:max-classes-per-file
export class DatasetPage extends connect(
  undefined,
  mapDispatchToProps,
)(UnconnectedDatasetPage) {}
