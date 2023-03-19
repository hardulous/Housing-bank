import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { loadAnnexureTableData } from "../../camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "./therme-source/material-ui/loading";
import { useEffect } from "react";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const Row = (props) => {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const classes = useRowStyles();
  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleDropDown = (e, rowData) => {
    setLoading(true);
    e.stopPropagation();
    if (open === false) {
      props.loadAnnexureTableData(rowData.id).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            let tmpArr = [];
            tmpArr = resp.data.map((item, i) => {
              return { ...item, serialNo: i };
            });
            setData(tmpArr);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    }
    setLoading(false);
    setOpen(!open);
  };

  const handleFileSelect = (item) => {
    let arr = [];
    if (item.fileName) {
      arr = item.fileName.split(".");
    } else {
      arr[1] = "docx";
    }
    props.handleUpadtePdf(item.fileURL || item.fileUrl, arr[1]);
    props.setSelectedRowId(item.id);
  };

  return (
    <React.Fragment>
      <TableRow
        onClick={() => {
          handleFileSelect(row);
        }}
        style={{
          backgroundColor:
            props.selectedRowId == row.id
              ? "rgb(174 174 174 / 36%)"
              : "" || (props.selectedRowId == 1 && row.serialNo == 1)
              ? "rgb(174 174 174 / 36%)"
              : "",
        }}
      >
        <TableCell>
          <IconButton
            id="PA_up_down"
            aria-label="expand row"
            size="small"
            onClick={(e) => handleDropDown(e, row)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.serialNo}
        </TableCell>
        <TableCell align="right">{row.subject}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
      </TableRow>
      <TableRow>
        {loading && <Loading />}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box padding={2}>
              {data.length > 0 ? (
                <>
                  <Typography variant="h6" gutterBottom component="div">
                    Annexure
                  </Typography>
                  <div id="annexureTable">
                    <Table aria-label="purchases">
                      <TableHead>
                        <TableRow id="annexureTableHeader">
                          <TableCell>SNO.</TableCell>
                          <TableCell>SUBJECT</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow
                            key={item.id}
                            onClick={() => handleFileSelect(item)}
                            id="annexureTableRow"
                            style={{
                              backgroundColor:
                                props.selectedRowId == item.id
                                  ? "rgb(174 174 174 / 36%)"
                                  : "",
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {item.serialNo + 1}
                            </TableCell>
                            <TableCell>{item.subject}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <Typography variant="h6" gutterBottom component="div">
                  No Annexure
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { loadAnnexureTableData })(Row);
