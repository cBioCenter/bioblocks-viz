import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card, Grid, Icon, Menu } from 'semantic-ui-react';

// tslint:disable:import-name match-default-export-name
import ReactSVG from 'react-svg';
// tslint:enable:import-name match-default-export-name

export interface IComponentCardProps {
  componentName: string;
  frameHeight: number;
  frameWidth: number;
  headerHeight: number;
  isFramedComponent: boolean;
  padding: number | string;
}

export interface IComponentCardState {
  framedStyle: React.CSSProperties;
  isFullPage: boolean;
}

export class SpringContainerClass extends React.Component<IComponentCardProps, IComponentCardState> {
  public static defaultProps = {
    frameHeight: 0,
    frameWidth: 0,
    headerHeight: 32,
    isFramedComponent: false,
    padding: 0,
  };

  protected cardRef: React.Component<any> | null = null;

  constructor(props: IComponentCardProps) {
    super(props);
    this.state = {
      framedStyle: {
        transformOrigin: 'top left',
      },
      isFullPage: false,
    };
  }

  public componentDidMount() {
    window.onresize = () => {
      if (this.props.isFramedComponent) {
        this.resizeFramedComponent();
      }
    };
  }

  public render() {
    const { headerHeight } = this.props;
    const { isFullPage } = this.state;

    return (
      <Grid.Column width={isFullPage ? 16 : 8}>
        <Card
          className={'chell-component-card'}
          ref={ref => (this.cardRef = ref)}
          style={{
            maxWidth: 'unset',
            padding: '5px',
            width: '100%',
          }}
        >
          {this.renderTopMenu(headerHeight)}
          {this.props.children}
        </Card>
      </Grid.Column>
    );
  }

  protected renderTopMenu = (height: number | string) => (
    <Menu secondary={true} style={{ margin: 0, height }}>
      <Menu.Item position={'left'} fitted={'horizontally'} style={{ margin: 0 }}>
        <ReactSVG src={'assets/spring-icon.svg'} svgStyle={{ height: '32px', width: '32px' }} />
        {this.props.componentName}
      </Menu.Item>
      <Menu.Item position={'right'} fitted={'horizontally'} style={{ margin: 0 }}>
        <Icon name={'expand arrows alternate'} onClick={this.onFullPageToggle} />
        <Icon name={'settings'} />
      </Menu.Item>
    </Menu>
  );

  protected onFullPageToggle = () => {
    this.setState({
      isFullPage: !this.state.isFullPage,
    });
  };

  protected resizeFramedComponent = () => {
    const { frameHeight, frameWidth, headerHeight } = this.props;
    const { framedStyle } = this.state;

    if (this.cardRef) {
      const iFrameNodeRef = ReactDOM.findDOMNode(this.cardRef) as Element;
      const iFrameNodeStyle = iFrameNodeRef ? window.getComputedStyle(iFrameNodeRef) : null;

      if (iFrameNodeStyle && iFrameNodeStyle.width && iFrameNodeStyle.height) {
        const refHeight = parseInt(iFrameNodeStyle.height, 10) - 18;
        const refWidth = parseInt(iFrameNodeStyle.width, 10) - 10;

        this.setState({
          framedStyle: {
            ...framedStyle,
            transform: `scale(calc(${refWidth}/${frameWidth}),calc((${refHeight} - ${headerHeight})/${frameHeight}))`,
          },
        });
      }
    }
  };
}
