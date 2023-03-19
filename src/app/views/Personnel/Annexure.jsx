import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import {
  Card,
  CardContent,
  Fab,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import "react-tabs/style/react-tabs.css";
import "./therme-source/material-ui/annextureTable.css";
import DeleteIcon from "@material-ui/icons/Delete";
import AnnexureUploader from "./AnnexureUploader";
import {
  loadAnnexureTableData,
  getPAWithAnnexureList,
  deleteAnnexureData,
  rollbackAnnexureDocument,
  updateAnnexureData,
} from "../../camunda_redux/redux/action";
import { changingTableStateAnnexure } from "../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import UndoIcon from "@material-ui/icons/Undo";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@material-ui/lab";
import SignForm from "./SignForm";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import SendIcon from "@material-ui/icons/Send";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import PaginationComp from "../utilities/PaginationComp";
import HeadersAndFootersView from "../FileApproval/documentEditor/editor";
import { useFormik } from "formik";
import * as Yup from "yup";
import { unstable_batchedUpdates } from "react-dom";
import { Loading } from "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";

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
  input: {
    display: "none",
  },
  divZIndex: {
    zIndex: "1500 !important",
  },
  paperCss: {
    position: "relative",
    height: "100%",
  },
  sign_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "30px !important",
    zIndex: 1,
  },
  sign_btn1: {
    position: "fixed",
    right: "30px !important",
    bottom: "100px !important",
    zIndex: 10,
  },
}));

// functional Component begins
const Annexure = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const [paID, setpaID] = useState("");
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deletedRow, setDeletedRow] = useState();
  const [pdfLoads, setPdfLoads] = useState(false);
  const [openSign, setOpenSign] = useState(false);
  const [pdfDataStore, setpdfDataStore] = useState({});
  const [blnOpenEditor, setBlnOpenEditor] = useState(false);
  const [annexureId, setAnnexureId] = useState("");
  const [iconBtn, setIconBtn] = useState(false);
  const [type, setType] = useState(false);
  const [editorUrl, setEditorUrl] = useState("");
  const [editorId, setEditorId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [extension, setExtension] = useState("docx");
  const [annotationId, setAnnotationId] = useState("");
  const [updatedRow, setupdatedRow] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [reSave, setreSave] = useState(false);
  const [loading, setloading] = useState(false);

  let username = localStorage.getItem("username");
  let role = sessionStorage.getItem("role");
  let department = sessionStorage.getItem("department");

  const INITIAL_STATE = {
    fileName: "",
  };

  const VALIDATION_UPDATE_SCHEMA = Yup.object().shape({
    fileName: Yup.string(t("enter_a_new_fileName"))
      .trim()
      .max(250, t("fileName_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_UPDATE_SCHEMA,
    onSubmit: (values) => handleUpdateAnnexure(values.fileName),
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };

  const handleClick = (rowData, index) => {
    let arr;
    if (rowData.fileName) {
      arr = rowData.fileName.split(".");
    } else {
      arr = rowData.pfileName.split(".");
    }
    setExtension(arr[arr.length - 1]);
    setAnnexureId(rowData.id);
    setIconBtn(rowData.signed);
    setpdfDataStore(rowData);
    setAnnotationId(rowData.annotationId);
    index && setSelectedIndex(index);
    // setEditorUrl(rowData.fileURL);
    // setEditorId(rowData.id);
  };

  let { blnValue } = props.subscribeApi; // apitrigger that is used to update table by using redux

  const loadAnnextureTableData = (fileId) => {
    setloading(true);
    props
      .loadAnnexureTableData(username, role, department, fileId)
      .then((resp) => {
        // API call with redux to fetch table data based on Personal Inventory ID
        // let tmpArr = [];
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setloading(false);
          }
          if (resp.data !== undefined) {
            // condition to check if response has data then process further
            loadData(resp.data);
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
            setloading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setloading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setloading(false);
      });
  };

  const loadPaAnnextureTableData = (fileId) => {
    setloading(true);
    props
      .getPAWithAnnexureList(fileId)
      .then((resp) => {
        // API call with redux to fetch table data based on Personal Inventory ID
        let tmpArr = [];
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setloading(false);
          }
          if (resp !== undefined) {
            // condition to check if response has data then process further
            const { pfileName, createdOn, annotationId, fileURL } =
              resp.personalApplication;
            tmpArr.push({
              id: fileId,
              pfileName,
              createdOn,
              annotationId,
              fileUrl: fileURL,
              serialNo: 1,
              openInEditor: false,
            });
            resp.annexures.map((item, index) => {
              return tmpArr.push({
                id: item.personalApplicationId,
                pfileName: item.fileName,
                createdOn: item.uploadingDate,
                annotationId: item.annotationId,
                fileUrl: item.annexureFileURL,
                serialNo: index + 2,
                openInEditor: false,
              });
            });
            unstable_batchedUpdates(() => {
              setRowData(tmpArr);
              setTotalCount(tmpArr.length);
              setpdfDataStore(tmpArr[0]);
              setAnnotationId(tmpArr[0].annotationId);
              setloading(false);
            });
            props.changingTableStateAnnexure(false, "CHANGE_PA_ANNEXURE"); // redux call to change trigger to false as table got updated
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
            setloading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setloading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setloading(false);
      });
  };

  const loadData = (row) => {
    let tmpArr =
      row &&
      row.reverse().map((item, index) => {
        return {
          ...item,
          serialNo: index + 1,
          pfileName: item.subject,
          openInEditor: item.fileName.endsWith(".docx") && !item.signed,
        };
      });
    if (tmpArr.length !== 0) {
      let arr = tmpArr[0].fileName.split(".");
      unstable_batchedUpdates(() => {
        setRowData(tmpArr);
        setTotalCount(tmpArr.length);
        setExtension(arr[arr.length - 1]);
        setSelectedIndex(tmpArr[0].serialNo);
        setAnnotationId(tmpArr[0].annotationId);
        setpdfDataStore(tmpArr[0]);
        setAnnexureId(row[0].id);
        setIconBtn(tmpArr[0].signed);
      });
      props.changingTableStateAnnexure(false, "CHANGE_PA_ANNEXURE"); // redux call to change trigger to false as table got updated
    }
    setloading(false);
  };

  useEffect(() => {
    const { fileId } = props; // Personal Inventory ID that is passed by parent component to peocess API

    setpaID(fileId);
    props.showUploader
      ? loadAnnextureTableData(fileId, false) // in this case i will display subject or can update or edit it
      : loadPaAnnextureTableData(fileId); // in this case i will display pfileName but can not update or edit
  }, [blnValue, props.fileId]);

  const callMessageOut = (message) => {
    // dispatch(setSnackbar(true, "error", message));
    if (props.field === undefined) {
      return dispatch(setSnackbar(true, "error", message));
    }
  };

  const callMessageSuccess = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const send = () => {
    const { sendToogle } = props;
    sendToogle(true);
  };

  const disAgreeFun = () => {
    handleClose();
  };

  const agreeFun = () => {
    handleClose();
    const row = deletedRow;
    const rowID = row.id;
    let tempArr = [];
    setloading(true);
    props
      .deleteAnnexureData(rowID)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setloading(false);
          } else {
            tempArr = rowData.filter((item, i) => item.id !== resp.id);
            console.log({ tempArr, rowData, resp });
            if (tempArr.length === 0) {
              setRowData(tempArr);
              setTotalCount(tempArr.length);
              setloading(false);
            } else {
              loadData(tempArr);
            }
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("annexure_has_been_deleted_successfully")} !`
              )
            );
          }
        } catch (e) {
          callMessageOut(resp.error);
          setloading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        setloading(false);
      });
  };

  useEffect(() => {
    if (pdfDataStore && pdfDataStore.fileName) {
      setType(pdfDataStore.fileName.endsWith(".docx"));
    }
    if (pdfDataStore && pdfDataStore.id) {
      setEditorId(pdfDataStore.id);
    }
    if (pdfDataStore !== undefined) {
      let newUrl = "";

      // if flow inside this it means user had already before signed the document and have now perform the undo to need to again save the document in document editor
      if (!pdfDataStore.signed && pdfDataStore.versionId) {
        newUrl = `${pdfDataStore.fileUrl}?versionId=${pdfDataStore.versionId}`;
        setEditorUrl(newUrl);
      } else {
        newUrl = pdfDataStore.fileUrl;
        setEditorUrl(newUrl);
      }
    }
    pdfDataStore && setBlnOpenEditor(pdfDataStore.openInEditor);
  }, [pdfDataStore]);

  const deleteDoc = (row) => {
    // mtd to perform delete operation
    handleClickOpen();
  };

  const handleAnnexture = (data, shoudReSave) => {
    let tempArr = rowData.map((item) =>
      item.id === data.id
        ? {
            ...item,
            signed: data.signed,
            versionId: data.versionId,
            pfileName: data.subject,
            openInEditor: data.fileName.endsWith(".docx") && !data.signed,
          }
        : item
    );
    unstable_batchedUpdates(() => {
      setpdfDataStore({
        ...pdfDataStore,
        signed: data.signed,
        versionId: data.versionId,
        openInEditor: data.fileName.endsWith(".docx") && !data.signed,
      });
      shoudReSave && setreSave(true);
      setIconBtn(data.signed);
      setRowData(tempArr);
    });
  };

  const handleDocumentRollback = async () => {
    setloading(true);
    try {
      const res = await props.rollbackAnnexureDocument(pdfDataStore.id, true);
      if (res) {
        handleAnnexture(res, true);
        setloading(false);
        callMessageSuccess(`${t("SIGNATURE HAS BEEN REMOVED")} !`);
      }
    } catch (err) {
      callMessageOut(err.message);
      setloading(false);
    }
  };

  const handleUploadAnnexture = (data) => {
    let tempArr = [];
    data.map((item, i) =>
      tempArr.push({
        ...item,
        serialNo: i + 1,
        pfileName: item.subject,
        openInEditor: item.fileName.endsWith(".docx") && !item.signed,
      })
    );
    rowData.map((item, i) =>
      tempArr.push({
        ...item,
        serialNo: data.length + 1 + i,
      })
    );
    setRowData(tempArr);
    setTotalCount(tempArr.length);
    handleClick(tempArr[0], tempArr[0].serialNo);
  };

  const updateDoc = () => {
    setOpenEdit(true);
  };

  const handleUpdateAnnexure = (values) => {
    handleClose();
    const row = updatedRow;
    const rowID = row.id;
    setloading(true);
    props
      .updateAnnexureData(rowID, values)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            setloading(false);
          } else {
            const newRowData = rowData.map((annex) => {
              if (annex.id === rowID) {
                return {
                  ...annex,
                  subject: res.newName,
                };
              } else {
                return annex;
              }
            });
            setloading(false);
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("annexure has been updated successfully")} !`
              )
            );
            setRowData(newRowData);
          }
        } catch (e) {
          callMessageOut(res.error);
          setloading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        setloading(false);
      });
  };

  const CustomToolbarMarkup = () => (
    <div
      style={{
        padding: "0.5rem 1rem",
      }}
    >
      <Typography
        variant="h6"
        style={{
          fontFamily: "inherit !important",
        }}
      >
        {props.showUploader ? t("annexure") : t("my_personal_applications")}
      </Typography>
    </div>
  );

  return (
    <>
      {loading && <Loading />}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: props.theme ? "" : "black" }}
          >
            {t("do_you_want_delete_ANNEXURE") +
              ` ${deletedRow && deletedRow.fileName.split(".")[0]}`}
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="cancelButton"
            id="annexure_cancel_btn"
            variant="outlined"
            onClick={disAgreeFun}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            className="okButton"
            id="annexure_ok_btn"
            variant="outlined"
            onClick={agreeFun}
            color="primary"
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ height: "100%", padding: "0 1rem" }}>
        <Grid className={classes.paperCss}>
          {type &&
            (iconBtn ? (
              <Tooltip title={t("undo")}>
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
            ) : (
              <Tooltip title={t("sign")}>
                <Fab
                  id="Annexure_editIcon_button"
                  aria-label="close"
                  color="primary"
                  className={`button-glow ${classes.sign_btn1}`}
                  onClick={() => setOpenSign(true)}
                >
                  <EditIcon style={{ fontSize: "1rem" }} />
                </Fab>
              </Tooltip>
            ))}
          {props.blnOpenQuickSign && (
            <Tooltip title={t("send")}>
              <Fab
                id="Annexure_sendIcon_button"
                aria-label="close"
                color="secondary"
                className={`button-glow ${classes.sign_btn}`}
                onClick={() => props.setSend(true)}
              >
                <SendIcon style={{ fontSize: "1rem" }} />
              </Fab>
            </Tooltip>
          )}
          <Grid container spacing={1} style={{ height: "100%" }}>
            <SplitterComponent style={{ height: "100%" }}>
              <div style={{ width: "60%", overflow: "hidden" }}>
                {rowData.length !== 0 ? (
                  <div
                    style={{ border: "1px solid #b6b6b66b", height: "100%" }}
                  >
                    <div
                      className="customDiv"
                      style={{
                        display: blnOpenEditor ? "initial" : "none",
                      }}
                    >
                      <HeadersAndFootersView
                        fileId={blnOpenEditor ? editorId : ""}
                        fileUrl1={blnOpenEditor ? editorUrl : ""}
                        blnIsPartCase={false}
                        isAnnexure={true}
                        reSave={reSave}
                        setreSave={(val) => {
                          setreSave(val);
                        }}
                        containerId={"container2"}
                      />
                    </div>
                    <div
                      style={{
                        display: !blnOpenEditor ? "initial" : "none",
                        height: "clac(100vh - 120px)",
                      }}
                    >
                      <SplitViewPdfViewer
                        fileUrl={!blnOpenEditor ? editorUrl : ""}
                        extension={extension}
                        pdfLoads={(val) => {
                          setPdfLoads(val);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "90vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h1> {t("no_annexure")}</h1>
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "40%",
                  overflow: "hidden",
                }}
              >
                <Paper
                  style={{
                    border: "1px solid #b6b6b66b",
                    borderRadius: "9px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CustomToolbarMarkup />
                    {rowData ? (
                      <>
                        <div style={{ padding: "0 1rem" }}>
                          <TableContainer
                            component={Paper}
                            className="AnnexureTableCon"
                            style={{
                              border: "1px solid #8080805c",
                            }}
                          >
                            <Table
                              component="div"
                              className={classes.table}
                              aria-label="simple table"
                            >
                              <TableHead component="div">
                                <TableRow
                                  component="div"
                                  style={{
                                    position: "relative",
                                  }}
                                >
                                  <div
                                    className={`${
                                      props.showUploader
                                        ? "AnnexureRow"
                                        : "annexure_pa_row"
                                    } head`}
                                  >
                                    <div className="AnnexureInfo1">
                                      <span></span>
                                    </div>
                                    <div className="AnnexureInfo3">
                                      <span>{t("subject")}</span>
                                    </div>
                                    <div className="AnnexureInfo3">
                                      <span>{t("created_on")}</span>
                                    </div>
                                    <div className="annexure_icon"></div>
                                  </div>
                                </TableRow>
                              </TableHead>
                              <div
                                style={{
                                  height: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                <TableBody
                                  component="div"
                                  style={{
                                    display: "grid",
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
                                          handleClick(item, item.serialNo);
                                        }}
                                        key={i}
                                        style={{
                                          borderBottom: "1px solid #8080805c",
                                          position: "relative",
                                        }}
                                        className={`${
                                          item.serialNo == selectedIndex
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        <div
                                          className={`${
                                            props.showUploader
                                              ? "AnnexureRow"
                                              : "annexure_pa_row"
                                          } body`}
                                        >
                                          <div className="AnnexureInfo1">
                                            <span>{item.serialNo}</span>
                                          </div>
                                          <div className="AnnexureInfo3">
                                            <span>
                                              {item.subject?.length > 28 ? (
                                                <Tooltip
                                                  title={
                                                    item.subject.split(".")[0]
                                                  }
                                                >
                                                  <span>
                                                    {item.subject.substring(
                                                      0,
                                                      28
                                                    )}
                                                    ...
                                                  </span>
                                                </Tooltip>
                                              ) : item.subject ? (
                                                <span>
                                                  {item.subject.split(".")[0]}
                                                </span>
                                              ) : item.pfileName ? (
                                                <Tooltip
                                                  title={
                                                    item.pfileName.split(".")[0]
                                                  }
                                                >
                                                  <span>
                                                    {item.pfileName.substring(
                                                      0,
                                                      28
                                                    )}
                                                    ...
                                                  </span>
                                                </Tooltip>
                                              ) : item.pfileName ? (
                                                <span>{item.pfileName}</span>
                                              ) : (
                                                <span>Name Not Defined</span>
                                              )}
                                            </span>
                                          </div>
                                          <div className="AnnexureInfo3">
                                            <span>{item.createdOn}</span>
                                          </div>
                                          {props.showUploader && (
                                            <div className="annexure_icon">
                                              <div className="AnnexureIcons">
                                                <Tooltip title={t("update")}>
                                                  <IconButton
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      let arr =
                                                        item.subject.split(".");
                                                      formik.setFieldValue(
                                                        "fileName",
                                                        arr[0]
                                                      );
                                                      setupdatedRow(item);
                                                      updateDoc(item);
                                                    }}
                                                  >
                                                    <EditIcon />
                                                  </IconButton>
                                                </Tooltip>
                                                <Tooltip title={t("delete")}>
                                                  <IconButton
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setDeletedRow(item);
                                                      deleteDoc(item);
                                                    }}
                                                  >
                                                    <DeleteIcon />
                                                  </IconButton>
                                                </Tooltip>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </div>
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
                      </>
                    ) : (
                      <div
                        style={{
                          height: "90vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <h1> {t("no_annexure")}</h1>
                      </div>
                    )}
                  </div>
                </Paper>
                <div>
                  {props.showUploader && (
                    <Paper>
                      <AnnexureUploader
                        personalAppID={paID}
                        sendClick={send}
                        handleUploadAnnexture={handleUploadAnnexture}
                      />
                    </Paper>
                  )}
                  {props.sampleData && (
                    <Card
                      className="user_history_card"
                      style={{
                        border: "1px solid rgba(182, 182, 182, 0.42)",
                        marginTop: "1rem",
                        borderRadius: "9px",
                      }}
                    >
                      <div style={{ margin: "auto", textAlign: "center" }}>
                        <Typography
                          variant="button"
                          align="center"
                          color="primary"
                        >
                          {t("history")}
                        </Typography>
                      </div>
                      <CardContent
                        style={{ maxHeight: "40vh", overflowY: "auto" }}
                      >
                        <Timeline>
                          {props.sampleData.map((item) => (
                            <TimelineItem
                              key={item.id}
                              style={{ fontSize: ".5rem" }}
                            >
                              <TimelineSeparator>
                                <TimelineDot
                                  color={item.color || "grey"}
                                  variant={item.variant || "outlined"}
                                >
                                  <item.icon />
                                </TimelineDot>
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent>
                                <Paper
                                  elevation={3}
                                  className={classes.paper}
                                  style={{
                                    backgroundColor: item.background,
                                    display: "flex",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {item.title}
                                    {item.title ===
                                    "Created Personal Application"
                                      ? ""
                                      : ":"}
                                    &nbsp;
                                  </Typography>
                                  <Typography>{item.description}</Typography>
                                </Paper>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {item.typo}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </SplitterComponent>
          </Grid>
        </Grid>
        <Dialog
          open={openSign}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          maxWidth="md"
        >
          <Paper>
            <DialogTitle
              id="draggable-dialog-title"
              className="send_dialog"
              style={{ padding: "0px 24px !important", cursor: "move" }}
            >
              {t("sign")}
              <IconButton
                id="annexure_sign_close"
                aria-label="close"
                onClick={() => setOpenSign(false)}
                color="primary"
                style={{ float: "right" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <SignForm
              annexureId={annexureId}
              fileURL={editorUrl}
              fileId={editorId}
              loadAnnextureTableData={loadAnnextureTableData}
              setOpenSign={setOpenSign}
              paID={paID}
              handleAnnexture={handleAnnexture}
            />
          </Paper>
        </Dialog>
        <Dialog
          open={openEdit}
          onClose={handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            className="send_dialog"
          >
            {t("update_filename")}
            <Tooltip title={t("cancel")}>
              <IconButton
                id="annexure_updateFile_close_btn"
                aria-label="close"
                onClick={() => {
                  setOpenEdit(false);
                }}
                color="primary"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>

          <div classes={classes.root}>
            <form onSubmit={formik.handleSubmit}>
              <DialogContent dividers>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  multiline
                  minRows={3}
                  name="fileName"
                  label={t("New Filename")}
                  value={formik.values.fileName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.fileName && Boolean(formik.errors.fileName)
                  }
                  helperText={formik.touched.fileName && formik.errors.fileName}
                  autoFocus
                />
              </DialogContent>
              <DialogActions>
                <Grid className={classes.btnGrid}>
                  <Button
                    id="annexure_file_reset_btn"
                    className="resetButton"
                    color="primary"
                    variant="outlined"
                    style={{ marginLeft: "1rem" }}
                    onClick={formik.handleReset}
                    endIcon={<UndoIcon />}
                  >
                    {t("reset")}
                  </Button>
                  <Button
                    id="annexure_file_update_btn"
                    className="updateButton"
                    color="primary"
                    variant="outlined"
                    type="submit"
                    style={{ marginLeft: "1rem" }}
                    endIcon={<DoneIcon />}
                  >
                    {t("update").toUpperCase()}
                  </Button>
                </Grid>
              </DialogActions>
            </form>
          </div>
        </Dialog>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  loadAnnexureTableData,
  getPAWithAnnexureList,
  changingTableStateAnnexure,
  deleteAnnexureData,
  rollbackAnnexureDocument,
  updateAnnexureData,
})(Annexure);
