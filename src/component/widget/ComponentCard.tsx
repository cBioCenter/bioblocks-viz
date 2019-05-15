import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card, Modal } from 'semantic-ui-react';

import { ComponentMenuBar } from '~bioblocks-viz~/component/widget';

export interface IComponentCardProps {
  componentName: string;
  frameHeight: number;
  frameWidth: number;
  headerHeight: number;
  height: number | string;
  iconSrc: string;
  isFramedComponent: boolean;
  isFullPage: boolean;
  padding: number | string;
  showSettings: boolean;
  width: number | string;
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
    height: '525px',
    iconSrc: 'assets/icons/spring-icon.png',
    isFramedComponent: false,
    isFullPage: false,
    padding: 0,
    showSettings: false,
    width: '525px',
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
    const { children, headerHeight, height, isFramedComponent, width } = this.props;
    const { isFullPage, framedStyle } = this.state;

    const expandedStyle: React.CSSProperties = {
      height: '80vh',
      padding: '5px',
      width: '80vh',
    };

    const cardStyle: React.CSSProperties = {
      maxWidth: 'unset',
      padding: '0 0 5px 5px',
      ...(isFullPage ? { ...expandedStyle } : { height, width }),
    };

    const card = (
      <Card centered={true} className={'bioblocks-component-card'} ref={ref => (this.cardRef = ref)} style={cardStyle}>
        {this.renderTopMenu(headerHeight)}
        {isFramedComponent ? <div style={framedStyle}>{children}</div> : children}
      </Card>
    );

    if (isFullPage) {
      return (
        <Modal
          closeOnDimmerClick={true}
          closeOnEscape={true}
          onClose={this.onFullPageToggle}
          open={true}
          size={'large'}
          style={{ height: '80vh', width: '80vh', willChange: 'unset' }}
        >
          {card}
        </Modal>
      );
    } else {
      return card;
    }
  }

  protected renderTopMenu = (height: number | string) => (
    <ComponentMenuBar
      componentName={this.props.componentName}
      iconSrc={this.props.iconSrc}
      isExpanded={this.state.isFullPage}
      onExpandToggleCb={this.onFullPageToggle}
    />
  );

  protected onFullPageToggle = () => {
    this.setState({
      isFullPage: !this.state.isFullPage,
    });
    this.forceUpdate();
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
