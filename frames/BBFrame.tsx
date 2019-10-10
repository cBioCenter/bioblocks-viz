import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {
  AnatomogramContainer,
  ContactMapContainer,
  NGLContainer,
  SpringContainer,
  UMAPSequenceContainer,
} from '~bioblocks-viz~/container';
import {
  BIOBLOCKS_CSS_STYLE,
  IFrameEvent,
  IUMapEventData,
  Seq,
  SeqRecord,
  VIZ_EVENT_DATA_TYPE,
  VIZ_PROPS_DATA_TYPE,
  VIZ_TYPE,
} from '~bioblocks-viz~/data';
import { BBStore } from '~bioblocks-viz~/reducer';

export interface IBBFrameProps {
  style: BIOBLOCKS_CSS_STYLE;
  viz: VIZ_TYPE | undefined;
}

export interface IBBFrameState {
  currentViz: VIZ_TYPE | undefined;
  vizData: VIZ_EVENT_DATA_TYPE;
  vizProps: VIZ_PROPS_DATA_TYPE;
}

export class BBFrame extends React.Component<IBBFrameProps, IBBFrameState> {
  public static defaultProps = {
    style: {},
    viz: undefined,
  };

  constructor(props: IBBFrameProps) {
    super(props);
    this.state = {
      currentViz: props.viz,
      vizData: {},
      vizProps: {},
    };
  }
  public componentDidMount() {
    window.addEventListener('message', this.onMessage);
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  public render() {
    const { style } = this.props;
    const { currentViz, vizData, vizProps } = this.state;

    const combinedStyle: BIOBLOCKS_CSS_STYLE = {
      ...style,
    };

    return currentViz !== undefined ? (
      <div style={combinedStyle}>{this.renderViz(currentViz, vizData, vizProps)}</div>
    ) : null;
  }

  protected onMessage = (msg: IFrameEvent<VIZ_TYPE>) => {
    const { currentViz } = this.state;

    this.setState({
      currentViz: msg.data.viz !== undefined ? msg.data.viz : currentViz,
      vizData: msg.data,
      vizProps: msg.data.props,
    });
  };

  protected renderViz = (viz: VIZ_TYPE | undefined, vizData: VIZ_EVENT_DATA_TYPE, vizProps: VIZ_PROPS_DATA_TYPE) => {
    switch (viz) {
      case VIZ_TYPE.ANATOMOGRAM:
        return <AnatomogramContainer {...vizProps} />;
      case VIZ_TYPE.CONTACT_MAP:
        return <ContactMapContainer {...vizProps} />;
      case VIZ_TYPE.NGL:
        return <NGLContainer {...vizProps} />;
      case VIZ_TYPE.SPRING:
        return <SpringContainer {...vizProps} />;
      case VIZ_TYPE.UMAP_SEQUENCE:
        return this.renderUmapSeq(vizData as IUMapEventData, vizProps);
      default:
        return <div>{`Unsupported viz ${viz}!`}</div>;
    }
  };

  protected renderUmapSeq(vizData: IUMapEventData, vizProps: VIZ_PROPS_DATA_TYPE) {
    return (
      <UMAPSequenceContainer
        allSequences={vizData.seqs.map((seq, index) => {
          return new SeqRecord(new Seq(seq), {
            metadata: {
              class: vizData.annotations ? vizData.annotations[index] : '',
            },
            name: vizData.names[index],
          });
        })}
        {...vizProps}
      />
    );
  }
}

const bioblocksFrame = document.getElementById('bioblocks-frame');

if (bioblocksFrame) {
  ReactDOM.render(
    <Provider store={BBStore}>
      <BBFrame />
    </Provider>,
    document.getElementById('bioblocks-frame'),
  );
}

if (module.hot) {
  module.hot.accept();
}
