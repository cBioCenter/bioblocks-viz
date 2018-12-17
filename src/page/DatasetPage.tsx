import { fromJS, List } from 'immutable';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Grid, Message } from 'semantic-ui-react';

import { AnatomogramContainer, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { VizData } from '~chell-viz~/data';

export interface IDatasetPageProps extends Partial<RouteComponentProps> {}

export interface IDatasetPageState {
  visualizations: List<string>;
  datasetLocation: string;
}

export class DatasetPage extends React.Component<IDatasetPageProps, IDatasetPageState> {
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

  public componentDidUpdate(prevProps: IDatasetPageProps) {
    if (this.props.location && this.props.location !== prevProps.location) {
      this.setupSearchParameters(this.props.location.search);
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
    const params = new URLSearchParams(query);
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const datasetLocation = params.get('name');
    const visualizations = fromJS(params.getAll('viz')) as List<string>;

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
        return <AnatomogramContainer species={datasetLocation.includes('hpc') ? 'homo_sapiens' : 'mus_musculus'} />;
      default:
        return <Message error={true}>{`Currently unsupported visualization '${viz}'`}</Message>;
    }
  }
}
