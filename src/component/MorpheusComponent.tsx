import * as React from 'react';
import { getMorpheusInstance } from '~chell-viz~/helper';

export class MorpheusComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public async componentDidMount() {
    const morpheusApp = await getMorpheusInstance();
    const morpheusJson = {
      columnMetadataModel: {
        vectors: [
          {
            array: [
              '2803-Primary Blood Derived Cancer - Peripheral Blood',
              '2804-Primary Blood Derived Cancer - Peripheral Blood',
              '2805-Primary Blood Derived Cancer - Peripheral Blood',
              '2806-Primary Blood Derived Cancer - Peripheral Blood',
              '2807-Primary Blood Derived Cancer - Peripheral Blood',
              '2808-Primary Blood Derived Cancer - Peripheral Blood',
              '2809-Primary Blood Derived Cancer - Peripheral Blood',
            ],
            name: 'id',
          },
          {
            array: ['a', 'b', 'c', 'd', 'a', 'a', 'b'],
            name: 'Minimal example',
          },
        ],
      },
      columns: 7,

      rowMetadataModel: {
        vectors: [
          {
            array: ['1p33', '1q43', '11q23.3', '13q31.3', '19p13.2'],
            name: 'id',
          },
          {
            array: [0.01952, 0.001933, 3.125e-9, 0.2114, 0.2114],
            name: 'Description',
          },
        ],
      },
      rows: 5,
      seriesArrays: [
        [
          [
            0,
            -0.004495999775826931,
            -0.0012469999492168427,
            -0.0013859999598935246,
            -0.02394000068306923,
            0.000970599998254329,
            -0.0016629999736323953,
          ],
          [
            0,
            -0.0049230000004172325,
            -0.0012469999492168427,
            -0.0013859999598935246,
            -0.00861200038343668,
            -0.001879999996162951,
            -0.0016629999736323953,
          ],
          [
            0.011169999837875366,
            -0.0046190000139176846,
            0.3653999865055084,
            -0.0022499999031424522,
            0.007083000149577856,
            -0.0022169998846948147,
            0.001247999956831336,
          ],
          [
            -0.0014720000326633453,
            -0.004370000213384628,
            -0.004155000206083059,
            -0.003186000045388937,
            -0.01737000048160553,
            -0.00761000020429492,
            -0.0034630000591278076,
          ],
          [
            0.00546600017696619,
            -0.01664000004529953,
            -0.011339999735355377,
            0.013770000077784061,
            -0.04292000085115433,
            -0.026510000228881836,
            -0.019260000437498093,
          ],
        ],
      ],
      seriesDataTypes: ['Float32'],
      seriesNames: ['Minimal example'],
    };

    return this.generateHeatMap(morpheusApp, morpheusJson);
  }

  public render() {
    return <div id="morpheus-container" />;
  }

  // tslint:disable-next-line:whitespace
  protected generateHeatMap = (morpheusApp: typeof import('morpheus-app'), morpheusJson: object) => {
    return new morpheusApp.HeatMap({
      colorScheme: {
        map: [
          {
            color: '#0000ff',
            value: -2,
          },
          {
            color: '#ffffff',
            value: 0,
          },
          {
            color: '#ff0000',
            value: 2,
          },
        ],
        // optional color scheme. default is relative
        type: 'fixed',
      },
      dataset: morpheusApp.Dataset.fromJSON(morpheusJson),
      el: document.querySelector('#morpheus-container'),
      tools: [
        {
          // optional tools to run at load time
          name: 'Hierarchical Clustering',
          params: { cluster: 'Rows and columns' },
        },
      ],
    });
  };
}
