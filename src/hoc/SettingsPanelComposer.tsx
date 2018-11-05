import * as React from 'react';

import { Dimmer, Loader } from 'semantic-ui-react';
import { SettingsPanel } from '~chell-viz~/component';
import { ChellWidgetConfig } from '~chell-viz~/data';

interface IWrappedSettingsProps {
  configurations: ChellWidgetConfig[];
  isDataLoading: boolean;
  showConfigurations: boolean;
  width: number | string;
}
// @ts-ignore
const withSettingsPanel = <P extends object, S extends object>(
  WrappedComponent: React.ComponentType<P>,
  deriveConfigurations?: (component: any) => ChellWidgetConfig[],
) =>
  class extends React.Component<IWrappedSettingsProps> {
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
  };

// tslint:disable-next-line:export-name
export { withSettingsPanel };
