import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Dialog,
  Slide,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Grid,
  Fab,
  TableHead,
} from "@material-ui/core";
import {
  getPADashboardData,
  getHistory,
} from "../../../camunda_redux/redux/action";
import { Tooltip, IconButton } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import { useTranslation } from "react-i18next";
import DashbordDialogComp from "./DashbordDialogComp";
import GetAppIcon from "@material-ui/icons/GetApp";
import { makeStyles } from "@material-ui/core/styles";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import PaginationComp from "app/views/utilities/PaginationComp";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import { unstable_batchedUpdates } from "react-dom";
import GenericChip from "app/views/utilities/GenericChips";
import { HiDownload } from "react-icons/hi";
import _ from "lodash";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  dialogShowHide: {
    visibility: "hidden",
    PointerEvent: "none",
  },
  table: {
    minWidth: 800,
  },
}));

const TableCard = (props) => {
  const { t } = useTranslation();
  const { handleLoading } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [rowData, setRowData] = useState([]);
  const [rowId, setRowId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pageSizes] = useState([5, 10, 15]);
  const [sampleData, setSampleData] = useState([]);
  const [dialogClassToggle, setDialogClassToggle] = useState(true);
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});

  let username = localStorage.getItem("username");
  let role = sessionStorage.getItem("role");
  let department = sessionStorage.getItem("department");

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "pfileName",
      label: "P Filename",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "status",
      label: "Status",
    },
    {
      value: "createdOn",
      label: "Created On",
    },
  ];
  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
  ];

  const FilterTypes = {
    type: "select",
    optionValue: FilterOption,
    size: "small",
    variant: "outlined",
    label: "Filter-By",
    color: "primary",
  };

  const FilterValueTypes = [
    {
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  const SortValueTypes = [
    {
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "P Filename",
      color: "primary",
    },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date",
    }
  ];

  // state variable which get track of all filter option with value

  const downloadFile = (e, row) => {
    e.stopPropagation(); // don't select this row after clicking
    const anchor = document.createElement("a");
    anchor.href = row.fileURL;
    anchor.download = row.displayPfileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  useEffect(() => loadPATableData(), [currentPage, pageSize, Filter, SortBy]);

  const loadPATableData = () => {
    handleLoading(true);
    setRowData([]);
    props
      .getPADashboardData(username, role, department, pageSize, currentPage, {
        filter: _.isEmpty(Filter) ? null : Filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      })
      .then((resp) => {
        if (resp.error) {
          callMessageOut(resp.error);
        }
        try {
          let tmpArr = [];
          if (resp) {
            if (resp.response.data !== undefined) {
              setTotalCount(resp.response.length);
              tmpArr = resp.response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRowData(tmpArr);
              const dataToBeSend = {
                ApprovalCount: resp.response.Approve,
                RejectCount: resp.response.Reject,
                InProgressCount: resp.response.InProgress,
                SentCount: resp.response.Sent,
              };
              props.totalCountPA(dataToBeSend);
              handleLoading(false);
            } else {
              const errorMessage =
                resp.response.status +
                " : " +
                resp.response.error +
                " AT " +
                resp.response.path;
              callMessageOut(errorMessage);
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const callMessageOut = (message) => {
    handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnRowClick = (rowData) => {
    setPdfUrl(rowData.fileURL);

    dispatch(setPassData(rowData.fileURL));
    setOpen(true);
    setDialogClassToggle(true);
    setRowId(rowData.id);
    console.log(rowData);
    if (rowData) {
      props.getHistory("PA", rowData.id).then((resp) => {
        if (resp) {
          !isNullOrUndefined(resp.data)
            ? setSampleData(resp.data)
            : setSampleData([]);
        }
      });
    }
  };

  const blnPdfLoads = (val) => {
    setPdfLoads(val);
  };

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(0);
        setPageSize(10);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const CustomToolbarMarkup = () => (
    <Grid
      container
      direction="column"
      style={{
        padding: "0.5rem 0rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <GenericSearch
          FilterTypes={FilterTypes}
          FilterValueTypes={FilterValueTypes}
          addFilter={addFilter}
          cssCls={{}}
        />
        <GenericFilterMenu SortValueTypes={SortValueTypes} addSort={addSort} />
      </div>
      <GenericChip Filter={Filter} deleteChip={deleteChip} />
    </Grid>
  );

  return (
    <div
      elevation={3}
      style={{ position: "relative", borderRadius: "9px" }}
      className="dashboard_table"
    >
      <Paper
        className="dash-table"
        style={{
          borderRadius: "9px",
          // border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
          width: "100%",
        }}
      >
        {CustomToolbarMarkup()}
        <div style={{ padding: "0 1rem" }}>
          <TableContainer
            component={Paper}
            className="DashTableCon"
            style={{
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              borderRadius: "6px",
            }}
          >
            <Table
              component="div"
              className={`${classes.table} App-main-table`}
              aria-label="simple table"
            >
              <TableHead component="div">
                <TableRow
                  component="div"
                  style={{
                    backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                  }}
                >
                  <div className="DashboardRow">
                    <div className="DashInfo1"></div>
                    <div className="DashInfo2">
                      <span>{t("file_name")}</span>
                    </div>
                    <div className="DashInfo3">
                      <span>{t("subject")}</span>
                    </div>
                    <div className="DashInfo4">
                      <span>{t("created_on")}</span>
                    </div>
                    <div className="DashInfo5" style={{ padding: "0rem" }}>
                      <div className="DashIcons"></div>
                      <span>{t("status")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                component="div"
                style={{
                  height: _.isEmpty(Filter)
                    ? `calc(${window.innerHeight}px - 240px)`
                    : `calc(${window.innerHeight}px - 364px)`,
                  overflow: "auto"  
                }}
                
              >
                {/* Mapping data coming from backnd */}
                {rowData.map((item, i) => {
                  // Row defination and styling here

                  return (
                    <TableRow
                      hover
                      component="div"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnRowClick(item);
                      }}
                      key={i}
                      style={{
                        borderBottom: "1px solid #8080805c",
                        position: "relative",
                      }}
                    >
                      <div className="DashboardRow body">
                        <div className="DashInfo1">
                          <span>{item.serialNo}</span>
                        </div>
                        <div className="DashInfo2">
                          <span>{item.pfileName}</span>
                        </div>
                        <div className="DashInfo3">
                          <span>{item.subject}</span>
                        </div>
                        <div className="DashInfo4">
                          <span>{item.createdOn}</span>
                        </div>
                        <div className="DashInfo5">
                          <div className="DashIcons">
                            <Tooltip
                              title={t("download")}
                              aria-label="Download"
                            >
                              <button id="dashboardDownloadFile_button">
                                <HiDownload
                                  onClick={(e) => {
                                    downloadFile(e, item);
                                  }}
                                />
                              </button>
                            </Tooltip>
                          </div>
                          <span
                            style={{
                              backgroundColor:
                                item.status === "In Progress"
                                  ? "#ffaf38"
                                  : item.status === "Draft"
                                  ? "#398ea1"
                                  : item.status === "Rejected"
                                  ? "#fd4e32"
                                  : item.status === "Approved"
                                  ? "#37d392"
                                  : item.status === "Return"
                                  ? "#b73b32"
                                  : "",
                            }}
                            className="status"
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <PaginationComp
          pageSize={pageSize}
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />
      </Paper>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        // transitionDuration={1000}
      >
        <DashbordDialogComp
          closeDialog={handleClose}
          pdfUrl={pdfUrl}
          blnPdfLoads={blnPdfLoads}
          fileId={rowId}
          sampleData={sampleData}
        />
      </Dialog>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, { getPADashboardData, getHistory })(
  TableCard
);
