import { fromJS, List } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid, Message } from 'semantic-ui-react';

import { createSpringActions, fetchSpringGraphData } from '~chell-viz~/action';
import { AnatomogramContainer, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { ISpringGraphData, SPECIES_TYPE, VizData } from '~chell-viz~/data';
import { fetchSpringData } from '~chell-viz~/helper';

export interface IDatasetPageProps extends Partial<RouteComponentProps> {
  dispatchSpringFetch(fetchFn: () => Promise<ISpringGraphData>, namespace?: string): void;
  setSpecies(species: SPECIES_TYPE): void;
}

export interface IDatasetPageState {
  visualizations: List<string>;
  datasetLocation: string;
}

export class DatasetPageClass extends React.Component<IDatasetPageProps, IDatasetPageState> {
  public static defaultProps = {
    dispatchSpringFetch: () => {
      return;
    },
    setSpecies: () => {
      return;
    },
  };
  constructor(props: IDatasetPageProps) {
    super(props);
    this.state = {
      datasetLocation: '',
      visualizations: List<string>(),
    };
  }

  public componentDidMount() {
    const { location, setSpecies } = this.props;
    const { datasetLocation } = this.state;
    if (location) {
      this.setupSearchParameters(location.search);
    }
    setSpecies(datasetLocation.includes('hpc') ? 'homo_sapiens' : 'mus_musculus');
  }

  public componentDidUpdate(prevProps: IDatasetPageProps, prevState: IDatasetPageState) {
    const { location, setSpecies } = this.props;
    const { datasetLocation } = this.state;
    if (location && location !== prevProps.location) {
      this.setupSearchParameters(location.search);
    }
    setSpecies(datasetLocation.includes('hpc') ? 'homo_sapiens' : 'mus_musculus');
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
    const { dispatchSpringFetch } = this.props;
    const params = new URLSearchParams(query);
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const datasetLocation = params.get('name');
    const visualizations = fromJS(params.getAll('viz')) as List<string>;

    dispatchSpringFetch(async () => fetchSpringData(`assets/datasets/${datasetLocation ? datasetLocation : ''}`));

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

export const UnconnectedDatasetPage = (props: IDatasetPageProps) => <DatasetPageClass {...props} />;

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchSpringFetch: fetchSpringGraphData,
      setSpecies: createSpringActions().species.set,
    },
    dispatch,
  );

// tslint:disable-next-line:max-classes-per-file
export class DatasetPage extends connect(
  undefined,
  mapDispatchToProps,
)(UnconnectedDatasetPage) {}
