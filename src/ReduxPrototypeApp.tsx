import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Grid } from 'semantic-ui-react';

import { fetchLabeledSpringData } from '~chell-viz~/action';
import { AnatomogramContainer, TensorTContainer } from '~chell-viz~/container';
import { RootState } from '~chell-viz~/reducer';

interface IReduxPrototypeAppProps {
  fetchSpringData(datasetLocation: string): void;
}

class UnconnectedReduxPrototypeApp extends React.Component<IReduxPrototypeAppProps, any> {
  public componentDidMount() {
    const { fetchSpringData } = this.props;
    fetchSpringData('hpc/full');
  }

  public render() {
    return (
      <div id={'ReduxPrototypeApp'}>
        <Grid>
          <Grid.Column style={{ width: 'auto' }}>
            <AnatomogramContainer species={'homo_sapiens'} />
          </Grid.Column>

          <Grid.Column style={{ width: 'auto' }}>
            <TensorTContainer />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchSpringData: fetchLabeledSpringData,
    },
    dispatch,
  );

// tslint:disable-next-line:max-classes-per-file
export class ReduxPrototypeApp extends connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedReduxPrototypeApp) {}
