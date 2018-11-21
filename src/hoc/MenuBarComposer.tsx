import * as React from 'react';

import { Card, Menu } from 'semantic-ui-react';

// Options for the HOC factory that are not dependent on props values
interface IMenuBarProps {
  showMenu?: boolean;
}

const withMenuBar = ({ showMenu = true }: IMenuBarProps = {}) => <OriginalProps extends {}>(
  WrappedComponent: React.ComponentType<OriginalProps & {}>,
): React.ComponentClass<OriginalProps> => {
  return class HOC extends React.Component<OriginalProps & {}> {
    public render() {
      return (
        <div>
          {showMenu && <Menu>{WrappedComponent.displayName}</Menu>}
          <Card>
            <WrappedComponent {...this.props} />
          </Card>
        </div>
      );
    }
  };
};

// tslint:disable-next-line:export-name
export { withMenuBar };
