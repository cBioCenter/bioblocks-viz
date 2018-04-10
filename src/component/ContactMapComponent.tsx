import * as React from 'react';
// import { CartesianGrid, Margin, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';

export type CONTACT_MAP_DATA_TYPE = object;

export interface IContactMapComponentProps {
  data: CONTACT_MAP_DATA_TYPE;
  height?: number;
  width?: number;
}

export type rechartScatterDataFormat = Array<{ x: number; y: number }>;

export class ContactMapComponent extends React.Component<IContactMapComponentProps, {}> {
  public static defaultProps: Partial<IContactMapComponentProps> = {
    height: 400,
    width: 400,
  };

  public render() {
    return (
      <div className={'ContactMapComponent'}>
        I'll be hanging on your every word, It's not obscene, it's just absurd.
      </div>
    );
  }
}
