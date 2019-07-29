import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card, Modal } from 'semantic-ui-react';

import { ComponentDock, ComponentMenuBar, IComponentMenuBarItem, IDockItem } from '~bioblocks-viz~/component/widget';

export interface IComponentCardProps {
  componentName: string;
  dockItems: IDockItem[];
  frameHeight: number;
  frameWidth: number;
  headerHeight: number;
  height: number | string;
  iconSrc: string;
  isDataReady: boolean;
  isFramedComponent: boolean;
  isFullPage: boolean;
  menuItems: IComponentMenuBarItem[];
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
    dockItems: [],
    frameHeight: 0,
    frameWidth: 0,
    headerHeight: 20,
    height: '525px',
    iconSrc: 'https://bioblocks.org/media/5d3f528028d9720a3428e4b2',
    isDataReady: false,
    isFramedComponent: false,
    isFullPage: false,
    menuItems: [],
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
    const { height, width } = this.props;
    const { isFullPage } = this.state;

    const expandedStyle: React.CSSProperties = {
      height: '80vh',
      padding: '5px',
      width: '80vh',
    };

    const heightAsNumber = typeof height === 'string' ? parseInt(height, 10) : height;
    const cardStyle: React.CSSProperties = {
      maxWidth: 'unset',
      padding: '0 0 5px 5px',
      ...(isFullPage ? { ...expandedStyle } : { height: `${heightAsNumber * 1.01}px`, width }),
    };

    const card = (
      <Card centered={true} className={'bioblocks-component-card'} ref={ref => (this.cardRef = ref)} style={cardStyle}>
        {this.renderCardChildren()}
      </Card>
    );

    return this.renderCard(card, isFullPage);
  }

  protected renderCard = (card: JSX.Element, isFullPage: boolean) => {
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
  };

  protected renderCardChildren = () => {
    const { children, headerHeight, isFramedComponent } = this.props;
    const { framedStyle } = this.state;

    return (
      <>
        <div style={{ height: '6%' }}>{this.renderTopMenu(headerHeight)}</div>
        <div style={{ height: '91%', width: '100%' }}>
          {isFramedComponent ? <div style={framedStyle}>{children}</div> : children}
        </div>
        <div style={{ height: '3%' }}>{this.renderDock()}</div>
      </>
    );
  };
  protected renderDock = () => {
    const { dockItems, isDataReady } = this.props;

    return dockItems.length >= 1 && <ComponentDock dockItems={dockItems} visible={isDataReady} />;
  };

  protected renderTopMenu = (height: number | string) => {
    const { componentName, iconSrc, menuItems } = this.props;
    const { isFullPage } = this.state;

    return (
      <ComponentMenuBar
        componentName={componentName}
        height={height}
        iconSrc={iconSrc}
        isExpanded={isFullPage}
        menuItems={menuItems}
        onExpandToggleCb={this.onFullPageToggle}
      />
    );
  };

  protected onFullPageToggle = () => {
    this.setState({
      isFullPage: !this.state.isFullPage,
    });
    this.forceUpdate();
  };

  protected resizeFramedComponent() {
    const { frameHeight, frameWidth, headerHeight } = this.props;
    const { framedStyle, isFullPage } = this.state;

    const iFrameNodeRef = ReactDOM.findDOMNode(this.cardRef) as Element;
    if (iFrameNodeRef) {
      const iFrameNodeStyle = window.getComputedStyle(iFrameNodeRef);
      if (iFrameNodeStyle && iFrameNodeStyle.width !== null && iFrameNodeStyle.height !== null) {
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
