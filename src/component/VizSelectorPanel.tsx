import * as React from 'react';

import { Card, Dropdown, DropdownItemProps } from 'semantic-ui-react';

import { ICouplingScore } from 'chell';
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

export interface IVizSelectorPanelProps {
  initialViz?: VIZ_TYPE;
  data?: IChellDataTypes;
  onDataSelect?: (e: any) => void;
  selectedData?: ICouplingScore;
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
        {
          <Card fluid={true} raised={true}>
            {this.renderVizContainer(this.state.selectedViz, this.props.data, this.props.selectedData)}
          </Card>
        }
      </div>
    );
  }

  protected renderVizContainer(viz: VIZ_TYPE, data: IChellDataTypes = {}, selectedData?: ICouplingScore | number) {
    switch (viz) {
      case VIZ_TYPE['T-SNE']:
        return <TComponent data={data.tsne} />;
      case VIZ_TYPE.SPRING:
        return <SpringComponent data={data.spring} />;
      case VIZ_TYPE.NGL:
        return (
          <NGLComponent
            data={data.ngl}
            selectedData={selectedData as ICouplingScore}
            onHoverPickCallback={this.props.onDataSelect}
          />
        );
      case VIZ_TYPE.CONTACT_MAP:
        return (
          <ContactMapComponent
            data={data.contactMap}
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
}
