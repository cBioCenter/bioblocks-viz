import * as React from 'react';
import { Form, GridColumn, GridRow } from 'semantic-ui-react';

import { FeatureViewer } from '~chell-viz~/component';
import { IPlotlyData, IProtein, TintedChell1DSection } from '~chell-viz~/data';
import { ColorMapper } from '~chell-viz~/helper';

export interface IProteinFeatureViewerProps {
  initialProteinId: string;
}

export interface IProteinFeatureViewerState {
  data: Array<Partial<IPlotlyData>>;
  domainData: Array<TintedChell1DSection<string>>;
  protein?: IProtein;
  proteinId: string;
  showGrouped: boolean;
}

export class ProteinFeatureViewer extends React.Component<IProteinFeatureViewerProps, IProteinFeatureViewerState> {
  public static defaultProps = {
    // initialProteinId: 'Q13485',
    initialProteinId: 'Q9NYJ7',
  };

  constructor(props: IProteinFeatureViewerProps) {
    super(props);
    this.state = {
      data: [],
      domainData: [],
      proteinId: props.initialProteinId,
      showGrouped: true,
    };
  }

  public async componentDidMount() {
    await this.deriveProteinData();
  }

  public render() {
    const { domainData, protein, proteinId, showGrouped } = this.state;

    return (
      <div className={'protein-feature-viewer'}>
        <GridRow centered={true} stretched={false}>
          <GridColumn>
            <FeatureViewer
              data={domainData}
              onHoverCallback={this.renderAnnotationText}
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
    try {
      const result = await fetch(`https://www.ebi.ac.uk/proteins/api/proteins/${this.state.proteinId}`);
      const protein = (await result.json()) as IProtein;
      const domains = protein.features.filter(feature => feature.type === 'DOMAIN');
      const colorMapper = new ColorMapper<string>();

      this.setState({
        domainData: domains.map((domain, index) => {
          const { begin, description = '', end } = domain;
          // This matches domains that do and do not have other of the same domain in the protein.
          const domainName = description.split('-like')[0];

          return new TintedChell1DSection(
            domainName,
            begin ? Number.parseInt(begin, 10) : -1,
            end ? Number.parseInt(end, 10) : -1,
            colorMapper.getColorFor(domainName),
          );
        }),
        protein,
      });
    } catch (e) {
      console.log(e);
    }
  }

  protected onProteinInputSubmit = async (e: React.FormEvent, data: any) => {
    await this.deriveProteinData();
  };

  protected onShowGroupedChange = (e: React.FormEvent, data: any) => {
    this.setState({
      showGrouped: data.checked,
    });
  };

  protected renderAnnotationText = (proteinId: string, index: number) => {
    const { domainData, protein } = this.state;
    const pFamIds = protein
      ? protein.dbReferences.filter(dbRef => dbRef.type === 'Pfam').filter(pFamRef => {
          const { properties } = pFamRef;
          const entryName = properties ? properties['entry name'] : null;

          return entryName && (entryName === proteinId || entryName.localeCompare(`${proteinId}-like ${index}`));
        })
      : [];

    return pFamIds.length >= 1
      ? `${proteinId}: ${proteinId} domain (${domainData[index].start} - ${
          domainData[index].end
        })<br /><a href="http://pfam.xfam.org/family/${
          pFamIds[0].id
        }">PFAM</a> <a href="http://mutationaligner.org/domains/${pFamIds[0].id}">Mutagen Aligner</a>`
      : '';
  };
}
