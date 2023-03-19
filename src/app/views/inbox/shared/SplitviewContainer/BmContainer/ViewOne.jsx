import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Tooltip,
  Paper,
  TextField,
  Fab,
  InputAdornment,
  DialogActions,
  FormControlLabel,
  DialogContentText,
  RadioGroup,
  Radio,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Accordion,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  AccordionActions,
  Checkbox,
} from "@material-ui/core";
import HeadersAndFootersView from "../../../../FileApproval/documentEditor/editor";
import PdfViewer from "app/pdfViewer/pdfViewer";
import {
  getPANotingData,
  getPAEnclosureData,
  loadPartCaseData,
  loadInboxDataSplitView,
  savePartCaseTag,
  fetchSplitViewTags,
  createPartCaseNotingFile,
  createCoverLetter,
  rollbackSplitViewDocument,
  rollbackSplitViewEnclosureDocument,
  deleteEnclosure,
  editFlagNumber,
  validateFlagNumber,
  loadRtiPartCaseData,
  rollbackRtiSplitViewDocument,
  rollbackRtiSplitViewEnclosureDocument,
  saveRtiFile,
  loadRtiDataSplitView,
  returnRti,
  sendbackRti,
  getdownloadZip,
  deleteEnclosureRti,
  fetchSplitViewTagsRti,
  savePartCaseTagRti,
  editRtiFlagNumber,
  getcabinetpartcase,
  openFile,
} from "../../../../../camunda_redux/redux/action";
import { Loading } from "../../../therme-source/material-ui/loading";
import { setInboxDatas } from "../../../../../redux/actions/InboxActions";
import history from "../../../../../../history";
import { setPassData } from "../../../../../camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import CloseIcon from "@material-ui/icons/Close";
import InputForm from "../../quickSignFrom";
import "../../../therme-source/material-ui/loading.css";
import SplitViewPdfViewer from "../../pdfViewer/pdfViewer";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import Cookies from "js-cookie";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import FileUploader from "../../FileUpload";
import RtiUploader from "app/views/RTI/sharedComponents/RtiUploader";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import AddIcon from "@material-ui/icons/Add";
import HrmDialog from "../../HrmDialog";
import RtiHrmDialog from "../../RtiHrmDialog";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CoverLetterDialog from "../../CoverLetterDialog";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import {
  Announcement,
  ArrowBack,
  Business,
  Close,
  Create,
  Delete,
  Description,
  Edit,
  Event,
  ExpandMore,
  Forward,
  History,
  ImportContacts,
  Note,
  Person,
  PriorityHigh,
  Replay,
  Subject,
} from "@material-ui/icons";
import {
  Autocomplete,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { unstable_batchedUpdates } from "react-dom";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CgNotes } from "react-icons/cg";
import Axios from "axios";
import { saveAs } from "file-saver";
import CloseFile from "../../CloseFile";
import Remarks from "../../Remarks";
import YlowNotes from "../../YlowNotes";
import { FaRegCalendarTimes, FaSearchPlus } from "react-icons/fa";
import { useContext } from "react";
import { BmContext } from "./Worker";
import { SplitViewContext } from "../Worker";
import { AiOutlineFileText, AiOutlineFileUnknown } from "react-icons/ai";
import { MdOutlineNoteAlt } from "react-icons/md";
import { HiDownload } from "react-icons/hi";
import Add from "@material-ui/icons/Add";

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
  mainDiv: {
    textAlign: "center",
  },
  formControl: {
    marginTop: 10,
    width: 300,
    // minWidth: 150,
    // maxWidth: 250,
  },
  button: {
    marginTop: 12,
    marginLeft: 4,
    minWidth: "16px",
    padding: "10px 12px",
    // backgroundColor: "#808080"
  },
  uploadButton: {
    marginTop: 12,
    marginLeft: 4,
    // backgroundColor: "#808080"
  },
  sign_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  remark_btn: {
    position: "fixed",
    left: "5% !important",
    bottom: "17% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  yellowNote_btn: {
    position: "fixed",
    left: "5% !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  back_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "40px !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  response_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "110px !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(6),
  },
  sDialIcon: {
    position: "relative",
  },
  cabinetOpen_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "40px !important",
    zIndex: 5,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
}));

const ViewOne = (props) => {
  const { t } = useTranslation();
  let partCase = Cookies.get("partCase");
  let isRti = Cookies.get("isRti");
  const FileID = Cookies.get("partcaseId");
  let creater = Cookies.get("creater");
  let isRegister = Cookies.get("isRegister");
  let Rtioutbox = Cookies.get("Rtioutbox");
  let forwardRti = Cookies.get("isForward");
  let cabinetIcon = Cookies.get("cabinetStatus");
  let isCabinet = Cookies.get("isCabinet");
  let cabinetpartcase = Cookies.get("cabinetpartcase");
  let referenceNumber = Cookies.get("referenceNumber");
  const subject = Cookies.get("inboxFile");
  const priority = Cookies.get("priority");
  const type = Cookies.get("type");
  const department = sessionStorage.getItem("department");
  const rolename = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");

  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    NOF,
    setNOF,
    NOF1,
    setNOF1,
    sfdtData,
    setSfdtData,
    prevEnclouser,
    setPrevEnclouser,
    blnVisible,
    setBlnVisible,
    rowID,
    setRowID,
    enclosureData,
    setEnclosureData,
    enclosureArr,
    setEnclosureArr,
    open,
    setOpen,
    URL,
    setURL,
    pdfLoads,
    setpdfLoads,
    enclosurePdfLoads,
    setEnclosurePdfLoads,
    blnHideSyncfusion,
    setBlnHideSyncfusion,
    openInPdf,
    setOpenInPdf,
    blnDisable,
    setBlnDisable,
    fileChange,
    setFileChange,
    notingURL,
    setNotingURL,
    flag,
    setFlag,
    partCaseId,
    setPartCaseId,
    flagNumber,
    setFlagNumber,
    prevFlagNumberNF,
    setPrevFlagNumberNF,
    prevFlagNumberEnclouser,
    setPrevFlagNumberEnclouser,
    hrmRole,
    setHrmRole,
    coverLetter,
    setCoverLetter,
    coverLetterDialog,
    setCoverLetterDialog,
    extension,
    setExtension,
    hasCoverNote,
    setHasCoverNote,
    enclosureSigned,
    setEnclosureSigned,
    notingSigned,
    setNotingSigned,
    blnDisableForward,
    setBlnDisableForward,
    notingData,
    setNotingData,
    send,
    setSend,
    serviceLetterId,
    setServiceLetterId,
    departmentList,
    setDepartmentList,
    fileInfo,
    status,
    setStatus,
    notingStatus,
    setNotingStatustatus,
    page,
    setPage,
    pageNumber,
    setPageNumber,
    isPdf,
    setIsPdf,
    openDialog,
    setOpenDialog,
    touched,
    setTouched,
    value,
    setValue,
    FlagNoArr,
    setFlagNoArr,
    isValid,
    setisValid,
    enclosureAnnoiD,
    setEnclosureAnnoiD,
    enclosurelen,
    setEnclosureLen,
    isrtiforward,
    setIsRtiForward,
    openConfirmation,
    setOpenConfirmation,
    nofAnnoId,
    setNofAnnoId,
    reSaveNof,
    setreSaveNof,
    reSaveEnco,
    setreSaveEnco,
    rtifilename,
    setRtifilename,
    addNote,
    setaddNote,
    openRemarks,
    setopenRemarks,
    openYellowNotes,
    setopenYellowNotes,
    count1,
    count2,
    setcount,
    closeFile,
    setcloseFile,
    canClose,
    setcanClose,
    openSpeedDial,
    setOpenSpeedDial,
    pdfViewerButtons,
    setPdfViewerButtons,
    loadSplitViewData,
    loadRtiData,
  } = useContext(BmContext);

  const { loading, setLoading } = useContext(SplitViewContext);

  const handleChangePage = (val) => {
    setPage(val);
  };

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  const handleChange = (event) => {
    setNOF(event.target.value);
    const data = JSON.parse(event.target.value);
    console.log(data);
    let url = data.fileUrl;
    const flagNumber = data.flagNumber;
    const hideViewer = data.signed;
    setNofAnnoId(data.annotationId);
    setNotingSigned(hideViewer);
    setBlnHideSyncfusion(hideViewer);
    setOpenInPdf(data.isEditable);
    setBlnDisable(data.blnDisable);
    setFlag("Noting");
    // setFlagNumber(flagNumber);
    // setSfdtData(url);
    if (!data.signed && data.prevVersionId) {
      setNotingURL(`${url}?versionId=${data.prevVersionId}`);
    } else {
      setNotingURL(url);
    }
    setPrevFlagNumberNF(flagNumber);
  };

  const handleClearInput = () => {
    setNOF1("");
    setNotingStatustatus("");
    setCoverLetter("");
    setFileChange(true);
    setFlag("");
    setPrevEnclouser("");
    setPrevFlagNumberEnclouser(0);
    setValue("");
    setExtension("docx");
    setIsPdf(false);
    setURL(`${process.env.PUBLIC_URL + "/assets/sample.pdf"}`);
    setEnclosureSigned(false);
    setRtifilename("");
  };

  const handleChange1 = (value, page, sfdtText, isCusLink) => {
    isCusLink ? setPageNumber(page) : setPageNumber(1);
    isCusLink
      ? setEnclosureAnnoiD(sfdtId)
      : setEnclosureAnnoiD(value.annotationId);

    if (value !== null) {
      setNOF1(value);
      const data = value;
      const url = data.fileUrl;
      const flagNumber = data.flagNumber;
      setNotingStatustatus(data.status);
      setCoverLetter(data.coverNote);
      setFileChange(true);
      setFlag("Enclouser");
      setPrevEnclouser(url);
      setPrevFlagNumberEnclouser(flagNumber);
      setValue(flagNumber);
      let arr = data.fileName.split(".");
      arr.length !== 1
        ? setExtension(arr[arr.length - 1])
        : setExtension("docx");
      setIsPdf(data.fileName.includes(".pdf"));
      setURL(url);
      setEnclosureSigned(data.signed);
      setRtifilename(data.fileName);
    }
  };

  const handleChangePreviousEnclosure = () => {
    setPageNumber(1);
    let data = NOF1;
    if (data.serialNo === 0) {
      let newData = enclosureArr[enclosureArr.length - 1];
      handleChange1(newData);
    } else {
      let newData = enclosureArr[data.serialNo - 1];
      handleChange1(newData);
    }
  };

  const handleChangeNextEnclosure = () => {
    setPageNumber(1);
    let data = NOF1;
    if (data.serialNo + 1 === enclosureArr.length) {
      let newData = enclosureArr[0];
      handleChange1(newData);
    } else {
      let newData = enclosureArr[data.serialNo + 1];
      handleChange1(newData);
    }
  };

  const handleRedirectToHrm = (row) => {
    Cookies.set("hasCoverNote", hasCoverNote);
    Cookies.set("HrmRole", hrmRole);
    // props.setInboxDatas(row); // row is event object no need to save in redux as it is too big
    setSend(true);
  };

  const resetButton = () => {
    setLoading(true);
    let tempArr = pdfViewerButtons.map((item, i) => ({
      ...item,
      btnId: i,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    }));
    {
      isRti == "true"
        ? props.savePartCaseTagRti(partCaseId, tempArr).then((resp) => {
            try {
              if (resp.error) {
                callMessageOut(resp.error);
                return;
              }
              if (resp) {
                setLoading(false);
                setPdfViewerButtons(tempArr);
                Cookies.set("HrmRole", hrmRole);
                // props.setInboxDatas(row);
                // setSend(true);
              }
            } catch (error) {
              callMessageOut(error.message);
            }
          })
        : props.savePartCaseTag(partCaseId, tempArr).then((resp) => {
            try {
              if (resp.error) {
                callMessageOut(resp.error);
                return;
              }
              if (resp) {
                setLoading(false);
                setPdfViewerButtons(tempArr);
                Cookies.set("HrmRole", hrmRole);
                // props.setInboxDatas(row);
                // setSend(true);
              }
            } catch (error) {
              callMessageOut(error.message);
            }
          });
    }
  };

  const pdfCustomButton = (e) => {
    let elementName = e.target.parentElement.getAttribute("buttonName");
    let fileurl = e.target.parentElement.getAttribute("fileurl");
    let pages = e.target.parentElement.getAttribute("page");

    const tempColour = ["orange", "green", "purple", "blue", "mediumvioletred"];

    let data = enclosureArr.find((item) => item.fileUrl === fileurl);
    let strData = data;

    var urlExist = true;
    var resUrl = "";
    for (let x = 0; x < pdfViewerButtons.length; x++) {
      if (pdfViewerButtons[x].fileurl === URL) {
        urlExist = false;
      }
      if (fileurl) {
        resUrl = fileurl;
      }
    }
    if (resUrl) {
      setPageNumber(pages);
      setURL(resUrl);
      setNOF1(strData);
      let arr = data.fileName.split(".");
      arr.length !== 1
        ? setExtension(arr[arr.length - 1])
        : setExtension("docx");
    } else {
      let updatedElement = pdfViewerButtons.map((item) =>
        item.btnId == elementName && fileChange && urlExist
          ? {
              ...item,

              backgroundColor: tempColour[item.btnId],
              fileurl: URL,
              pageNumber: page,
            }
          : item
      );
      setFileChange(false);
      setPdfViewerButtons(updatedElement);
      {
        isRti == "true"
          ? props
              .savePartCaseTagRti(partCaseId, updatedElement)
              .then((resp) => {
                try {
                  if (resp.error) {
                    callMessageOut(resp.error);
                    return;
                  }
                  if (resp) {
                    Cookies.set("HrmRole", hrmRole);
                    // props.setInboxDatas(row);
                    // setSend(true);
                  }
                } catch (error) {
                  callMessageOut(error.message);
                }
              })
          : props.savePartCaseTag(partCaseId, updatedElement).then((resp) => {
              try {
                if (resp.error) {
                  callMessageOut(resp.error);
                  return;
                }
                if (resp) {
                  Cookies.set("HrmRole", hrmRole);
                  // props.setInboxDatas(row);
                  // setSend(true);
                }
              } catch (error) {
                callMessageOut(error.message);
              }
            });
      }
    }
  };

  const handleSignedCompleted = (val) => {
    setOpen(false);
  };

  const handleReturnedURL = (val) => {
    let tempArr = notingData.map((item) =>
      item.flagNumber === val.flagNumber ? val : item
    );
    setNotingData(tempArr);
    let newVal = {
      target: {
        value: JSON.stringify(val),
      },
    };
    handleChange(newVal);
    // // setNotingURL(url);
    // loadSplitViewData();
  };
  const handleAddPartCaseNoting = () => {
    setLoading(true);
    const groupName = sessionStorage.getItem("department");
    props.createPartCaseNotingFile(partCaseId, groupName).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        }
        setLoading(false);
        loadSplitViewData();
      } catch (error) {
        callMessageOut(error.message);
      }
    });
  };

  const handleAddNoting = () => {
    const groupName = sessionStorage.getItem("department");
    const deptName = sessionStorage.getItem("department");
    props.saveRtiFile(FileID, groupName, deptName).then((resp) => {
      loadRtiData();
    });
  };

  const handleDocumentRollback = () => {
    setLoading(true);
    rowID &&
      props.rollbackSplitViewDocument(rowID, prevFlagNumberNF).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          const data = resp.edited;
          let temArr = notingData.map((item) =>
            item.flagNumber === data.flagNumber
              ? {
                  ...data,
                  serialNo: 0,
                  isEditable: item.status === "Internal" ? true : false,
                }
              : item
          );
          setNotingData(temArr);
          const flagNumber = data.flagNumber;
          const hideViewer = data.signed;
          setNotingSigned(hideViewer);
          if (data.uploader === department) {
            setBlnHideSyncfusion(hideViewer);
          } else {
            setBlnHideSyncfusion(true);
          }
          setOpenInPdf(true);
          setFlag("Noting");
          let newNofUrl;
          setNOF(JSON.stringify(temArr[0]));
          if (
            !data.signed &&
            data.prevVersionId &&
            !data.status === "External"
          ) {
            newNofUrl = `${data.fileUrl}?versionId=${data.prevVersionId}`;
          } else {
            newNofUrl = data.fileUrl;
          }
          unstable_batchedUpdates(() => {
            setPrevFlagNumberNF(flagNumber);
            setreSaveNof(true);
            setNotingURL(newNofUrl);
            setLoading(false);
          });
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const handleRtiDocumentRollback = () => {
    rowID &&
      props
        .rollbackRtiSplitViewDocument(FileID, prevFlagNumberNF)
        .then((resp) => {
          try {
            // // setSfdtData(resp.url);
            // setBlnDisableForward();
            // setBlnHideSyncfusion(false);
            // let fileUrl =
            //   resp.url + !resp.signed && `?versionId=${resp.url.prevVersionId}`;
            // setNotingURL(fileUrl);

            // const data = resp.edited;
            // let temArr = notingData.map((item) =>
            //   item.flagNumber === data.flagNumber
            //     ? { ...data, serialNo: 0, isEditable: false }
            //     : item
            // );
            const data = resp.edited;
            let temArr = notingData.map((item) =>
              item.flagNumber === data.flagNumber
                ? {
                    ...data,
                    serialNo: 0,
                    isEditable: item.status === "Internal" ? true : false,
                  }
                : item
            );
            setNOF(JSON.stringify(temArr[0]));
            setNotingData(temArr);
            // let url = data.fileUrl;
            const flagNumber = data.flagNumber;
            const hideViewer = data.signed;
            setNotingSigned(hideViewer);
            if (data.uploader === department) {
              setBlnHideSyncfusion(hideViewer);
            } else {
              setBlnHideSyncfusion(true);
            }
            // setBlnHideSyncfusion(true)
            setOpenInPdf(true);
            setFlag("Noting");
            // setFlagNumber(flagNumber);
            // setSfdtData(url);
            let newNotingUrl;
            if (!data.signed && data.prevVersionId) {
              newNotingUrl = `${data.fileUrl}`;
            } else {
              newNotingUrl = data.fileUrl;
            }
            unstable_batchedUpdates(() => {
              setreSaveNof(true);
              setPrevFlagNumberNF(flagNumber);
              setNotingURL(newNotingUrl);
            });
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleDocumentRollbackEnclosure = () => {
    setLoading(true);
    rowID &&
      props
        .rollbackSplitViewEnclosureDocument(partCaseId, prevFlagNumberEnclouser)
        .then((resp) => {
          console.log(resp);
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            }
            handleEnclosure(resp.enclosure, true);
            setLoading(false);
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleRtiDocumentRollbackEnclosure = () => {
    // setLoading(true);
    rowID &&
      props
        .rollbackRtiSplitViewEnclosureDocument(FileID, prevFlagNumberEnclouser)
        .then((resp) => {
          try {
            handleEnclosure(resp.enclosure);
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleCoverLetter = () => {
    setCoverLetterDialog(true);
  };

  const handleAddCoverLetter = (subject, value) => {
    setLoading(true);
    let temArr = [];
    for (let i = 0; i < value.length; i++) {
      temArr.push(value[i].flagNumber);
    }
    const groupName = sessionStorage.getItem("role");
    const department = sessionStorage.getItem("department");
    props
      .createCoverLetter(
        partCaseId,
        groupName,
        subject,
        temArr,
        username,
        department
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            if (resp.hasError === "true") {
              callMessageOut(resp.msg);
              return;
            }
            setLoading(false);
            dispatch(setSnackbar(true, "success", resp.msg));
            loadSplitViewData();
            setCoverLetterDialog(false);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleSendConfirmation = (value) => {
    setLoading(true);
    const deptName = sessionStorage.getItem("department");
    setOpenConfirmation(false);
    // setLoad(true);
    props
      .returnRti(FileID, deptName, username)
      .then((resp) => {
        // setLoading(false)
        // history.push({ pathname: "/eoffice/inbox/file" });
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_returned_successfully")}`));
        try {
          if (resp.error) {
            setLoading(false);
            console.log(resp.error);
            dispatch(setSnackbar(true, "error", resp.error));
          } else {
            console.log("res", resp);
            setLoading(false);
            history.push({ pathname: "/eoffice/inbox/file" });
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_returned_successfully")}`
              )
            );
            return;
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
        }

        // dispatch(setSnackbar(true, "Returned file successfully"));
      })
      .catch((err) => console.log(err));
  };

  const handleEnclosure = (data, shouldReSave) => {
    const url = data.fileUrl;
    const flagNumber = data.flagNumber;
    let enclosureName = NOF1;

    let arr = data.fileName.split(".");
    arr.length !== 1 ? setExtension(arr[arr.length - 1]) : setExtension("docx");
    let tempArr = enclosureArr.map((item) =>
      item.flagNumber === flagNumber
        ? {
            ...item,
            fileUrl: data.fileUrl,
            signed: data.signed,
            prevVersionId: data.prevVersionId,
            subject: item.subject ? item.subject : item.fileName,
          }
        : item
    );

    unstable_batchedUpdates(() => {
      setCoverLetter(data.coverNote);
      setEnclosureSigned(data.signed);
      setFileChange(true);
      shouldReSave && setreSaveEnco(true);
      setURL(url);
      setFlag("Enclouser");
      setPrevEnclouser(url);
      setPrevFlagNumberEnclouser(flagNumber);
      setRtifilename(data.fileName);
      setEnclosureArr(tempArr);
      setNOF1({
        ...enclosureName,
        fileUrl: data.fileUrl,
        signed: data.signed,
        prevVersionId: data.prevVersionId,
      });
    });
  };

  const handleAddEnclosure = (data) => {
    let tempArr = [];
    enclosureArr.map((item) => tempArr.push(item));
    data.map((item, i) =>
      tempArr.push({
        ...item,
        serialNo: enclosureArr.length + i,
        subject: item.subject ? item.subject : item.fileName,
      })
    );
    setEnclosureArr(tempArr);
  };

  const handleSignNoting = () => {
    setFlagNumber(prevFlagNumberNF);
    setFlag("Noting");
    let nofUrl = "";
    if (notingStatus === "Internal") {
      nofUrl = notingURL.split("?versionId")[0];
      setSfdtData(nofUrl);
    } else {
      setSfdtData(notingURL);
    }
    setOpen(true);
  };

  const handleFlagOpen = () => {
    setOpenDialog(true);
    setisValid(true);
  };

  const handleFlagClose = () => {
    setOpenDialog(false);
    setisValid(false);
  };

  const deleteEnclosureData = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    props
      .deleteEnclosure(rolename, pcId, prevFlagNumberEnclouser)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("annexure_has_been_deleted_successfully")} !`
            )
          );
          const newArray = enclosureArr.filter((item) => {
            return item.flagNumber !== prevFlagNumberEnclouser;
          });
          setEnclosureArr(newArray);
          let newData = enclosureArr[0];
          handleChange1(newData);
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const deleteEnclosureDataRti = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    const partcase = Cookies.get("partcaseId");
    props
      .deleteEnclosureRti(rolename, pcId, rtifilename, prevFlagNumberEnclouser)
      .then((resp) => {
        loadRtiData();
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("Enclosure_has_been_deleted_successfully")} !`
            )
          );
          const newArray = enclosureArr.filter((item) => {
            return item.flagNumber !== prevFlagNumberEnclouser;
          });
          setEnclosureArr(newArray);
          let newData;
          if (enclosureArr) {
            newData = enclosureArr[0];
          } else {
            newData = [];
          }
          if (newArray.length > 0) {
            handleChange1(newData);
          } else {
            handleClearInput();
          }
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const handleFlagEdit = (e) => {
    e.preventDefault();
    const pcId = sessionStorage.getItem("partcaseID");
    const roleName = sessionStorage.getItem("role");
    props
      .editFlagNumber(
        pcId,
        value,
        prevFlagNumberEnclouser,
        roleName,
        NOF1.flagNumberMarking
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            let tmpArr = enclosureData.map((item) =>
              item.flagNumber === NOF1.flagNumber
                ? { ...NOF1, flagNumber: value }
                : item
            );
            setEnclosureData(tmpArr);
            handleChange1({ ...NOF1, flagNumber: value });
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("enclosure_has_been_edited_successfully")}`
              )
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    setOpenDialog(false);
  };

  const handleRtiFlagEdit = (e) => {
    e.preventDefault();
    const pcId = sessionStorage.getItem("partcaseID");
    const roleName = sessionStorage.getItem("role");
    props
      .editRtiFlagNumber(
        pcId,
        value,
        prevFlagNumberEnclouser,
        roleName,
        NOF1.flagNumberMarking
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            let tmpArr = enclosureData.map((item) =>
              item.flagNumber === NOF1.flagNumber
                ? { ...NOF1, flagNumber: value }
                : item
            );
            setEnclosureData(tmpArr);
            handleChange1({ ...NOF1, flagNumber: value });
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("enclosure_has_been_edited_successfully")}`
              )
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    setOpenDialog(false);
  };

  const handleFlagValidate = (e) => {
    setValue(Number(e.target.value));
    const isFlagExistIndex = FlagNoArr.indexOf(Number(e.target.value));

    if (isFlagExistIndex == -1) {
      setisValid(true);
    } else {
      setisValid(false);
    }
  };

  const handleDownload = async (e) => {
    const rtiID = sessionStorage.getItem("rtiID");
    try {
      const res = await Axios.post(
        `/rti/api/downloadZip`,
        JSON.stringify(rtiID),
        {
          headers: {
            "Content-Type": "application/json; charset=utf8",
            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            id: rtiID,
          },
          responseType: "arraybuffer",
        }
      );
      if (res) {
        let blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        saveAs(blob, "RTI File.zip");
      }
    } catch (e) {
      callMessageOut(e.message);
    }
  };

  const hanldeCheckCondition = () => {
    if (partCase === "true" || isRegister) {
      return false;
    } else if (isrtiforward) {
      return false;
    } else {
      return true;
    }
  };

  const handleuploadCondition = () => {
    if (isRegister || isrtiforward) {
      return false;
    } else {
      return true;
    }
  };

  const handleCabinateClick = () => {
    Cookies.remove("partCase");
    Cookies.remove("cabinetStatus");
    // loadPartCaseIdData();

    props.openFile(department, cabinetpartcase).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        } else {
          loadData(resp);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  return (
    <>
      {loading && <Loading />}
      {partCase !== "true" || !isRegister ? (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={() => setOpenSpeedDial(true)}
          open={openSpeedDial}
          direction="left"
        >
          {!isCabinet && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<SendIcon />}
              tooltipTitle={reSaveEnco || reSaveNof ? t("autosave") : t("send")}
              onClick={handleRedirectToHrm}
              style={{
                display: `${!Rtioutbox && partCase !== "true" ? "" : "none"}`,
              }}
              FabProps={{
                disabled: reSaveEnco || reSaveNof,
              }}
            />
          )}

          {isCabinet && cabinetIcon === "In-Cabinet" && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ImportContacts />}
              tooltipTitle={t("open_file")}
              onClick={handleCabinateClick}
            />
          )}

          {canClose && !isCabinet && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<FaRegCalendarTimes />}
              tooltipTitle={t("save in cabinet")}
              onClick={() => setcloseFile(true)}
              FabProps={{
                disabled: reSaveEnco || reSaveNof,
              }}
            />
          )}

          {isRti === "true" ? (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ArrowBack />}
              tooltipTitle={t("RETURN RTI")}
              onClick={() => setOpenConfirmation(true)}
              style={{
                display: `${rolename !== creater}`,
              }}
            />
          ) : (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ArrowBack />}
              tooltipTitle={t("back")}
              onClick={() => history.goBack()}
              style={{
                display: `${partCase === "true" ? "none" : ""}`,
              }}
            />
          )}

          <SpeedDialAction
            className={classes.sDialIcon}
            icon={
              <SpeedDialIcon
                icon={
                  <div>
                    <Announcement />
                    <span className="bm-icons-badge">{count2}</span>
                  </div>
                }
              />
            }
            tooltipTitle={t("remarks")}
            onClick={() => {
              setopenRemarks(true);
            }}
          />

          <SpeedDialAction
            className={classes.sDialIcon}
            icon={
              <SpeedDialIcon
                icon={
                  <div>
                    <CgNotes />
                    <span className="bm-icons-badge">{count1}</span>
                  </div>
                }
              />
            }
            tooltipTitle={t("yellow notes")}
            onClick={() => {
              setopenYellowNotes(true);
            }}
          />

          {isRegister && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<GetAppIcon />}
              tooltipTitle={t("DOWNLOAD")}
              onClick={handleDownload}
              style={{
                display: `${!Rtioutbox ? "" : "none"}`,
              }}
            />
          )}
        </SpeedDial>
      ) : (
        <></>
      )}
      {}
      <Grid
        container
        justifyContent="space-between"
        spacing={1}
        style={{
          margin: "0px",
        }}
      >
        <SplitterComponent>
          <div
            style={{
              width: "35%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Accordion className="fileAccordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="fileInfoAccordian"
              >
                <Typography className={classes.fileInfo}>
                  <Description style={{ fontSize: "1.8rem", color: "white" }} />
                  <span style={{ fontSize: "1.3rem", color: "white" }}>
                    File Description
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container className="fileInfoCon">
                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <Business style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        Department
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>
                      {fileInfo.fileDept}
                    </span>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <Subject style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        Subject
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>{subject}</span>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <PriorityHigh style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        Priority
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>{priority}</span>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <AiOutlineFileUnknown style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        Type
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>{type}</span>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <AiOutlineFileText style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        File
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>{fileInfo.file}</span>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <Person style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        Created By
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>
                      {fileInfo.createdBy}
                    </span>
                  </Grid>

                  <Grid item xs={12}>
                    <div className="fileInfoIcon">
                      <Event style={{ fontSize: "1.2rem" }} />
                      <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                        Created On
                      </span>
                    </div>
                    <span style={{ textAlign: "center" }}>
                      {fileInfo.createdOn}
                    </span>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion className="fileAccordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="fileInfoAccordian"
              >
                <Typography className={classes.fileInfo}>
                  <Description style={{ fontSize: "1.8rem", color: "white" }} />
                  <span style={{ fontSize: "1.3rem", color: "white" }}>
                    Note Sheet(s)
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container className="fileNofCon">
                  <Grid item xs={12}>
                    <TableContainer
                      component={Paper}
                      style={{
                        border: `1px solid #8080805c`,
                      }}
                    >
                      <Table
                        component="div"
                        className="App-main-table"
                        style={{
                          overflow: "hidden",
                        }}
                      >
                        <TableHead component="div">
                          <TableRow component="div" className="nof_table_head">
                            <div>Filename</div>
                            <div>By</div>
                            <div>Status</div>
                            <div>Actions</div>
                          </TableRow>
                        </TableHead>
                        <TableBody
                          component="div"
                          style={{
                            height: "calc(100vh - 250px)",
                            overflow: "auto",
                          }}
                        >
                          {NOFarr.map((item, i) => {
                            const status =
                              item.status === "Approved"
                                ? "lightgreen"
                                : item.status === "Rejected"
                                ? "rgb(253, 78, 50)"
                                : "rgb(255, 175, 56)";

                            return (
                              <TableRow
                                component="div"
                                className={`nof_table_row ${
                                  i == 0 ? "active" : ""
                                }`}
                                key={i}
                                // onClick={() => handleChange(JSON.stringify(item))}
                              >
                                <div>{item.filename}</div>
                                <div>
                                  <span>{item.by}</span>
                                  <span>{item.date}</span>
                                </div>
                                <div
                                  style={{
                                    color: "white",
                                    background: status,
                                    borderRadius: "10px",
                                    textAlign: "center",
                                  }}
                                >
                                  {item.status}
                                </div>
                                <div>
                                  <IconButton>
                                    <FaSearchPlus />
                                  </IconButton>
                                  <IconButton>
                                    <HiDownload />
                                  </IconButton>
                                </div>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion className="fileAccordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="fileInfoAccordian"
              >
                <Typography className={classes.fileInfo}>
                  <Description style={{ fontSize: "1.8rem", color: "white" }} />
                  <span style={{ fontSize: "1.3rem", color: "white" }}>
                    Enclosures
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container className="fileNofCon">
                  <Grid item xs={12}>
                    <TableContainer
                      component={Paper}
                      style={{
                        border: `1px solid #8080805c`,
                      }}
                    >
                      <Table
                        component="div"
                        className="App-main-table"
                        style={{
                          overflow: "hidden",
                        }}
                      >
                        <TableHead component="div">
                          <TableRow component="div" className="enco_table_head">
                            <div>
                              <Checkbox />
                            </div>
                            <div>#</div>
                            <div>Descritopn</div>
                            <div>By</div>
                            <div>Page No</div>
                            <div>Actions</div>
                          </TableRow>
                        </TableHead>
                        <TableBody
                          component="div"
                          style={{
                            height: "calc(100vh - 250px)",
                            overflow: "auto",
                          }}
                        >
                          {Encoarr.map((item, i) => {
                            return (
                              <TableRow
                                component="div"
                                className={`enco_table_row ${
                                  i == 0 ? "active" : ""
                                }`}
                                key={i}
                                // onClick={() => handleChange(JSON.stringify(item))}
                              >
                                <div>
                                  <Checkbox />
                                </div>
                                <div>{item.flagNo}</div>
                                <div>{item.description}</div>
                                <div>
                                  <span>{item.by}</span>
                                  <span>{item.date}</span>
                                </div>
                                <div>{item.page_no}</div>
                                <div>
                                  <IconButton>
                                    <FaSearchPlus />
                                  </IconButton>
                                  <IconButton>
                                    <HiDownload />
                                  </IconButton>
                                </div>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="encolureActionBtn">
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<Add />}
                      >
                        Add
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<Edit />}
                      >
                        Edit #
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </AccordionDetails>
              <Divider />
            </Accordion>
          </div>

          <div
            style={{
              width: "65%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Accordion className="fileAccordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="fileInfoAccordian"
              >
                <Typography className={classes.fileInfo}>
                  <MdOutlineNoteAlt
                    style={{ fontSize: "1.8rem", color: "white" }}
                  />
                  <span style={{ fontSize: "1.3rem", color: "white" }}>
                    Office Note / Green Sheet
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      height: "75vh",
                    }}
                  >
                    <SplitViewPdfViewer
                      fileUrl={notingURL}
                      pdfLoads={(val) => {
                        setpdfLoads(val);
                      }}
                      isCustomLink={true}
                      enclosureData={enclosureArr}
                      handleChange1={handleChange1}
                      fileId={!blnHideSyncfusion && openInPdf ? "" : rowID}
                      flag={"SPLIT"}
                      flagNumber={prevFlagNumberNF}
                      anottId={nofAnnoId}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion className="fileAccordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="fileInfoAccordian"
              >
                <Typography className={classes.fileInfo}>
                  <MdOutlineNoteAlt
                    style={{ fontSize: "1.8rem", color: "white" }}
                  />
                  <span style={{ fontSize: "1.3rem", color: "white" }}>
                    Office Note / Response
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      height: "75vh",
                    }}
                  >
                    <HeadersAndFootersView
                      fileId={rowID}
                      fileUrl1={notingURL}
                      blnIsPartCase={true}
                      reSave={reSaveNof}
                      setreSave={(val) => {
                        setreSaveNof(val);
                      }}
                      enclosureData={enclosureData}
                      handleChange1={handleChange1}
                      // style={{ border: "1px solid #b6b6b6" }}
                      containerId="container3"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion className="fileAccordian" defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: "white" }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="fileInfoAccordian"
              >
                <Typography>
                  <span style={{ fontSize: "1.3rem", color: "white" }}>
                    File Action
                  </span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="fileActionCon">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<Close />}
                  >
                    Save & Close
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<Create />}
                  >
                    Create Part Files
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<Forward />}
                  >
                    Forward
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<History />}
                  >
                    History
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    startIcon={<Note />}
                  >
                    Yellow Note
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </SplitterComponent>
      </Grid>

      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
          onClose={() => setOpen(false)}
        >
          <span>{t("remark_&_sign")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => setOpen(false)}
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <InputForm
          flag={flag}
          callBackURL={handleReturnedURL}
          isSignedCompleted={handleSignedCompleted}
          handleEnclosure={handleEnclosure}
          fileId={rowID}
          SignURL={sfdtData}
          flagNum={flagNumber}
          loadRtiData={loadRtiData}
        />
      </Dialog>

      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}?
          <IconButton
            id="setOpenConfirmation_button"
            aria-label="close"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: props.theme ? "#fff" : "black" }}
          >
            {props.status === "Approved" || props.status === "Rejected" ? (
              <p>
                Update status to applicant <br />
                status = <strong>{props.status}</strong>
              </p>
            ) : (
              <p>
                {t("confirmation_text")} <br />
                {t("confirmation_text_2")}
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControl component="fieldset">
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("NO")}
                value="NO"
                onClick={() => setOpenConfirmation(false)}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("YES")}
                value="YES"
                onClick={handleSendConfirmation}
              />
            </RadioGroup>
          </FormControl>
        </DialogActions>
      </Dialog>

      <Dialog
        open={send}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            className="dialog_title"
            style={{ cursor: "move" }}
          >
            {t("send_to")}

            <IconButton
              id="inbox_splitView_send_to"
              aria-label="close"
              onClick={() => setSend(false)}
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          {isRti === "true" ? (
            <RtiHrmDialog
              fileId={FileID}
              handleClose={() => setSend(false)}
              pfileName={referenceNumber}
              departmentList={departmentList}
              status={status}
              enclosureArr={enclosureArr}
            />
          ) : (
            <HrmDialog
              handleClose={() => setSend(false)}
              pfileName={referenceNumber}
              enclosureArr={enclosureArr}
              serviceLetterId={serviceLetterId}
              departmentList={departmentList}
              status={status}
            />
          )}
        </Paper>
      </Dialog>

      <Dialog
        open={coverLetterDialog}
        onClose={() => setCoverLetterDialog(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("CREATE COVERLETTER")}
          <IconButton
            id="setCoverLetterDialog_close_button"
            aria-label="close"
            onClick={() => setCoverLetterDialog(false)}
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <CoverLetterDialog
          enclosureArr={enclosureArr}
          handleSend={handleAddCoverLetter}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={openDialog}
        PaperComponent={PaperComponent}
        onClose={handleFlagClose}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>ADD ENCLOSURE NUMBER</span>
          <IconButton
            id="add_enclosure_number_close_button"
            aria-label="close"
            onClick={handleFlagClose}
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={isRti == "true" ? handleRtiFlagEdit : handleFlagEdit}>
          <DialogContent dividers>
            <Grid style={{ display: "grid", gridTemplateColumns: "6rem 1fr" }}>
              <Grid>
                <p>Flag Number:</p>
              </Grid>
              <Grid>
                <TextField
                  error={isValid ? false : true}
                  helperText={!isValid && "Number already exists."}
                  InputLabelProps={{ shrink: false }}
                  variant="outlined"
                  id="outlined-number"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
                    endAdornment: (
                      <InputAdornment position="end">A</InputAdornment>
                    ),
                  }}
                  size="small"
                  value={value}
                  onChange={handleFlagValidate}
                  onBlur={() => setTouched(true)}
                  fullWidth
                />
              </Grid>
              <Grid>
                <p>Subject:</p>
              </Grid>
              <Grid>
                <TextField
                  InputLabelProps={{ shrink: false }}
                  variant="outlined"
                  id="outlined-text"
                  type="Text"
                  value={NOF1 && NOF1.subject}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <span>
              <Button
                id="flagEdit_submit_button"
                variant="outlined"
                endIcon={<DoneIcon />}
                disabled={!isValid}
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </span>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
    inboxer: state.inboxer,
    theme: state.theme,
  };
};
export default connect(mapStateToProps, {
  setInboxDatas,
  loadInboxDataSplitView,
  loadPartCaseData,
  getPANotingData,
  getPAEnclosureData,
  savePartCaseTag,
  fetchSplitViewTags,
  createPartCaseNotingFile,
  rollbackSplitViewDocument,
  rollbackSplitViewEnclosureDocument,
  createCoverLetter,
  deleteEnclosure,
  editFlagNumber,
  validateFlagNumber,
  loadRtiPartCaseData,
  rollbackRtiSplitViewDocument,
  rollbackRtiSplitViewEnclosureDocument,
  saveRtiFile,
  loadRtiDataSplitView,
  returnRti,
  sendbackRti,
  getdownloadZip,
  deleteEnclosureRti,
  fetchSplitViewTagsRti,
  savePartCaseTagRti,
  editRtiFlagNumber,
  getcabinetpartcase,
  openFile,
})(ViewOne);

const NOFarr = [
  {
    id: 1,
    filename: "Notesheet1",
    by: "7wghrc",
    status: "Approved",
    date: "4/11/2022",
  },
  {
    id: 2,
    filename: "Holiday leave",
    by: "7wghrc",
    status: "Rejected",
    date: "9/7/2022",
  },
  {
    id: 3,
    filename: "Posting",
    by: "7wgcad",
    status: "Approved",
    date: "4/28/2022",
  },
  {
    id: 4,
    filename: "Traveling Expense",
    by: "7wgmeto",
    status: "In Progress",
    date: "4/1/2022",
  },
  {
    id: 5,
    filename: "Allotment Of Systems",
    by: "7wghrc",
    status: "In Progress",
    date: "1/21/2023",
  },
  {
    id: 6,
    filename: "Result Annoucement",
    by: "7wgcad",
    status: "Approved",
    date: "3/31/2022",
  },
  {
    id: 7,
    filename: "Writs",
    by: "7wgmeto",
    status: "Rejected",
    date: "3/14/2023",
  },
  {
    id: 8,
    filename: "Moving And Allotment",
    by: "7wghrc",
    status: "Approved",
    date: "9/4/2022",
  },
];

const Encoarr = [
  {
    id: 1,
    description: "Notesheet1",
    flagNo: 1,
    by: "7wghrc",
    page_no: 55,
    date: "4/11/2022",
  },
  {
    id: 2,
    description: "Holiday leave",
    flagNo: 2,
    by: "7wghrc",
    page_no: 102,
    date: "9/7/2022",
  },
  {
    id: 3,
    description: "Posting",
    flagNo: 3,
    by: "7wgcad",
    page_no: 100,
    date: "4/28/2022",
  },
  {
    id: 4,
    description: "Traveling Expense",
    flagNo: 4,
    by: "7wgmeto",
    page_no: 400,
    date: "4/1/2022",
  },
  {
    id: 5,
    description: "Allotment Of Systems",
    flagNo: 5,
    by: "7wghrc",
    page_no: 23,
    date: "1/21/2023",
  },
  {
    id: 6,
    description: "Result Annoucement",
    flagNo: 6,
    by: "7wgcad",
    page_no: 141,
    date: "3/31/2022",
  },
  {
    id: 7,
    description: "Writs",
    flagNo: 7,
    by: "7wgmeto",
    page_no: 44,
    date: "3/14/2023",
  },
  {
    id: 8,
    description: "Moving And Allotment",
    flagNo: 8,
    by: "7wghrc",
    page_no: 1500,
    date: "9/4/2022",
  },
];
