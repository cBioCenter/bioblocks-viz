import * as React from 'react';

import { Dropdown, DropdownItemProps } from 'semantic-ui-react';

import { ProteinViewer } from './ProteinViewer';
import { SpringContainer } from './SpringContainer';
import { TContainer } from './TContainer';

export enum VIZ_TYPE {
  NGL = 'NGL',
  SPRING = 'SPRING',
  'T-SNE' = 'T-SNE',
}

export interface IVizSelectorPanelProps {
  initialViz?: VIZ_TYPE;
}

export interface IVizSelectorPanelState {
  selectedViz: VIZ_TYPE;
}

export class VizSelectorPanel extends React.Component<IVizSelectorPanelProps, IVizSelectorPanelState> {
  public static defaultParams: Partial<IVizSelectorPanelProps> = {
    initialViz: VIZ_TYPE['T-SNE'],
  };

  protected dropdownItems: DropdownItemProps[] = Object.keys(VIZ_TYPE).map(viz => ({
    key: viz,
    text: viz,
    value: viz,
  }));

  constructor(props: IVizSelectorPanelProps) {
    super(props);
    this.state = {
      selectedViz: props.initialViz ? props.initialViz : VIZ_TYPE.SPRING,
    };
  }

  public render() {
    return (
      <div className="VisSelectorPanel">
        <Dropdown
          options={this.dropdownItems}
          placeholder={'Select a Visualization!'}
          fluid={true}
          onChange={this.onVizSelect}
        />
        {this.renderVizContainer(this.state.selectedViz)}
      </div>
    );
  }

  protected renderVizContainer(viz: VIZ_TYPE) {
    const dataDir = 'centroids';
    switch (viz) {
      case VIZ_TYPE['T-SNE']:
        return <TContainer dataDir={dataDir} />;
      case VIZ_TYPE.SPRING:
        return <SpringContainer dataDir={dataDir} />;
      case VIZ_TYPE.NGL:
        return <ProteinViewer />;
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
