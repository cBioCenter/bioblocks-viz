// tslint:disable-next-line:import-name
import Anatomogram from 'anatomogram';
import * as React from 'react';
import { CHELL_CSS_STYLE } from '~chell-viz~/data';

export interface IAnatomogramContainerProps {
  height: number | string;
  style: CHELL_CSS_STYLE;
  width: number | string;
}

export class AnatomogramContainer extends React.Component<IAnatomogramContainerProps, any> {
  public static defaultProps = {
    height: '300px',
    style: {},
    width: '400px',
  };

  constructor(props: IAnatomogramContainerProps) {
    super(props);
  }

  public render() {
    return (
      <div className={'anatomogram-container'}>
        <Anatomogram
          atlasUrl={``}
          onClick={this.onClick}
          onMouseOut={this.onMouseOut}
          onMouseOver={this.onMouseOver}
          showIds={['UBERON_0000178', 'UBERON_0000473', 'UBERON_0000955', 'UBERON_0000977']}
          species={'homo_sapiens'}
        />
      </div>
    );
  }

  protected onClick = (id: string) => {
    return;
  };

  protected onMouseOut = (id: string) => {
    return;
  };

  protected onMouseOver = (id: string) => {
    return;
  };
}
