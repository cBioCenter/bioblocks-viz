import * as React from 'react';
import { Grid } from 'semantic-ui-react';

export interface IDockItem {
  text: string;
  onClick?(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void;
}

export interface IComponentDockProps {
  dockItems: IDockItem[];
}

export class ComponentDock extends React.Component<IComponentDockProps> {
  constructor(props: IComponentDockProps) {
    super(props);
  }

  public render() {
    const { dockItems } = this.props;

    return (
      <Grid centered={true} columns={'equal'} style={{ marginLeft: 'initial', marginRight: 'initial', padding: 0 }}>
        {dockItems.map((dockItem, index) => (
          <Grid.Column floated={'left'} key={`dock-item-${index}`} style={{ padding: 0 }}>
            <div style={{ userSelect: 'none' }}>
              <a aria-pressed={false} onClick={dockItem.onClick} role={'button'}>
                {dockItem.text}
              </a>
            </div>
          </Grid.Column>
        ))}
      </Grid>
    );
  }
}
