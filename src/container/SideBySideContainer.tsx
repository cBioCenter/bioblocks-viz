import Table, { TableCell, TableHead, TableRow } from 'material-ui/Table';
import * as React from 'react';

import { SpringContainer } from './SpringContainer';
import { TContainer } from './TContainer';

export class SideBySideContainer extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <Table id="SideBySideContainer">
        <TableHead>
          <TableRow>
            <TableCell>
              <TContainer />
            </TableCell>
            <TableCell>
              <SpringContainer />
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
    );
  }
}
