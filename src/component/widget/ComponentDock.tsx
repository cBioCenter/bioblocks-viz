// ~bb-viz~
// Component Dock
// Visualization for UI elements to appear in the dock of a ComponentCard.
// ~bb-viz~

import * as React from 'react';
import { Grid } from 'semantic-ui-react';

export interface IDockItem {
  text: string;
  isLink?: boolean;

  /**
   * If present, calls function to determine if it is rendered.
   * If omitted, DockItem will be rendered.
   */
  isVisibleCb?(): boolean;
  onClick?(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}

export interface IComponentDockProps {
  dockItems: IDockItem[];

  /**
   * Whether the entire dock is rendered. Useful in scenarios where a component is empty like when waiting for user data.
   */
  visible: boolean;
}

export class ComponentDock extends React.Component<IComponentDockProps> {
  public static defaultProps = {
    visible: true,
  };

  constructor(props: IComponentDockProps) {
    super(props);
  }

  public render() {
    const { dockItems, visible } = this.props;

    return (
      visible && (
        <Grid
          centered={true}
          columns={'equal'}
          style={{ marginLeft: 'initial', marginRight: 'initial', marginTop: '-0.5rem', padding: 0 }}
          stretched={true}
        >
          {dockItems.map((dockItem, index) => this.renderSingleDockItem(dockItem, index))}
        </Grid>
      )
    );
  }

  protected renderSingleDockItem = (dockItem: IDockItem, index: number) => {
    if (dockItem.isVisibleCb && dockItem.isVisibleCb() === false) {
      return null;
    }
    const isLink = dockItem.isLink === undefined ? true : dockItem.isLink;

    return (
      <Grid.Column key={`dock-item-${index}`} style={{ padding: 0, paddingTop: '3px' }}>
        {isLink ? (
          <div style={{ userSelect: 'none' }}>
            <a aria-pressed={false} onClick={dockItem.onClick} role={'button'}>
              {dockItem.text}
            </a>
          </div>
        ) : (
          <div>{dockItem.text}</div>
        )}
      </Grid.Column>
    );
  };
}
