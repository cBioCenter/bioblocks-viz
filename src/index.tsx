import Paper from 'material-ui/Paper';
import Table, { TableCell, TableHead, TableRow } from 'material-ui/Table';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ProteinViewer } from './container/ProteinViewer';
import { SideBySideContainer } from './container/SideBySideContainer';

ReactDOM.render(
  <Paper id="Chell-Viz-Root">
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <SideBySideContainer />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <ProteinViewer />
          </TableCell>
        </TableRow>
      </TableHead>
    </Table>
  </Paper>,
  document.getElementById('root'),
);
