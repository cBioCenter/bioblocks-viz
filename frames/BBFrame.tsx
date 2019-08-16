import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { NGLContainer, PredictedContactMap, SpringContainer } from '~bioblocks-viz~/container';
import {
  BIOBLOCKS_CSS_STYLE,
  IFrameEvent,
  IUMapEventData,
  Seq,
  SeqRecord,
  VIZ_EVENT_DATA_TYPE,
  VIZ_TYPE,
} from '~bioblocks-viz~/data';
import { BBStore } from '~bioblocks-viz~/reducer';
import { UMAPSequenceContainer } from '~bioblocks-viz~/singlepage';

export interface IBBFrameProps {
  style: BIOBLOCKS_CSS_STYLE;
}

export interface IBBFrameState {
  currentViz: VIZ_TYPE | undefined;
  vizData: VIZ_EVENT_DATA_TYPE;
}

export class BBFrame extends React.Component<any, IBBFrameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentViz: undefined,
      vizData: {},
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
    const { currentViz, vizData } = this.state;

    const combinedStyle: BIOBLOCKS_CSS_STYLE = {
      ...style,
    };

    return currentViz !== undefined ? <div style={combinedStyle}>{this.renderViz(currentViz, vizData)}</div> : null;
  }

  protected onMessage = (msg: IFrameEvent<VIZ_TYPE>) => {
    this.setState({
      currentViz: msg.data.viz,
      vizData: msg.data,
    });
  };

  protected renderViz = (viz: VIZ_TYPE | undefined, vizData: VIZ_EVENT_DATA_TYPE) => {
    switch (viz) {
      case VIZ_TYPE.CONTACT_MAP:
        return <PredictedContactMap />;
      case VIZ_TYPE.NGL:
        return <NGLContainer />;
      case VIZ_TYPE.SPRING:
        return <SpringContainer />;
      case VIZ_TYPE.UMAP_SEQUENCE:
        return this.renderUmapSeq(vizData as IUMapEventData);
      default:
        return <div>{`Unsupported viz ${viz}!`}</div>;
    }
  };

  protected renderUmapSeq(vizData: IUMapEventData) {
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
      />
    );
  }
}

ReactDOM.render(
  <Provider store={BBStore}>
    <BBFrame />
  </Provider>,
  document.getElementById('bb-viz-frame'),
);

if (module.hot) {
  module.hot.accept();
}
