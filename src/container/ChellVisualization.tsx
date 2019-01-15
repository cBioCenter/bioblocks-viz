import * as React from 'react';

export abstract class ChellVisualization<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  constructor(props: P) {
    super(props);
  }
}
