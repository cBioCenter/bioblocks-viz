import * as React from 'react';

import { Dropdown, DropdownItemProps } from 'semantic-ui-react';

import { NGLComponent } from '../component/NGLComponent';
import { SpringComponent } from '../component/SpringComponent';
import { TComponent } from '../component/TComponent';
import { IChellDataTypes } from '../container/VizPanelContainer';
import { ContactMapComponent } from './ContactMapComponent';

export enum VIZ_TYPE {
  CONTACT_MAP = 'Contact Map',
  NGL = 'NGL',
  SPRING = 'Spring',
  'T-SNE' = 'T-SNE',
}

// type VIZ_DATA_INPUT_TYPE = SPRING_DATA_TYPE | T_SNE_DATA_TYPE;

export interface IVizSelectorPanelProps {
  initialViz?: VIZ_TYPE;
  data?: IChellDataTypes;
}

export interface IVizSelectorPanelState {
  selectedViz: VIZ_TYPE;
}

/**
 * A single visualization panel allowing a user to select how they wish to view data.
 *
 * @export
 * @class VizSelectorPanel
 * @extends {React.Component<IVizSelectorPanelProps, IVizSelectorPanelState>}
 */
export class VizSelectorPanel extends React.Component<IVizSelectorPanelProps, IVizSelectorPanelState> {
  public static defaultProps: IVizSelectorPanelProps = {
    initialViz: VIZ_TYPE['T-SNE'],
  };

  protected dropdownItems: DropdownItemProps[] = Object.keys(VIZ_TYPE).map(viz => ({
    key: viz,
    text: VIZ_TYPE[viz as keyof typeof VIZ_TYPE],
    value: VIZ_TYPE[viz as keyof typeof VIZ_TYPE],
  }));

  constructor(props: Partial<IVizSelectorPanelProps> = VizSelectorPanel.defaultProps) {
    super(props);
    this.state = {
      selectedViz: props.initialViz ? props.initialViz : VIZ_TYPE.SPRING,
    };
  }

  public render() {
    const style = {
      width: 400,
    };
    return (
      <div className="VizSelectorPanel" style={style}>
        <Dropdown
          options={this.dropdownItems}
          placeholder={'Select a Visualization!'}
          fluid={true}
          onChange={this.onVizSelect}
        />
        {this.renderVizContainer(this.state.selectedViz, this.props.data)}
      </div>
    );
  }

  protected renderVizContainer(viz: VIZ_TYPE, data: IChellDataTypes = {}) {
    switch (viz) {
      case VIZ_TYPE['T-SNE']:
        return <TComponent data={data.tsne} />;
      case VIZ_TYPE.SPRING:
        return <SpringComponent data={data.spring} />;
      case VIZ_TYPE.NGL:
        return <NGLComponent data={data.ngl} />;
      case VIZ_TYPE.CONTACT_MAP:
        return <ContactMapComponent data={{}} />;
      default:
        throw new Error(`Unknown viz: ${viz}`);
    }
  }

  protected onVizSelect = (event: React.SyntheticEvent<any>, data: any) => {
    this.setState({
      selectedViz: data.value,
    });
  };
}
