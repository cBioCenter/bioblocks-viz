import * as React from 'react';

import { Accordion, AccordionContentProps, Form, Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { FeatureViewer } from '../component/FeatureViewer';
import { IProtein } from '../data/Protein';
import { TintedChell1DSection } from '../data/TintedChell1DSection';

export interface IFeatureViewerState {
  data: any[];
  domainData: Array<TintedChell1DSection<string>>;
  panels: any[];
  protein?: IProtein;
  proteinId: string;
  showGrouped: boolean;
}

class ProteinFeatureViewer extends React.Component<any, IFeatureViewerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      domainData: [],
      panels: [],
      proteinId: 'Q13485',
      showGrouped: true,
    };
  }

  public async componentDidMount() {
    await this.deriveProteinData();
  }

  public componentDidUpdate(prevProps: any, prevState: IFeatureViewerState) {
    const { protein } = this.state;
    console.log(protein);
    /*
    if (protein && protein !== prevState.protein) {
      this.setState({
        panels: [
          {
            content: {
              content: this.renderSubPanels('protein', protein),
            },
            key: 'protein-panel',
            title: protein.id,
          },
        ],
      });
    }*/
  }

  public render() {
    const { domainData, protein, proteinId, showGrouped } = this.state;
    return (
      <div className={'protein-feature-viewer'}>
        <Grid>
          <GridRow columns={2} centered={true} stretched={false}>
            <GridColumn>
              <FeatureViewer data={domainData} title={protein ? protein.id : ''} showGrouped={showGrouped} />
            </GridColumn>
            <GridColumn>
              <Form onSubmit={this.onProteinInputSubmit}>
                <Form.Input onChange={this.onProteinInputChange} value={proteinId} fluid={false} width={'three'} />
                <Form.Button>Submit Protein ID</Form.Button>
                <Form.Checkbox defaultChecked={true} label={'Show grouped?'} onChange={this.onShowGroupedChange} />
              </Form>
            </GridColumn>
          </GridRow>
        </Grid>
      </div>
    );
  }

  protected onProteinInputChange = (e: React.FormEvent, data: any) => {
    this.setState({
      proteinId: data.value,
    });
  };

  protected async deriveProteinData() {
    const result = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${this.state.proteinId}`);
    const protein = (await result.json()) as IProtein;
    const domains = protein.features.filter(feature => feature.type === 'DOMAIN');

    const colors = ['red', 'green', 'blue'];
    this.setState({
      domainData: domains.map((domain, index) => {
        const { begin, description = '', end } = domain;
        return new TintedChell1DSection(
          description,
          begin ? Number.parseInt(begin, 10) : -1,
          end ? Number.parseInt(end, 10) : -1,
          colors[index % colors.length],
        );
      }),
      panels: [],
      protein,
    });
  }

  protected onProteinInputSubmit = async (e: React.FormEvent, data: any) => {
    await this.deriveProteinData();
  };

  protected renderSubPanels(name: string, value: any) {
    const subPanels: AccordionContentProps[] = Object.keys(value).map((key, index) => {
      return {
        content:
          Array.isArray(value[key]) || typeof value[key] === 'object' ? (
            {
              content: this.renderSubPanels(`${name}-${key}`, value[key]),
            }
          ) : (
            <div>{value[key]}</div>
          ),
        key: `${name}-${key}`,
        title: key,
      };
    });
    const result = <Accordion.Accordion panels={subPanels} fluid={'true'} />;
    return result;
  }

  protected onShowGroupedChange = (e: React.FormEvent, data: any) => {
    this.setState({
      showGrouped: data.checked,
    });
  };
}

export { ProteinFeatureViewer };
export default ProteinFeatureViewer;
