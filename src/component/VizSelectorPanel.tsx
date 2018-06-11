import * as React from 'react';
import { Card, Dropdown, DropdownItemProps } from 'semantic-ui-react';
import { ISpringGraphData } from 'spring';
import NGLComponent from '../component/NGLComponent';
import SpringComponent from '../component/SpringComponent';
import TComponent from '../component/TComponent';
import { CHELL_DATA_TYPE, IContactMapData, NGL_DATA_TYPE, T_SNE_DATA_TYPE, VIZ_TYPE } from '../data/chell-data';
import { withDefaultProps } from '../helper/ReactHelper';
import PredictedContactMap from './PredictedContactMap';

export const defaultVizPanelProps = {
  data: {} as Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
  height: 450,
  initialViz: VIZ_TYPE['T-SNE'],
  padding: 15,
  supportedVisualizations: [] as VIZ_TYPE[],
  width: 450,
};

export const initialVizPanelState = {
  selectedViz: defaultVizPanelProps.initialViz,
};

export type VizPanelProps = {} & typeof defaultVizPanelProps;
export type VizPanelState = Readonly<typeof initialVizPanelState>;

const VizSelectorPanel = withDefaultProps(
  defaultVizPanelProps,

  /**
   * A single visualization panel allowing a user to select how they wish to view data.
   *
   * @export
   * @extends {React.Component<VizPanelProps, VizPanelState>}
   */
  class VizSelectorPanelClass extends React.Component<VizPanelProps, VizPanelState> {
    public readonly state: VizPanelState = initialVizPanelState;

    constructor(props: VizPanelProps) {
      super(props);
      this.state = {
        selectedViz: props.initialViz ? props.initialViz : VIZ_TYPE.SPRING,
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
            <TComponent
              data={data['T-SNE'] as T_SNE_DATA_TYPE}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          );
        case VIZ_TYPE.SPRING:
          return (
            <SpringComponent
              data={data.Spring as ISpringGraphData}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          );
        case VIZ_TYPE.NGL:
          return (
            <NGLComponent
              data={data.NGL as NGL_DATA_TYPE}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          );
        case VIZ_TYPE.CONTACT_MAP:
          return (
            <PredictedContactMap
              data={data['Contact Map'] as IContactMapData}
              height={paddedHeight}
              padding={padding}
              width={paddedWidth}
            />
          );
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
  },
);

export default VizSelectorPanel;
export { VizSelectorPanel };
