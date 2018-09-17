import * as React from 'react';
import { Form, GridColumn, GridRow } from 'semantic-ui-react';

import { IPlotlyData } from '../component/chart/PlotlyChart';
import { FeatureViewer } from '../component/FeatureViewer';
import { IProtein } from '../data/Protein';
import { TintedChell1DSection } from '../data/TintedChell1DSection';

export interface IFeatureViewerState {
  data: Array<Partial<IPlotlyData>>;
  domainData: Array<TintedChell1DSection<string>>;
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
  }

  public render() {
    const { domainData, protein, proteinId, showGrouped } = this.state;
    return (
      <div className={'protein-feature-viewer'}>
        <GridRow centered={true} stretched={false}>
          <GridColumn>
            <FeatureViewer
              data={domainData}
              onHoverCallback={this.renderAnnotation}
              title={protein ? protein.id : ''}
              showGrouped={showGrouped}
            />
          </GridColumn>
          <GridColumn>
            <Form onSubmit={this.onProteinInputSubmit}>
              <Form.Input onChange={this.onProteinInputChange} value={proteinId} fluid={false} width={'three'} />
              <Form.Button>Submit Protein ID</Form.Button>
              <Form.Checkbox defaultChecked={true} label={'Show grouped?'} onChange={this.onShowGroupedChange} />
            </Form>
          </GridColumn>
        </GridRow>
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
      protein,
    });
  }

  protected onProteinInputSubmit = async (e: React.FormEvent, data: any) => {
    await this.deriveProteinData();
  };

  protected onShowGroupedChange = (e: React.FormEvent, data: any) => {
    this.setState({
      showGrouped: data.checked,
    });
  };

  protected renderAnnotation = (proteinId: string, index: number) => {
    const { domainData, protein } = this.state;
    if (protein) {
      const pFamId = protein.dbReferences
        .filter(dbRef => dbRef.type === 'Pfam')
        .filter(pFamRef => pFamRef.properties && pFamRef.properties['entry name'] === proteinId)[0].id;

      return `${proteinId}: ${proteinId} domain (${domainData[index].start} - ${
        domainData[index].end
      })<br /><a href="http://pfam.xfam.org/family/${pFamId}">PFAM</a> <a href="http://mutationaligner.org/domains/${pFamId}">Mutagen Aligner</a>`;
    }
    return '';
  };
}

export { ProteinFeatureViewer };
export default ProteinFeatureViewer;
