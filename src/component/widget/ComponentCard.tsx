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
  isFullPage: boolean;
  padding: number | string;
}

export interface IComponentCardState {
  framedStyle: React.CSSProperties;
  isFullPage: boolean;
}

export class ComponentCard extends React.Component<IComponentCardProps, IComponentCardState> {
  public static defaultProps = {
    frameHeight: 0,
    frameWidth: 0,
    headerHeight: 32,
    isFramedComponent: false,
    isFullPage: false,
    padding: 0,
  };

  protected cardRef: React.Component<any> | null = null;

  constructor(props: IComponentCardProps) {
    super(props);
    this.state = {
      framedStyle: {
        transformOrigin: 'top left',
      },
      isFullPage: props.isFullPage,
    };
  }

  public componentDidMount() {
    if (this.props.isFramedComponent) {
      window.onresize = () => {
        if (this.props.isFramedComponent) {
          this.resizeFramedComponent();
        }
      };
      this.resizeFramedComponent();
    }
  }

  public componentDidUpdate(prevProps: IComponentCardProps, prevState: IComponentCardState) {
    const { isFullPage } = this.state;
    if (isFullPage !== prevState.isFullPage) {
      this.resizeFramedComponent();
    }
  }

  public render() {
    const { headerHeight, isFramedComponent } = this.props;
    const { isFullPage, framedStyle } = this.state;

    const expandedStyle: React.CSSProperties = {
      bottom: 0,
      height: '100vh',
      left: 0,
      padding: '5px',
      position: 'fixed',
      right: 0,
      top: 0,
      width: '100vw',
      zIndex: 1000000,
    };

    const cardStyle: React.CSSProperties = {
      maxWidth: 'unset',
      padding: '0 0 5px 5px',
      ...(isFullPage ? { ...expandedStyle } : { height: '600px', width: '600px' }),
    };

    return (
      <Grid.Column>
        <Card className={'chell-component-card'} ref={ref => (this.cardRef = ref)} style={cardStyle}>
          {this.renderTopMenu(headerHeight)}
          {isFramedComponent ? <div style={framedStyle}>{this.props.children}</div> : this.props.children}
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

  protected resizeFramedComponent() {
    const { frameHeight, frameWidth, headerHeight } = this.props;
    const { framedStyle, isFullPage } = this.state;

    if (this.cardRef) {
      const iFrameNodeRef = ReactDOM.findDOMNode(this.cardRef) as Element;
      const iFrameNodeStyle = iFrameNodeRef ? window.getComputedStyle(iFrameNodeRef) : null;

      if (iFrameNodeStyle && iFrameNodeStyle.width && iFrameNodeStyle.height) {
        document.body.style.overflowY = isFullPage ? 'hidden' : 'auto';
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
  }
}
