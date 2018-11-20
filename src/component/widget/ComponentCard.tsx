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

    console.log(isFullPage);
    console.log(framedStyle);

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
    console.log(this.state.isFullPage);
    this.setState({
      isFullPage: !this.state.isFullPage,
    });
  };

  protected resizeFramedComponent = () => {
    const { frameHeight, frameWidth, headerHeight } = this.props;
    const { framedStyle } = this.state;

    console.log('resizing');
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
