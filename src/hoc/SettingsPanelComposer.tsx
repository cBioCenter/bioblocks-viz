import * as React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';
import { SettingsPanel } from '~chell-viz~/component';
import { ChellWidgetConfig } from '~chell-viz~/data';

const withSettingsPanel = <P extends object, S extends object>(
  WrappedComponent: React.ComponentType<P>,
  deriveConfigurations?: (component: any) => ChellWidgetConfig[],
) => {
  class WithSettingsPanelHOC extends React.Component<any> {
    public static WrappedComponent = WrappedComponent;

    public render() {
      const { configurations, isDataLoading, showConfigurations, ...remainingProps } = this.props;

      return (
        <Dimmer.Dimmable dimmed={true}>
          <Dimmer active={isDataLoading}>
            <Loader />
          </Dimmer>
          <SettingsPanel
            configurations={deriveConfigurations !== undefined ? deriveConfigurations(this) : configurations}
            showConfigurations={showConfigurations}
            width={remainingProps.width}
          >
            <WrappedComponent {...remainingProps} />
          </SettingsPanel>
        </Dimmer.Dimmable>
      );
    }
  }

  return WithSettingsPanelHOC;
};

// tslint:disable-next-line:export-name
export { withSettingsPanel };
