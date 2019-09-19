import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Card, Modal } from 'semantic-ui-react';

import {
  ComponentDock,
  ComponentMenuBar,
  IButtonType,
  IComponentMenuBarItem,
  IDockItem,
  IPopupType,
} from '~bioblocks-viz~/component/widget';

export interface IComponentCardProps {
  componentName: string;
  dockItems: IDockItem[];
  expandedStyle: React.CSSProperties;
  frameHeight: number;
  frameWidth: number;
  headerHeight: number;
  height: number | string;
  iconSrc: string;
  isDataReady: boolean;
  isFramedComponent: boolean;
  isFullPage: boolean;
  menuItems: Array<IComponentMenuBarItem<IButtonType | IPopupType>>;
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
    expandedStyle: {
      height: '85vh',
      width: '85vh', // Intentionally 'vh' instead of 'vw' to make the card square.
    },
    frameHeight: 0,
    frameWidth: 0,
    headerHeight: 20,
    height: '525px',
    iconSrc: 'assets/icons/bio-blocks-icon.svg',
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

  public async componentDidMount() {
    if (this.props.isFramedComponent) {
      window.onresize = async () => {
        if (this.props.isFramedComponent) {
          await this.resizeFramedComponent();
        }
      };
      await this.resizeFramedComponent();
    }
    document.onfullscreenchange = () => {
      const { isFullPage } = this.state;
      this.setState({
        isFullPage: !isFullPage,
      });
    };
  }

  public componentWillUnmount() {
    document.onfullscreenchange = null;
    const cardElement = ReactDOM.findDOMNode(this.cardRef) as HTMLDivElement;
    if (cardElement) {
      cardElement.removeEventListener('click', this.onBorderClick);
    }
  }

  public async componentDidUpdate(prevProps: IComponentCardProps, prevState: IComponentCardState) {
    const { isFullPage } = this.state;
    if (isFullPage !== prevState.isFullPage) {
      await this.resizeFramedComponent();
    }
  }

  public render() {
    const { expandedStyle, height, width } = this.props;
    const { isFullPage } = this.state;

    const heightAsNumber = typeof height === 'string' ? parseInt(height, 10) : height;
    const cardStyle: React.CSSProperties = {
      maxWidth: 'unset',
      padding: '0 0 0 5px',
      ...(isFullPage
        ? { ...expandedStyle, padding: '5px', border: '5em black solid' }
        : { height: `${heightAsNumber * 1.01}px`, width }),
    };

    return (
      <Card centered={true} className={'bioblocks-component-card'} ref={ref => (this.cardRef = ref)} style={cardStyle}>
        {this.renderCardChildren()}
      </Card>
    );

    // return this.renderCard(card, isFullPage, expandedStyle);
  }

  protected renderCard = (card: JSX.Element, isFullPage: boolean, expandedStyle: React.CSSProperties) => {
    if (isFullPage) {
      return (
        <Modal
          closeOnDimmerClick={true}
          closeOnEscape={true}
          onClose={this.onFullPageToggle}
          open={true}
          size={'large'}
          style={{ ...expandedStyle, willChange: 'unset' }}
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
        <div style={{ height: '7%' }}>{this.renderTopMenu(headerHeight)}</div>
        <div style={{ height: '90%', width: '100%' }}>
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

  protected onBorderClick = async (event: MouseEvent) => {
    const cardElement = ReactDOM.findDOMNode(this.cardRef) as HTMLDivElement;
    if (
      event.offsetX < 0 ||
      event.offsetY < 0 ||
      event.offsetX > cardElement.clientWidth ||
      event.offsetY > cardElement.clientHeight
    ) {
      await document.exitFullscreen();
    }
  };

  protected onFullPageToggle = async () => {
    const { isFullPage } = this.state;
    const cardElement = ReactDOM.findDOMNode(this.cardRef) as HTMLDivElement;

    if (cardElement && !isFullPage) {
      cardElement.onclick = this.onBorderClick;
      await cardElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
      if (cardElement) {
        cardElement.removeEventListener('click', this.onBorderClick);
      }
    }
  };

  protected async resizeFramedComponent() {
    const { frameHeight, frameWidth, headerHeight } = this.props;
    const { framedStyle, isFullPage } = this.state;

    const cardElement = ReactDOM.findDOMNode(this.cardRef) as Element;
    if (cardElement) {
      const iFrameNodeStyle = window.getComputedStyle(cardElement);
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
