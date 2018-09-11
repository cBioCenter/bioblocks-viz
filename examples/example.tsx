import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Grid, GridColumn, GridRow, Header, Label, Segment } from 'semantic-ui-react';

import { NGLComponent } from '../src/component/NGLComponent';
import { PredictedContactMap } from '../src/component/PredictedContactMap';
import { ChellContext } from '../src/context/ChellContext';
import { VIZ_TYPE } from '../src/data/chell-data';
import { ChellPDB } from '../src/data/ChellPDB';
import { fetchAppropriateDataFromFile, fetchContactMapData, getCouplingScoresData } from '../src/helper/DataHelper';
import { fetchCSVFile, readFileAsText } from '../src/helper/FetchHelper';
import { generateResidueMapping } from '../src/helper/ResidueMapper';

class ExampleApp extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {
      [VIZ_TYPE.CONTACT_MAP]: null,
      [VIZ_TYPE.NGL]: null,
      couplingScores: null,
      residueMapping: [],
    };
  }

  public async componentDidMount() {
    const initialDir = 'assets/beta_lactamase';
    const couplingScores = await fetchCSVFile(`${initialDir}/coupling_scores.csv`);
    this.setState({
      [VIZ_TYPE.CONTACT_MAP]: await fetchContactMapData(initialDir),
      couplingScores,
    });
  }

  public render() {
    return (
      <div id="ChellVizApp">
        <Header as={'h2'} attached={'top'}>
          Chell - Contact Map / NGL Interaction
        </Header>
        <Segment attached={true} raised={true}>
          <ChellContext>
            <Grid centered={true} columns={2} padded={'horizontally'}>
              <GridColumn>
                <GridRow centered={true}>
                  <NGLComponent data={this.state[VIZ_TYPE.NGL]} showConfiguration={false} />
                </GridRow>
                <GridRow centered={true}>{this.renderPDBUploadForm()}</GridRow>
              </GridColumn>
              <GridColumn>
                <GridRow>
                  {this.state[VIZ_TYPE.CONTACT_MAP] && (
                    <PredictedContactMap data={this.state[VIZ_TYPE.CONTACT_MAP]} enableSliders={false} />
                  )}
                </GridRow>
                <GridRow>
                  {this.renderCouplingScoresUploadForm()}
                  {this.renderResidueMappingUploadForm()}
                </GridRow>
              </GridColumn>
            </Grid>
          </ChellContext>
        </Segment>
      </div>
    );
  }

  protected renderCouplingScoresUploadForm = () => (
    <Label as="label" basic={true} htmlFor={'coupling-scores'}>
      <Button
        icon={'upload'}
        label={{
          basic: true,
          content: 'Upload Coupling Scores data for Contact Map',
        }}
        labelPosition={'right'}
      />
      <input id={'coupling-scores'} onChange={this.onCouplingScoreUpload} hidden={true} type={'file'} required={true} />
    </Label>
  );

  protected renderPDBUploadForm = () => (
    <Label as="label" basic={true} htmlFor={'pdb'}>
      <Button
        icon={'upload'}
        label={{
          basic: true,
          content: `Upload PDB for NGL`,
        }}
        labelPosition={'right'}
      />
      <input id={'pdb'} onChange={this.onPDBUpload} hidden={true} type={'file'} required={true} />
    </Label>
  );

  protected renderResidueMappingUploadForm = () => (
    <Label as="label" basic={true} htmlFor={'residue-mapping'}>
      <Button
        icon={'upload'}
        label={{
          basic: true,
          content: 'Upload optional Residue Mapping data for Contact Map',
        }}
        labelPosition={'right'}
      />
      <input
        id={'residue-mapping'}
        onChange={this.onResidueMappingUpload}
        hidden={true}
        type={'file'}
        required={true}
      />
    </Label>
  );

  protected onFileUpload = (vizType: VIZ_TYPE) => async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;

    if (file !== null) {
      this.setState({
        [vizType]: await fetchAppropriateDataFromFile(vizType, file),
      });
    }
  };

  protected onCouplingScoreUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      const parsedFile = await readFileAsText(file);
      const couplingScores = getCouplingScoresData(parsedFile, this.state.residueMapping);
      this.setState({
        [VIZ_TYPE.CONTACT_MAP]: couplingScores,
        couplingScores,
      });
    }
  };

  protected onPDBUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      const pdbData = await ChellPDB.createPDBFromFile(file);
      this.setState({
        [VIZ_TYPE.NGL]: pdbData.nglStructure,
        pdbData,
      });
    }
  };

  protected onResidueMappingUpload = async (e: React.ChangeEvent) => {
    const files = (e.target as HTMLInputElement).files;
    const file = files ? files.item(0) : null;
    if (file !== null) {
      const parsedFile = await readFileAsText(file);
      const residueMapping = generateResidueMapping(parsedFile);
      this.setState({
        [VIZ_TYPE.CONTACT_MAP]: {
          couplingScores: getCouplingScoresData(this.state.couplingScores, residueMapping),
          pdbData: this.state[VIZ_TYPE.NGL],
        },
        residueMapping,
      });
    }
  };
}

ReactDOM.render(<ExampleApp />, document.getElementById('example-root'));

if (module.hot) {
  module.hot.accept();
}
