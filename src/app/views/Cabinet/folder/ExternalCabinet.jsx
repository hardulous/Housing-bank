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
  TableCell,
  Button,
  Divider,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect as useSelector } from "react-redux";
import { getexternalcabinet } from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import history from "../../../../history";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DataUtil } from "@syncfusion/ej2-data";
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
import { clearCookie } from "utils";

const useStyles = makeStyles((theme) => ({}));

const CabinetTable = (props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const { blnValueCabinet } = props.subscribeApi;
  console.log({ blnValueCabinet });
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("department");
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openCustodian, setOpenCustodian] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const [financialYear, setFinancialYear] = React.useState(2021);
  const [classificationValue, setClassificationValue] = React.useState(null);
  const [financialYearValue, setFinancialYearValue] = React.useState(null);
  const [subSectionValue, setSubSectionValue] = useState(null);
  const [custodianValue, setCustodianValue] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenManageCustodian = () => {
    setOpenCustodian(true);
  };

  const handleClickCloseManageCustodian = () => {
    setOpenCustodian(false);
  };

  const classes = useStyles();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubSectionChange = (event, newValue) => {
    setSubSectionValue(newValue);
  };

  const handleCustodianChange = (event, newValue) => {
    setCustodianValue(newValue);
  };

  const handleClassificationChange = (event, newValue) => {
    setClassificationValue(newValue);
  };

  const handleFinancialYearChange = (event, newValue) => {
    setFinancialYearValue(newValue);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDialog = () => {
    setOpenDialog(false);
  };

  const subSectionOptions = [
    { title: "Option 1" },
    { title: "Option 2" },
    { title: "Option 3" },
  ];

  const custodianOptions = [
    { title: "Custodian 1" },
    { title: "Custodian 2" },
    { title: "Custodian 3" },
  ];

  const API_URLA = "https://mocki.io/v1/7af3523c-b1e6-49a6-a2f6-8b0c7a1ead80";
  const handleVolumeFile = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.get(API_URLA);
      const data = response.data;
      data.id = false;
      await axios.get(API_URLA, data);
    } catch (error) {
      console.error(error);
    }
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

  useEffect(() => {
    clearCookie()
  }, []);

  const loadCabinateData = () => {
    props
      .getexternalcabinet(department, pageSize, currentPage, {
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
    Cookies.set("isCabinet", rowData.id);
    // Cookies.set("cabinetStatus", rowData.status);
    Cookies.set("cabinetpartcase", rowData.partcaseId);
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("type", rowData.type);
    Cookies.set("partCase", true);
    history.push({
      pathname: "/eoffice/splitView/file",
      state: rowData.subject,
    });
  };

  const CustomToolbarMarkup = () => (
    <div style={{ borderBottom: "1px solid #c7c7c7" }}>
      <div className="CabinetHeadTop">
        <GenericSearch
          FilterTypes={FilterTypes}
          FilterValueTypes={FilterValueTypes}
          addFilter={addFilter}
          cssCls={{}}
        />
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

  const validationSchema = yup.object({
    subject: yup.string().required("Please enter your feedback"),
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
    },

    validationSchema: validationSchema,
    onSubmit: (value) => {
      handleVolumeFile(value);
    },
  });

  return (
    <>
      <Grid className="cabinate_container">
        <Grid>
          <Paper
            style={{
              height: "calc(100vh - 90px)",
              width: "100%",
              borderRadius: "9px",
              border: "1px solid #c7c7c7",
              marginRight: "1rem",
            }}
          >
            <CustomToolbarMarkup />
            <TableContainer
              component={Paper}
              className="CabinateTableContainer"
              style={{
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              }}
            >
              <Table>
                <TableHead
                  component="div"
                  style={{
                    backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                  }}
                >
                  <TableRow>
                    <div className="ExternalCabinetTableCellView">
                      <TableCell style={{ fontWeight: "bold" }}>
                        RESIDING WITH
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        OLD FILE#
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        SUBJECT
                      </TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        CUSTODIAN
                      </TableCell>
                      {/* <TableCell style={{ fontWeight: "bold" }}>STATUS</TableCell> */}
                      <TableCell style={{ fontWeight: "bold" }}>
                        CREATED ON
                      </TableCell>
                    </div>
                  </TableRow>
                </TableHead>
                <TableBody component="div">
                  {rows?.map((item, index) => {
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
                          setSelectedRow(selectedRow === index ? -1 : index);
                        }}
                        style={{
                          border: "1px solid #80808066",
                          borderWidth: "0px 0px 1px 0px",
                          display: "flex",
                          flex: 1,
                          backgroundColor:
                            selectedRow === item ? "#f5f5f5" : "",
                        }}
                      >
                        <div className="serialNo"></div>
                        <div className="ExternalCabinetTableRowView">
                          <span>{index + 1}</span>
                          <span>{item.residingWith}</span>
                          <span className="oldFile">{item.oldFile}</span>
                          <span>{item.subject}</span>
                          <span>{item.custodian}</span>
                          {/* <span className="status">{item.status}</span> */}
                          <span className="date">{item.createdOn}</span>
                        </div>

                        {selectedRow === index && (
                          <div className="RowChild2">
                            <Tooltip title={t("permanently_close")}>
                              <IconButton>
                                <SystemUpdateAltTwoToneIcon
                                  onClick={handleConfirmationDialog}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t("create_volume_file")}>
                              <IconButton>
                                <NoteAddOutlinedIcon
                                  onClick={handleClickOpen}
                                />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={t("manage_custodian")}>
                              <IconButton>
                                <AssessmentIcon
                                  onClick={handleClickOpenManageCustodian}
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
      </Grid>
      <from onSubmit={formik.handleSubmit}>
        <Dialog
          className="createVolumeForm"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle className="CreateTitle" id="form-dialog-title">
            CREATE VOLUME FILE
          </DialogTitle>
          <DialogContent>
            <Divider />
            <Grid className="formStyle" item xs={12}>
              <Grid container>
                <TextField
                  id="subject"
                  label="SUBJECT"
                  variant="outlined"
                  className="Subjectclass"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="mainHead"
                    label="MAIN HEAD"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="classification-autocomplete"
                    size="small"
                    className="SubjectclassTwo"
                    options={["CLASSIFIED", "UNCLASSIFIED"]}
                    getOptionLabel={(option) => option}
                    value={classificationValue}
                    onChange={handleClassificationChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Classification" />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="financial-year-autocomplete"
                    className="SubjectclassThree"
                    size="small"
                    options={[
                      "2020-2021",
                      "2022-2023",
                      "2023-2024",
                      "2024-2025",
                      "2025-2026",
                    ]}
                    getOptionLabel={(option) => option}
                    value={financialYearValue}
                    onChange={handleFinancialYearChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Financial Year" />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="subHead"
                    label="SUB HEAD"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl className="Subjectclass">
                    <Autocomplete
                      id="subSection-autocomplete"
                      size="small"
                      className="SubjectclassTwo"
                      options={subSectionOptions}
                      getOptionLabel={(option) => option.title}
                      value={subSectionValue}
                      onChange={handleSubSectionChange}
                      renderInput={(params) => (
                        <TextField {...params} label="SubSection" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl className="Subjectclass">
                    <Autocomplete
                      id="custodian-autocomplete"
                      size="small"
                      className="SubjectclassThree"
                      options={custodianOptions}
                      getOptionLabel={(option) => option.title}
                      value={custodianValue}
                      onChange={handleCustodianChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Custodian" />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="connectedFiles"
                    label="CONNECTED FILES"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="volume"
                    label="VOLUME"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="caseNumber"
                    label="CASE NUMBER"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="oldFileRefrence"
                    label="OLD FILE REFRENCE"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Divider />
            <div className="DialogIcons">
              <Button className="CreateButton" onClick={handleVolumeFile}>
                CREATE
              </Button>
              <Button className="CabinetCancelButton" onClick={handleClose}>
                CANCEL
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </from>
      <div className="selectRolesForm">
        <Dialog
          className="selectRoles"
          open={openCustodian}
          onClose={handleClickCloseManageCustodian}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle className="CreateTitle" id="form-dialog-title">
            SELECT ROLES
          </DialogTitle>
          <DialogContent>
            <Divider />
            <Grid className="formStyle" item xs={12}>
              <Grid container>
                <MultipleSelect />
              </Grid>
              <Divider />
            </Grid>
            <div className="DialogIcons">
              <Button className="CreateButton">UPDATE</Button>
              <Button
                className="CabinetCancelButton"
                onClick={handleClickCloseManageCustodian}
              >
                CANCEL
              </Button>
            </div>
          </DialogContent>
          <Paper
            style={{
              maxHeight: "2vh",
              minHeight: "2vh",
              maxWidth: "60vh",
              minWidth: "60vh",
            }}
          />
        </Dialog>
      </div>
      <ConfirmationDialog open={openDialog} handleClose={handleCloseDialog} />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getexternalcabinet,
  changingTableStateCabinet,
})(CabinetTable);
