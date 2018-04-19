import * as React from 'react';

import { Card, Dropdown, DropdownItemProps } from 'semantic-ui-react';

import { CHELL_DATA_TYPE, IContactMapData, ICouplingScore, NGL_DATA_TYPE, T_SNE_DATA_TYPE, VIZ_TYPE } from 'chell';
import { ISpringGraphData } from 'spring';
import { NGLComponent } from '../component/NGLComponent';
import { SpringComponent } from '../component/SpringComponent';
import { TComponent } from '../component/TComponent';
import { withDefaultProps } from '../helper/ReactHelper';
import { ContactMapComponent } from './ContactMapComponent';

const defaultProps = {
  data: {} as Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
  height: 450,
  initialViz: VIZ_TYPE['T-SNE'],
  onDataSelect: (e: any) => {
    return;
  },
  selectedData: undefined as ICouplingScore | undefined,
  supportedVisualizations: [] as VIZ_TYPE[],
  width: 450,
};

const initialState = {
  selectedViz: defaultProps.initialViz,
};

type Props = {} & typeof defaultProps;
type State = Readonly<typeof initialState>;

export const VizSelectorPanel = withDefaultProps(
  defaultProps,

  /**
   * A single visualization panel allowing a user to select how they wish to view data.
   *
   * @export
   * @class VizSelectorPanel
   * @extends {React.Component<Props, State>}
   */
  class VizSelectorPanelClass extends React.Component<Props, State> {
    public readonly state: State = initialState;

    constructor(props: Props) {
      super(props);
      this.state = {
        selectedViz: props.initialViz ? props.initialViz : VIZ_TYPE.SPRING,
      };
    }

    public render() {
      const { data, selectedData, supportedVisualizations, width } = this.props;

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
              {this.renderVizContainer(this.state.selectedViz, data, selectedData)}
            </Card>
          }
        </div>
      );
    }

    protected renderVizContainer(
      viz: VIZ_TYPE,
      data: Partial<{ [K in VIZ_TYPE]: CHELL_DATA_TYPE }>,
      selectedData?: ICouplingScore | number,
    ) {
      const { height, width } = this.props;
      switch (viz) {
        case VIZ_TYPE['T-SNE']:
          return <TComponent data={data['T-SNE'] as T_SNE_DATA_TYPE} height={height} width={width} />;
        case VIZ_TYPE.SPRING:
          return <SpringComponent data={data.Spring as ISpringGraphData} height={height} width={width} />;
        case VIZ_TYPE.NGL:
          return (
            <NGLComponent
              data={data.NGL as NGL_DATA_TYPE}
              selectedData={selectedData as ICouplingScore}
              onHoverPickCallback={this.props.onDataSelect}
            />
          );
        case VIZ_TYPE.CONTACT_MAP:
          return (
            <ContactMapComponent
              data={data['Contact Map'] as IContactMapData}
              onMouseEnter={this.props.onDataSelect}
              selectedData={selectedData as number}
            />
          );
        case VIZ_TYPE.CONTACT_MAP_DYGRAPH:
          return (
            <ContactMapComponent
              chartLib={'dygraph'}
              data={data['Contact Map'] as IContactMapData}
              onMouseEnter={this.props.onDataSelect}
              selectedData={selectedData as number}
            />
          );
        case VIZ_TYPE.CONTACT_MAP_HIGH_CHART:
          return (
            <ContactMapComponent
              chartLib={'highchart'}
              data={data['Contact Map'] as IContactMapData}
              onMouseEnter={this.props.onDataSelect}
              selectedData={selectedData as number}
            />
          );
        case VIZ_TYPE.CONTACT_MAP_PLOTLY:
          return (
            <ContactMapComponent
              chartLib={'plotly'}
              data={data['Contact Map'] as IContactMapData}
              onMouseEnter={this.props.onDataSelect}
              selectedData={selectedData as number}
            />
          );
        case VIZ_TYPE.CONTACT_MAP_RECHART:
          return (
            <ContactMapComponent
              chartLib={'rechart'}
              data={data['Contact Map'] as IContactMapData}
              onMouseEnter={this.props.onDataSelect}
              selectedData={selectedData as number}
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
