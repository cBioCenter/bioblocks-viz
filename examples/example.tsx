import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Grid, GridRow, Label } from 'semantic-ui-react';

import { NGLComponent } from '../src/component/NGLComponent';
import { PredictedContactMap } from '../src/component/PredictedContactMap';
import { ChellContext } from '../src/context/ChellContext';
import { VIZ_TYPE } from '../src/data/chell-data';
import { fetchAppropriateDataFromFile, fetchContactMapData } from '../src/helper/DataHelper';

class ExampleApp extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {
      [VIZ_TYPE.CONTACT_MAP]: null,
      [VIZ_TYPE.NGL]: null,
    };
  }

  public async componentDidMount() {
    this.setState({
      [VIZ_TYPE.CONTACT_MAP]: await fetchContactMapData('assets/beta_lactamase'),
    });
  }

  public render() {
    console.log(this.state);
    return (
      <div id="ChellVizApp">
        <ChellContext>
          <Grid centered={true}>
            <GridRow>
              <NGLComponent data={this.state[VIZ_TYPE.NGL]} showConfiguration={false} />
              {this.state[VIZ_TYPE.CONTACT_MAP] && <PredictedContactMap data={this.state[VIZ_TYPE.CONTACT_MAP]} />}
            </GridRow>
            <GridRow>
              {this.renderFileUploadForm(VIZ_TYPE.NGL)}
              {this.renderFileUploadForm(VIZ_TYPE.CONTACT_MAP)}
            </GridRow>
          </Grid>
        </ChellContext>
      </div>
    );
  }

  protected renderFileUploadForm = (vizType: VIZ_TYPE) => (
    <Label as="label" basic={true} htmlFor={vizType}>
      <Button
        icon={'upload'}
        label={{
          basic: true,
          content: `Upload data for ${vizType}`,
        }}
        labelPosition={'right'}
      />
      <input id={vizType} onChange={this.onFileUpload(vizType)} hidden={true} type={'file'} required={true} />
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
}

ReactDOM.render(<ExampleApp />, document.getElementById('example-root'));

if (module.hot) {
  module.hot.accept();
}
