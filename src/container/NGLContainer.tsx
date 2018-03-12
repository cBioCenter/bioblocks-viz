import * as NGL from 'ngl';
import * as React from 'react';
import * as util from 'util';

import { IStageLoadFileParams, PickingProxy, Stage, StructureComponent } from 'ngl';
import { GeneInfo } from '../component/GeneInfo';

export class NGLContainer extends React.Component<any, any> {
  private canvas: HTMLElement | null = null;
  constructor(props: any) {
    super(props);
  }

  public async componentDidMount() {
    if (this.canvas) {
      const stage = new NGL.Stage(this.canvas);
      const params: IStageLoadFileParams = {
        defaultRepresentation: true,
      };

      const structure = (await stage.loadFile('assets/1fqg.pdb', params)) as StructureComponent;

      structure.autoView();

      let ele: NGL.RepresentationElement;

      stage.mouseControls.add('hoverPick', (aStage: Stage, pickingProxy: PickingProxy) => {
        if (pickingProxy && (pickingProxy.atom || pickingProxy.bond)) {
          const atom = pickingProxy.atom || pickingProxy.closestBondAtom;
          if (ele) {
            structure.removeRepresentation(ele);
          }
          ele = structure.addRepresentation('spacefill', {
            sele: atom.resno.toString(),
          });
        }
      });
    }
  }

  public render() {
    return (
      <div id="NGLContainer">
        <div ref={el => (this.canvas = el)} style={{ height: 400, width: 400 }} />
        <GeneInfo />
      </div>
    );
  }
}
