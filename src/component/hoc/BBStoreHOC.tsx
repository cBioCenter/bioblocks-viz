import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps, Provider } from 'react-redux';
import { BBStore } from '~bioblocks-viz~/reducer';

export const connectWithBBStore = <TStateProps, TDispatchProps, TOwnProps, State>(
  mapStateToProps: MapStateToProps<TStateProps, TOwnProps, State>,
  mapDispatchToProps: MapDispatchToProps<TDispatchProps, TOwnProps>,
  WrappedComponent: React.ComponentType<any>,
) => {
  const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);

  return withBBStore(connectedComponent);
};

export const withBBStore = <P extends object>(WrappedComponent: React.ComponentType<P>) => (props: P) => {
  WrappedComponent.displayName = `withBBStore(${WrappedComponent.displayName})`;

  return (
    <Provider store={BBStore}>
      <WrappedComponent {...props} />
    </Provider>
  );
};
