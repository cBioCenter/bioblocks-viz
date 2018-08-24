import * as React from 'react';
import { Card, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import SpringContainer from '../container/SpringContainer';
import { CHELL_DATA_TYPE, IContactMapData, NGL_DATA_TYPE, T_SNE_DATA_TYPE, VIZ_TYPE } from '../data/chell-data';
import { ISpringGraphData } from '../data/Spring';
import InfoPanel from './InfoPanel';
import NGLComponent from './NGLComponent';
import PredictedContactMap from './PredictedContactMap';
import TComponent from './TComponent';

export interface IVizPanelProps {
  data: Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>;
  height: number;
  initialViz: VIZ_TYPE;
  padding: number;
  supportedVisualizations: VIZ_TYPE[];
  width: number;
}

export interface IVizPanelState {
  selectedViz: VIZ_TYPE;
}

/**
 * A single visualization panel allowing a user to select how they wish to view data.
 *
 * @export
 * @extends {React.Component<VizPanelProps, VizPanelState>}
 */
export class VizSelectorPanel extends React.Component<IVizPanelProps, IVizPanelState> {
  public static defaultProps: Partial<IVizPanelProps> = {
    data: new Object(),
    height: 450,
    initialViz: VIZ_TYPE['T-SNE'],
    padding: 15,
    supportedVisualizations: [],
    width: 450,
  };

  constructor(props: IVizPanelProps) {
    super(props);
    this.state = {
      selectedViz: props.initialViz,
    };
  }

  public render() {
    // N.B. We are only setting the width of the VizSelectorPanel, explicitly leaving out the height.
    // This means a component can only grow vertically, but not horizontally, and be correctly styled in containers.
    const { data, supportedVisualizations, width } = this.props;

    return (
      <div className="VizSelectorPanel" style={{ width }}>
        <Dropdown
          options={this.generateDropdownItems(supportedVisualizations)}
          fluid={true}
          onChange={this.onVizSelect}
          defaultValue={this.props.initialViz}
        />
        {
          <Card fluid={true} raised={true}>
            {this.renderVizContainer(this.state.selectedViz, data)}
          </Card>
        }
      </div>
    );
  }

  protected renderVizContainer(viz: VIZ_TYPE, data: Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>) {
    const { padding } = this.props;
    const paddedHeight = this.props.height - padding * 2;
    const paddedWidth = this.props.width - padding * 2;
    switch (viz) {
      case VIZ_TYPE['T-SNE']:
        return (
          data['T-SNE'] && (
            <TComponent
              data={data['T-SNE'] as T_SNE_DATA_TYPE}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          )
        );
      case VIZ_TYPE.SPRING:
        return (
          data.Spring && (
            <SpringContainer
              data={data.Spring as ISpringGraphData}
              height={this.props.height}
              padding={padding}
              width={this.props.width}
            />
          )
        );
      case VIZ_TYPE.NGL:
        return (
          data.NGL && (
            <NGLComponent
              data={data.NGL as NGL_DATA_TYPE}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          )
        );
      case VIZ_TYPE.CONTACT_MAP:
        return (
          data['Contact Map'] && (
            <PredictedContactMap
              data={data['Contact Map'] as IContactMapData}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          )
        );
      case VIZ_TYPE.INFO_PANEL:
        return <InfoPanel data={data['Contact Map'] as Partial<IContactMapData>} />;
      default:
        throw new Error(`Unknown viz: ${viz}`);
    }
  }

  protected onVizSelect = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      selectedViz: data.value,
    });
  };

  protected generateDropdownItems = (supportedVisualizations: VIZ_TYPE[]): DropdownItemProps[] => {
    return supportedVisualizations
      .map(viz => ({
        key: viz,
        text: viz,
        value: viz,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  };
}

export default VizSelectorPanel;
