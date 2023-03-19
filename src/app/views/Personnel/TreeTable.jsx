import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Row from "./Row";
import "./TreeTable.css";
import { useState } from "react";

const TreeTable = (props) => {
  const [selectedRowId, setSelectedRowId] = useState(1);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" style={{ tableLayout: "auto" }}>
        <TableHead>
          <TableRow id="tableHeader">
            <TableCell width="15%" />
            <TableCell align="left" width="20%">
              SNO.
            </TableCell>
            <TableCell align="center">SUBJECT</TableCell>
            <TableCell align="right" width="25%">
              STATUS
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <Row
              key={row.id}
              row={row}
              handleUpadtePdf={props.handleUpadtePdf}
              setSelectedRowId={setSelectedRowId}
              selectedRowId={selectedRowId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TreeTable;
