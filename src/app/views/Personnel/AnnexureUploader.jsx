import React, { useState } from "react";
import FileUpload from "./fileUpload/file-upload.component";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import { uploadAnnexure } from "../../camunda_redux/redux/action";
import { changingTableStateAnnexure } from "../../camunda_redux/redux/action/apiTriggers";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";
import { useTranslation } from "react-i18next";
import UploadLoading from "../utilities/UploadLoading";
import Draggable from "react-draggable";
import SaveIcon from "@material-ui/icons/Save";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function AnnexureUploader(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [newUserInfo, setNewUserInfo] = useState({
    attachedAnnexures: [],
  });
  const role = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");
  const [blnFlag, setBlnFlag] = useState(false);
  const { personalAppID, sendClick } = props;
  const [singleProgress, setSingleProgress] = useState(0);
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [currentAnnexture, setCurrentAnnexture] = useState(0);
  const [subject, setSubject] = useState("");

  const handleClose = () => {
    setCurrentAnnexture(0);
    setOpen(false);
  };

  const updateUploadedFiles = (files) => {
    setNewUserInfo({ ...newUserInfo, attachedAnnexures: files });
    handleSubmit(files);
  };

  const onUploadProgress = {
    onUploadProgress: (progressEvent) => {
      setSingleProgress(0);
      setblnProgressBar(true);
      const { loaded, total } = progressEvent;
      const percentage = Math.floor((loaded / total) * 100);
      setSingleProgress(percentage - 1);
    },
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    let fileData = event;
    console.log(fileData);
    setFiles(fileData);
    setFile(fileData[0]);
    setSubject(fileData[0].name);
    setOpen(true);
  };

  const handleNextAnnexture = () => {
    currentAnnexture + 1 !== files.length &&
      setCurrentAnnexture(currentAnnexture + 1);
    setFile(files[currentAnnexture + 1]);
    let value = currentAnnexture + 1 === files.length ? true : false;
    handleUploadAnnexture(subject, value);
    !value && setSubject(files[currentAnnexture + 1].name);
  };

  const handleUploadAnnexture = (annexureSubject, value, tempArr) => {
    let data = annexureSubject ? [file] : tempArr;
    let formData = new FormData();
    for (var x = 0; x < data.length; x++) {
      formData.append("file", data[x]);
    }
    setTotalFileSelected(data.length);
    return props
      .uploadAnnexure(
        personalAppID,
        formData,
        role,
        username,
        onUploadProgress,
        annexureSubject
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setblnProgressBar(false);
            setBlnFlag(true);
            blnClearFileList();
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("annexure_has_been_inserted_successfully")}!`
              )
            );
            setTimeout(() => {
              props.handleUploadAnnexture(resp.data.annexure);
            });
            if (value) {
              handleClose();
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      });
  };

  const handleUplaodAll = () => {
    let tempArr = [];
    for (let i = currentAnnexture; i < files.length; i++) {
      tempArr.push(files[i]);
    }
    handleUploadAnnexture("", true, tempArr);
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const blnClearFileList = () => {
    if (blnFlag === true) {
      setBlnFlag(false);
      return true;
    }
    return false;
  };
  return (
    <div>
      {blnProgressBar && <UploadLoading />}
      <form>
        <FileUpload
          accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,
                     application/vnd.openxmlformats-officedocument.presentationml.presentation,image/png,image/jpeg,
                     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Attachment(s)"
          multiple
          totalFileSelected={totalFileSelected}
          blnProgressBar={blnProgressBar}
          updateFilesCb={updateUploadedFiles}
          blnClearFlag={blnClearFileList}
        />
        <Grid item style={{ textAlignLast: "right" }}></Grid>
      </form>
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="send_dialog"
        >
          <span>ADD ANNEXURE SUBJECT</span>
          <IconButton
            id="annexure_subject_close_btn"
            aria-label="close"
            onClick={handleClose}
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid>
            <span
              style={{
                float: "right",
                border: "1px solid #ddd",
                padding: "1px 8px",
                borderRadius: "5px",
              }}
            >
              {currentAnnexture + 1}/{files.length}
            </span>
          </Grid>
          <Grid>
            <TextField
              label="Enter Subject"
              variant="outlined"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              size="small"
              style={{ margin: "1rem 0" }}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            className="saveButton"
            id="annexure_btn_saveAll"
            variant="outlined"
            color="primary"
            endIcon={<SaveIcon />}
            onClick={handleUplaodAll}
          >
            SAVE ALL
          </Button>
          <Button
            className="finishButton"
            id="annexureUploader_done"
            variant="outlined"
            color="primary"
            endIcon={
              currentAnnexture + 1 === files.length ? (
                <DoneIcon />
              ) : (
                <SkipNextIcon />
              )
            }
            onClick={handleNextAnnexture}
            disabled={subject === "" ? true : false}
          >
            {currentAnnexture + 1 === files.length ? "FINISH" : "NEXT"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, {
  uploadAnnexure,
  changingTableStateAnnexure,
})(AnnexureUploader);
