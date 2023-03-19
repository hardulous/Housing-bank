import React, { useEffect, useState } from "react";
import { Breadcrumb } from "../../../../matx";
import "../folder/index.css";
import {
  Paper,
  Grid,
  Tooltip,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  IconButton,
  TableHead,
  Button,
  Divider,
  Fab,
  Drawer,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect as useSelector } from "react-redux";
import { getCabinaetData } from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import history from "../../../../history";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericChip from "app/views/utilities/GenericChips";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import { unstable_batchedUpdates } from "react-dom";
import axios from "axios";
import SystemUpdateAltTwoToneIcon from "@material-ui/icons/SystemUpdateAltTwoTone";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AssessmentIcon from "@material-ui/icons/Assessment";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import MultipleSelect from "./MultipleSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { Add, ChevronRight } from "@material-ui/icons";
import CreateFile from "./CreateFile";
import CreateVolumeFile from "./CreateVolumeFile";
import Custodian from "./Custodian";

let drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperNotOpen: {
    width: drawerWidth,
    top: "4.7rem",
    height: Number(window.innerHeight - 98),
    visibility: "initial",
    display: "none",
  },
  drawerPaperOpen: {
    width: drawerWidth,
    top: "5rem",
    height: Number(window.innerHeight - 98),
    display: "initial",
  },
  drawerHeader: {
    display: "grid",
    gridTemplateColumns: "3rem 1fr",
    alignItems: "center",
    background: "#9b9b9b5c",
  },
  drawerContainer: {
    padding: "1rem",
  },
}));

const CabinetTable = (props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const { blnValueCabinet } = props.subscribeApi;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);

  const [openCustodian, setOpenCustodian] = useState(false);
  const [createVolume, setcreateVolume] = useState(false);
  const [createFile, setcreateFile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAdvance, setOpenAdvance] = useState(false);

  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("department");
  const username = localStorage.getItem("username");

  const openFileCreate = () => {
    setcreateFile(!createFile);
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleCreateVol = () => {
    setcreateVolume(!createVolume);
  };

  const handleCustodian = () => {
    setOpenCustodian(!openCustodian);
  };

  const handleOpenAdvance = () => {
    setOpenAdvance(!openAdvance);
  };

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "oldFile",
      label: "OldFile",
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
      value: "caseNumber",
      label: "Case Number",
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
  const classObj = {
    Container: "",
    ChipContainer: "PaChipCon",
    FilterInpContainer: "PaFilterInputs",
  };

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
      name: "advance",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "oldFile",
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
      name: "caseNumber",
      type: "text",
      size: "small",
      variant: "outlined",
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
      name: "oldFile",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Old FileName",
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
      name: "caseNumber",
      type: "text",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Case Number",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "CreatedOn",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Status",
      color: "primary",
    },
  ];
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});

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
  const addSort = (sortObj) => {
    console.log(sortObj);
    setSortBy(sortObj);
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };
  const { theme } = useSelector((state) => state);
  const { mount } = useSelector((state) => state.refreshings);

  useEffect(() => {
    loadCabinateData();
  }, [blnValueCabinet, Filter, SortBy, mount]);

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    console.log(rowData);
    let tempArr = rowData.data?.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  const loadCabinateData = () => {
    props
      .getCabinaetData(role, department, username, {
        filter: _.isEmpty(Filter) ? null : Filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      })
      .then((resp) => {
        if (resp.error) {
          callMessageOut(resp.error);
        }
        try {
          setRowData(resp);
          setTotalCount(resp.length);
          props.changingTableStateCabinet(false, "CHANGE_CABINET");
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => callMessageOut(err.message));
  };

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const handleClick = (rowData) => {
    sessionStorage.setItem("InboxID", rowData.id);
    sessionStorage.setItem("pa_id", rowData.personalApplicationInventoryId);
    Cookies.set("inboxFile", rowData.subject);
    Cookies.set("priority", rowData.priority);
    Cookies.set("isCabinet", true);
    Cookies.set("cabinetStatus", rowData.status);
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("type", rowData.type);
    Cookies.set("cabinetpartcase", rowData.partcaseId);
    Cookies.set("cabinetid", rowData.id);
    Cookies.set("department", rowData.department);
    Cookies.set("partCase", true);
    history.push({
      pathname: "/eoffice/splitView/file",
      state: rowData.subject,
    });
  };

  const CustomToolbarMarkup = () => {
    const show = selectedRow?.status === "In-Cabinet";

    return (
      <div>
        <div className="CabinetHeadTop">
          <GenericSearch
            FilterTypes={FilterTypes}
            FilterValueTypes={FilterValueTypes}
            addFilter={addFilter}
            cssCls={{}}
            width="70%"
          />
          <div
            className="internal-head-icon"
            style={{
              visibility: selectedRow ? "visible" : "hidden",
            }}
          >
            <span
              style={{
                visibility: show ? "visible" : "hidden",
              }}
            >
              <Tooltip title={t("permanently_close")}>
                <IconButton>
                  <SystemUpdateAltTwoToneIcon onClick={handleDialog} />
                </IconButton>
              </Tooltip>
            </span>

            <span
              style={{
                visibility: show ? "visible" : "hidden",
              }}
            >
              <Tooltip title={t("create_volume_file")}>
                <IconButton>
                  <NoteAddOutlinedIcon onClick={handleCreateVol} />
                </IconButton>
              </Tooltip>
            </span>

            <span>
              <Tooltip title={t("manage_custodian")}>
                <IconButton>
                  <AssessmentIcon onClick={handleCustodian} />
                </IconButton>
              </Tooltip>
            </span>
          </div>
          <div className="CabinetIconCon">
            <Tooltip title={t("Create File")}>
              <span>
                <Fab
                  disabled={!props.myInfo}
                  style={{
                    width: "2.2rem",
                    height: ".1rem",
                    backgroundColor: "rgb(230, 81, 71)",
                  }}
                  onClick={() => openFileCreate(true)}
                >
                  <Add style={{ fontSize: "19", color: "#fff" }} />
                </Fab>
              </span>
            </Tooltip>
          </div>
          <div>
            <GenericFilterMenu
              FilterValueTypes={SortValueTypes}
              addSort={addSort}
            />
          </div>
        </div>
        <GenericChip Filter={Filter} deleteChip={deleteChip} />
      </div>
    );
  };

  return (
    <>
      <Grid style={{ padding: ".5rem 1rem" }} className="cabinate_container">
        <Grid item xs={12}>
          <Breadcrumb
            routeSegments={[{ name: t("cabinet"), path: "/personnel/file" }]}
          />
        </Grid>
      </Grid>

      <Grid container id="test">
        <Grid>
          <Paper
            style={{
              width: "100%",
              borderRadius: "9px",
              marginRight: "1rem",
            }}
          >
            <CustomToolbarMarkup />
            <div style={{ padding: "0 1rem" }}>
              <TableContainer
                component={Paper}
                className="CabinateTableContainer"
                style={{
                  border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                }}
              >
                <Table component="div">
                  <TableHead
                    component="div"
                    style={{
                      backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                    }}
                  >
                    <TableRow component="div">
                      <div className="CabinetTableCellView head">
                        <div></div>
                        <div>RESIDING WITH</div>
                        <div>OLD FILE#</div>
                        <div>SUBJECT</div>
                        <div>CUSTODIAN</div>
                        <div>STATUS</div>
                        <div>CREATED ON</div>
                      </div>
                    </TableRow>
                  </TableHead>
                  <TableBody component="div" style={{}}>
                    <div
                      style={{
                        overflowY: "auto",
                        height: `calc(100vh - 260px )`,
                      }}
                    >
                      {rows?.map((item, index) => {
                        let custodianStr = item?.custodian?.reduce(
                          (a, c, i) =>
                            (a = a.concat(
                              `${c}${
                                i + 1 === item?.custodian?.length ? "" : ", "
                              }`
                            )),
                          ""
                        );
                        return (
                          <TableRow
                            key={index}
                            hover
                            component="div"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              handleClick(item);
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRow(item);
                            }}
                            style={{
                              borderBottom: "1px solid #8080805c",
                              backgroundColor:
                                selectedRow?.id === item.id ? "#6fe1e124" : "",
                            }}
                          >
                            <div className="CabinetTableCellView body">
                              <div className="serialNo">{index + 1}</div>
                              <div>{item.residingWith}</div>
                              <div>{item.oldFile}</div>
                              <div>{item.subject}</div>
                              <div>{custodianStr}</div>
                              <div>{item.status}</div>
                              <div>{item.createdOn}</div>
                            </div>
                          </TableRow>
                        );
                      })}
                    </div>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <PaginationComp
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </Paper>
        </Grid>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={openAdvance}
          classes={{
            paper: !openAdvance
              ? classes.drawerPaperNotOpen
              : classes.drawerPaperOpen,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleOpenAdvance} style={{ float: "left" }}>
              <ChevronRight />
            </IconButton>
            <Typography variant="h6" component="h6" align="center">
              Advance Search
            </Typography>
          </div>
          <div className={classes.drawerContainer}>
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="advance_send_by"
                    options={["test 01", "tes 02"]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Send By"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="advance_created_by"
                    options={["test 01", "tes 02"]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Created By"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="advance_file_no"
                    options={["test 01", "tes 02"]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="File No"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="advance_file_subject"
                    options={["test 01", "tes 02"]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="File Subject"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Status"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </form>
          </div>
        </Drawer>
      </Grid>

      <Custodian
        cabinetFile={selectedRow}
        open={openCustodian}
        handleClose={handleCustodian}
      />
      <CreateVolumeFile
        cabinetFile={selectedRow}
        open={createVolume}
        handleClose={handleCreateVol}
      />
      <ConfirmationDialog
        cabinetFile={selectedRow}
        open={openDialog}
        handleClose={handleDialog}
      />
      <CreateFile
        cabinetFile={selectedRow}
        open={createFile}
        handleClose={openFileCreate}
      />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    myInfo: state.myInfo,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getCabinaetData,
  changingTableStateCabinet,
})(CabinetTable);
