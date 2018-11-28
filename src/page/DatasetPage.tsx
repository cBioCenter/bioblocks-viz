import { fromJS, List } from 'immutable';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Grid, Message } from 'semantic-ui-react';

import { AnatomogramContainer, SpringContainer, TensorTContainer } from '~chell-viz~/container';
import { VizData } from '~chell-viz~/data';

export interface IDatasetPageProps extends Partial<RouteComponentProps> {}

export interface IDatasetPageState {
  apps: List<string>;
  datasetLocation: string;
}

export class DatasetPage extends React.Component<IDatasetPageProps, IDatasetPageState> {
  constructor(props: IDatasetPageProps) {
    super(props);
    this.state = {
      apps: List<string>(),
      datasetLocation: '',
    };
  }

  public componentDidMount() {
    console.log(this.props);
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
    const { apps, datasetLocation } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <Grid centered={true} stackable={true} stretched={false} padded={true} columns={2}>
          {datasetLocation.length >= 1 &&
            apps.map((app, index) => (
              <Grid.Column key={`dataset-app-${index}`} style={{ width: 'auto' }}>
                {this.renderApp(app, datasetLocation)}
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
    const apps = fromJS(params.getAll('app')) as List<string>;

    this.setState({
      apps,
      datasetLocation: datasetLocation ? datasetLocation : '',
    });
  }

  protected renderApp(app: string | undefined, datasetLocation: string) {
    switch (app) {
      case VizData.spring.name.toLocaleLowerCase():
        return <SpringContainer datasetLocation={datasetLocation} />;
      case VizData.tfjsTsne.name.toLocaleLowerCase():
        return <TensorTContainer datasetLocation={datasetLocation} />;
      case VizData.anatomogram.name.toLocaleLowerCase():
        return <AnatomogramContainer />;
      default:
        return <Message error={true}>{`Currently unsupported app '${app}'`}</Message>;
    }
  }
}
