import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Popover,
  Slide,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import {
  loadPADraftTableData,
  loadSfdt,
  rollbackPADocument,
  getHistory,
} from "../../camunda_redux/redux/action";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./therme-source/material-ui/loading.css";
import Annexure from "./Annexure";
import InputForm from "./quickSignFrom";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import HeadersAndFootersView from "../FileApproval/documentEditor/editor";
import { changeTableStateDraft } from "../../camunda_redux/redux/action/apiTriggers";
import Tooltip from "@material-ui/core/Tooltip";
import SendFileForm from "./SendFileForm";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import CreateIcon from "@material-ui/icons/Create";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import SendIcon from "@material-ui/icons/Send";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import HistoryIcon from "@material-ui/icons/History";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { OPEN_PA_DRAFT } from "app/camunda_redux/redux/constants/ActionTypes";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import PaginationComp from "../utilities/PaginationComp";
import { unstable_batchedUpdates } from "react-dom";
import { Loading } from "./therme-source/material-ui/loading";
import _ from "lodash";
import GenericFilterMenu from "../utilities/GenericFilterMenu";
import GenericSearch from "../utilities/GenericSearch";
import GenericChip from "../utilities/GenericChips";
import HistoryDialog from "./HistoryDialog";
import { AiOutlineHistory } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  divZIndex: {
    zIndex: "0",
    "& .MuiDialogContent-dividers": {
      padding: "0px 0px !important",
    },
    "& #pdfV": {
      height: "calc(100vh - 47px) !important",
    },
    "& .e-de-ctn": {
      height: "calc(100vh - 48px) !important",
    },
  },
  sign_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "20px !important",
    zIndex: 10,
  },
  sign_btn1: {
    position: "fixed",
    right: "30px !important",
    bottom: "100px !important",
    zIndex: 10,
  },
  headerText: {
    display: "inline-flex",
    width: "60%",
    justifyContent: "center",
    marginBottom: "0px",
    fontSize: "1.1rem",
  },
  table: {
    minWidth: "900px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DraftPaFileTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState([]);
  const [openQuickSign, setOpenQuickSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [blnOpenQuickSign, setblnOpenQuickSign] = useState(true);
  const [blnOpenEditor, setblnOpenEditor] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [rowID, setRowID] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [openSign, setOpenSign] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [headerLable, setHeaderLable] = useState({});
  const [pageSizes] = useState([5, 10, 15]);
  const [handleClickId, setHandleClickId] = useState("");
  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [openPaDialog, setOpenPaDialog] = useState(false);
  const [reSave, setreSave] = useState(false);
  const [loading, setloading] = useState(false);

  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const dept = sessionStorage.getItem("department");

  // state Variable which get track of sort option with orderBy
  const [SortBy, setSortBy] = useState({});

  // to handle update single pa either signed or unsigned without calling ap
  const [updatedPa, setupdatedPa] = useState("");

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
    },
  ];

  // state variable which get track of all filter option with value
  const [Filter, setFilter] = useState({});

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

  const { theme } = useSelector((state) => state);
  const { mount } = useSelector((state) => state.refreshings);

  useEffect(
    () => pADraftTableData(),
    [
      blnValueDraft,
      currentPage,
      pageSize,
      props.subjectReducer,
      mount,
      Filter,
      SortBy,
    ]
  );

  const pADraftTableData = () => {
    props.blnEnableLoader(true);
    setRowData([]);
    props
      .loadPADraftTableData(username, role,dept, pageSize, currentPage, {
        filter: _.isEmpty(Filter) ? null : Filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      })
      .then((resp) => {
        let tmpArr = [];
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            setTotalCount(
              resp.response.length != null ? resp.response.length : 0
            );
            tmpArr = resp.response.data.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            setRowData(tmpArr);
            props.blnEnableLoader(false);
            props.changeTableStateDraft(false, "CHANGE_PA_DRAFT");
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  const { blnValueDraft } = props.subscribeApi;

  useEffect(() => {
    if (props.openDraftPa) {
      let row = props.openDraftPa;
      // setHandleClickId(row.id);
      const url = row.fileURL;
      sessionStorage.setItem("FileURL", url);
      loadSFDT(url, row.id, row.status, row.signed);
      setHeaderLable({ subject: row.subject, pfileName: row.pfileName });
    }
    dispatch({
      type: OPEN_PA_DRAFT,
      payload: null,
    });
  }, [props.openDraftPa]);

  useEffect(() => {
    if (!blnOpenQuickSign) {
      setPdfLoads(false);
    }
  }, [blnOpenQuickSign]);

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const updateSinglePa = () => {
    let newRowData = [...rowData];
    const index = newRowData.findIndex((item) => {
      return item.id === rowID;
    });

    if (index !== -1 && updatedPa) {
      newRowData[index].signed = updatedPa.signed;
      setRowData(newRowData);
      setupdatedPa("");
    }
  };

  const loadSFDT = (url, id, status, signed) => {
    props.blnEnableLoader(true);
    let URL;
    let OpenPaDialog;
    props
      .loadSfdt(url, username, id, role, dept) // API call to load sfdt which will be visible on sincfusion
      .then((response) => {
        try {
          if (response.error) {
            callMessageOut(response.error);
            props.blnEnableLoader(false);
            return;
          } else {
            URL = response.url;
            if (URL) {
              if (status === "Draft" || status === "Return") {
                OpenPaDialog = false;
              } else {
                OpenPaDialog = true;
              }
            }
          }
          unstable_batchedUpdates(() => {
            setblnOpenQuickSign(signed);
            setRowID(id);
            setFileURL(URL);
            setblnOpenEditor(true);
            setTabIndex(0);
            setOpenQuickSign(true);
            setOpenPaDialog(OpenPaDialog);
            props.blnEnableLoader(false);
          });
        } catch (e) {
          props.blnEnableLoader(false);
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  const handleClick = (rowData) => {
    // Mtd to perform operation while row clicks
    const url = rowData.fileURL;
    sessionStorage.setItem("FileURL", url);
    loadSFDT(url, rowData.id, rowData.status, rowData.signed);
    unstable_batchedUpdates(() => {
      setHandleClickId(rowData.id);
      setHeaderLable({
        subject: rowData.subject,
        pfileName: rowData.pfileName,
      });
    });
  };

  const handleClickQuickSignClose = (shouldUpdatePa) => {
    // Mtd that triggers while clicking on close icon of quick sign dialog
    setOpenQuickSign(false);
    setblnOpenEditor(true);
    // setblnOpenQuickSign(false);
    shouldUpdatePa && updateSinglePa();
  };

  const handleDocumentRollback = () => {
    setloading(true);
    rowID &&
      props.rollbackPADocument(rowID).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setloading(false);
            return;
          } else {
            unstable_batchedUpdates(() => {
              setblnOpenQuickSign(resp.response.personalApplication.signed);
              setFileURL(resp.response.personalApplication.fileURL);
              setreSave(true);
              setloading(false);
              setupdatedPa(resp.response.personalApplication);
            });
            sessionStorage.setItem(
              "FileURL",
              resp.response.personalApplication.fileURL
            );
          }
          // pADraftTableData();
        } catch (e) {
          callMessageOut(e.message);
          setloading(false);
        }
      });
  };

  const handleStatus = (id) => {
    const newArr = rowData.map((item) =>
      item.id === id ? { ...item, status: "In Progress" } : item
    );
    setRowData(newArr);
  };

  const handleOnClickOpenHistory = (id, forDialog) => {
    // e.stopPropagation();
    if (id) {
      props.getHistory("PA", id).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            !isNullOrUndefined(resp.data)
              ? setHistoryData(resp.data)
              : setHistoryData([]);
          }
          forDialog && setblnOpenHistory(true);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    }
  };

  const addSort = (sortObj) => {
    console.log(sortObj);
    setSortBy(sortObj);
  };

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
          // border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
        }}
      >
        <div className="PaHeader">
          <div className="PaHeadTop">
            <GenericSearch
              FilterTypes={FilterTypes}
              FilterValueTypes={FilterValueTypes}
              addFilter={addFilter}
              cssCls={{}}
            />

            <div>
              <GenericFilterMenu
                SortValueTypes={SortValueTypes}
                addSort={addSort}
              />
              <div className="PaIconCon">
                <Tooltip title={t("personal_application")}>
                  <span>
                    <Fab
                      disabled={!props.myInfo}
                      style={{
                        width: "2.2rem",
                        height: ".1rem",
                        backgroundColor: "rgb(230, 81, 71)",
                      }}
                      onClick={() => props.handleClick()}
                    >
                      <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                    </Fab>
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          <GenericChip Filter={Filter} deleteChip={deleteChip} />
        </div>

        <div style={{ padding: "0 1rem" }}>
          <TableContainer
            component={Paper}
            className="PaTableCon"
            style={{
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
            }}
          >
            <Table
              component="div"
              className={`${classes.table} App-main-table`}
              aria-label="simple table"
            >
              <TableHead
                component="div"
                style={{ backgroundColor: props.theme ? "#585858" : "#e5e5e5" }}
              >
                <TableRow component="div">
                  <div className="PaRow">
                    <div className="paInfo1"></div>
                    <div className="paInfo2">
                      <span>{t("file_name")}</span>
                    </div>
                    <div className="paInfo3">
                      <span>{t("subject")}</span>
                    </div>
                    <div className="paInfo4">
                      <span>{t("created_on")}</span>
                    </div>
                    <div className="paInfo5">
                      <span>{t("status")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                component="div"
                style={{ height: `calc(100vh - 260px )`, overflowY: "auto" }}
              >
                {/* Mapping data coming from backnd */}
                {rowData.map((item, i) => {
                  const sts = item.status;
                  // const bgc =
                  //   sts == "In Progress"
                  //     ? "rgb(208 239 247 / 58%)"
                  //     : sts == "Draft"
                  //     ? "initial"
                  //     : sts == "rejected"
                  //     ? "rgb(246 225 181 / 43%)"
                  //     : "";

                  // Row defination and styling here

                  return (
                    <TableRow
                      hover
                      component="div"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(item);
                      }}
                      key={i}
                      style={{
                        // backgroundColor: bgc,
                        borderBottom: "1px solid #8080805c",
                        position: "relative",
                      }}
                    >
                      <div className="PaRow body">
                        <div className="paInfo1">
                          <span>{item.serialNo}</span>
                        </div>
                        <div className="paInfo2">
                          <span>{item.pfileName}</span>
                        </div>
                        <div className="paInfo3">
                          <span>{item.subject}</span>
                        </div>
                        <div className="paInfo4">
                          <span>{item.createdOn}</span>
                        </div>
                        <div className="paInfo5">
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

                        <div className="paIcons">
                          {item.status !== "Draft" ? (
                            <Tooltip title={t("user_history")}>
                              <button
                                id="draftPA_history_btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOnClickOpenHistory(item.id, true);
                                }}
                              >
                                <AiOutlineHistory />
                              </button>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title={t("edit_subject")}
                              aria-label="Edit Subject"
                            >
                              <button
                                id="draftPA_edit_btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  props.handleUpdateSubject(item);
                                }}
                              >
                                <FiEdit2 />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationComp
            pageSize={pageSize}
            pageSizes={pageSizes}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalCount={totalCount}
            setPageSize={setPageSize}
          />
        </div>
      </Paper>

      <Dialog
        open={openQuickSign}
        fullScreen
        aria-labelledby="quickSignDialog"
        TransitionComponent={Transition}
        className={classes.divZIndex}
        id="draggable-dialog-title"
      >
        <DialogContent
          dividers
          style={{
            overflow: "hidden",
            backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
          }}
        >
          {loading && <Loading />}

          {openPaDialog ? (
            <Tabs
              forceRenderTabPanel
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList
                style={{
                  position: "relative",
                  zIndex: 12,
                }}
              >
                <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                  {t("personal_application").toUpperCase()}
                </Tab>
                <IconButton
                  id="draftPA_close_PA"
                  aria-label="close"
                  onClick={() => {
                    handleClickQuickSignClose(false);
                  }}
                  style={{
                    borderRadius: "10px",
                    float: "right",
                    height: "35px",
                    width: "35px",
                    color: "blue",
                    borderColor: "blue",
                    borderWidth: "1px",
                    borderStyle: "revert",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </TabList>

              <TabPanel>
                <div hidden={!blnOpenEditor} style={{height: "100%"}} >
                  <Annexure
                    fileId={rowID}
                    showUploader={false}
                    // sampleData={sampleData}
                  />
                </div>
              </TabPanel>
            </Tabs>
          ) : (
            <Tabs
              forceRenderTabPanel
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList
                style={{
                  position: "relative",
                  zIndex: 12,
                }}
              >
                <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                  {t("personal_application").toUpperCase()}
                </Tab>
                <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                  {t("annexure")}
                </Tab>
                <p className={classes.headerText}>
                  <b>{t("subject")} : &nbsp;</b>
                  {headerLable.subject &&
                    headerLable.subject?.toUpperCase().slice(0, 25)}
                  <b>&nbsp;| {t("inbox_referenceNumber")}&nbsp;</b>
                  {headerLable.pfileName?.toUpperCase()}
                </p>
                <IconButton
                  id="draftPA_sign_close"
                  aria-label="close"
                  onClick={() => {
                    handleClickQuickSignClose(true);
                  }}
                  style={{
                    borderRadius: "40%",
                    float: "right",
                    height: "35px",
                    width: "35px",
                    backgroundColor: "rgb(81 115 184)",
                    color: "#fff",
                    borderWidth: "1px",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </TabList>
              <TabPanel>
                <>
                  {blnOpenQuickSign && (
                    <>
                      <Tooltip title={t("send")}>
                        <Fab
                          aria-label="close"
                          color="secondary"
                          className={`button-glow ${classes.sign_btn}`}
                          onClick={(e) => setSend(true)}
                          style={{ padding: "1px" }}
                        >
                          <SendIcon />
                        </Fab>
                      </Tooltip>
                      <Tooltip title={t("undo")} className="dialog_sendButton">
                        <Fab
                          aria-label="close"
                          color="primary"
                          className={classes.sign_btn1}
                          onClick={handleDocumentRollback}
                          style={{ padding: "1px" }}
                        >
                          <RestorePageIcon />
                        </Fab>
                      </Tooltip>
                    </>
                  )}
                  <div
                    style={{
                      display: showSWpdf() ? "initial" : "none",
                      height: "calc(100vh - 200px)",
                      overflow: "hidden",
                    }}
                  >
                    <SplitViewPdfViewer
                      fileUrl={blnOpenQuickSign ? fileURL : ""}
                      pdfLoads={(val) => {
                        setPdfLoads(val);
                      }}
                    />
                  </div>
                </>

                <>
                  {!blnOpenQuickSign && (
                    <Tooltip title={reSave ? t("autosave") : t("sign")}>
                      <span className={`${classes.sign_btn}`}>
                        <Fab
                          aria-label="close"
                          color="primary"
                          className={`button-glow`}
                          onClick={(e) => setOpenSign(true)}
                          disabled={reSave}
                        >
                          <CreateIcon />
                        </Fab>
                      </span>
                    </Tooltip>
                  )}
                  <div
                    className="customDiv"
                    style={{
                      display: !blnOpenQuickSign ? "initial" : "none",
                    }}
                  >
                    <HeadersAndFootersView
                      fileId={!blnOpenQuickSign ? rowID : ""}
                      blnIsPartCase={false}
                      fileUrl1={!blnOpenQuickSign ? fileURL : ""}
                      isAnnexure={false}
                      blnShowQuickSign={true}
                      reSave={reSave}
                      setreSave={(val) => {
                        setreSave(val);
                      }}
                      containerId={"container1"}
                    />
                  </div>
                </>
              </TabPanel>
              <TabPanel >
                <>
                  {blnOpenQuickSign && (
                    <Tooltip title={t("send")}>
                      <Fab
                        id="DraftPaTable_send_btton"
                        aria-label="close"
                        color="secondary"
                        className={`button-glow ${classes.sign_btn}`}
                        onClick={(e) => setSend(true)}
                      >
                        <SendIcon style={{ fontSize: "1rem" }} />
                      </Fab>
                    </Tooltip>
                  )}
                  <Annexure
                    fileId={rowID}
                    sendToogle={(e) => {
                      setTabIndex(3);
                    }}
                    showUploader={true}
                  />
                </>
              </TabPanel>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSign}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md"
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
          >
            {t("sign")}
            <IconButton
              id="close_draftPA_table"
              aria-label="close"
              onClick={() => setOpenSign(false)}
              color="primary"
              style={{ float: "right", position: "relative", top: "-9px" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <InputForm
            fileId={rowID}
            toggleViewer={(e, url) => {
              unstable_batchedUpdates(() => {
                setOpenSign(e);
                setblnOpenQuickSign(!e);
                setFileURL(url);
              });
            }}
            returnToEditor={(e) => {
              setblnOpenEditor(true);
            }}
            updatePa={(obj) => {
              setupdatedPa(obj);
            }}
            pfileName={headerLable.pfileName}
          />
        </Paper>
      </Dialog>
      <Dialog
        open={send}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <Paper className="dialog_sendButton">
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
            className="send_dialog"
          >
            {t("forward_file_for_review_approval")}
            <div>
              <IconButton
                id="file_for_review_closeBtn"
                aria-label="close"
                onClick={() => setSend(false)}
                color="primary"
                style={{ float: "right" }}
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                id="draftPA_historyBtn"
                aria-label="userHistory"
                color="primary"
                style={{ float: "right" }}
                onClick={(e) => {
                  handleOnClickOpenHistory(handleClickId, true);
                }}
              >
                <Tooltip
                  title={t("show_user_history")}
                  aria-label="Show User History"
                >
                  <HistoryIcon color="primary" />
                </Tooltip>
              </IconButton>
            </div>
          </DialogTitle>
          <SendFileForm
            fileId={rowID}
            handleCloseEvent={(e) => {
              setOpen(false);
              setOpenQuickSign(false);
            }}
            setSend={setSend}
            pfileName={headerLable.pfileName}
            handleStatus={handleStatus}
          />
        </Paper>
      </Dialog>

      <Dialog
        open={blnOpenHistory}
        onClose={(e) => setblnOpenHistory(false)}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
        fullWidth
        maxWidth="sm"
        className="personal-application-history"
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
          {t("user_history")}
        </DialogTitle>
        <HistoryDialog historyData={historyData} />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    openDraftPa: state.openDraftPa,
    myInfo: state.myInfo,
    theme: state.theme,
    subjectReducer: state.subjectReducer,
  };
}

export default reduxConnect(mapStateToProps, {
  loadPADraftTableData,
  loadSfdt,
  changeTableStateDraft,
  rollbackPADocument,
  getHistory,
})(DraftPaFileTable);
