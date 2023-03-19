import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Grid,
  Button,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import DoneIcon from "@material-ui/icons/Done";
import UndoIcon from "@material-ui/icons/Undo";
import {
  personalFileFormData,
  updateSubjectFileForm,
} from "../../camunda_redux/redux/action";
import { changingTableState } from "../../camunda_redux/redux/action/apiTriggers";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { setRefresh } from "../../redux/actions/RefreshActions";
import { useTranslation } from "react-i18next";
import { CHANGE_PA_FILE, UPDATE_FILE_SUBJECT } from "app/camunda_redux/redux/constants/ActionTypes";
import { Loading } from "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";

const useStyles = makeStyles((theme) => ({
  btnGrid: {
    textAlign: "right",
    marginTop: theme.spacing(4),
  },
}));

const PersonalFileForm = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [blnDisable, setBlnDisable] = useState(false);
  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const [loading, setloading] = useState(false);
  const { changeFile } = useSelector((state) => state);

  const dispatch = useDispatch();

  const configData = {
    fullWidth: true,
    size: "small",
    className: classes.textField,
  };

  const INITIAL_STATE = {
    subject: props.updateSubject ? props.fileSubject : "",
    pfileName: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim(t("no_spaces_allowed_at_the_start_and_end"))
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: (values) => {
      setBlnDisable(true);
      setloading(true);
      let data = { ...values, subject: values.subject.trim() };
      props.updateSubject
        ? props
            .updateSubjectFileForm(formik.values.subject, props.fileId)
            .then(async (res) => {
              try {
                props.handleClose();
                setBlnDisable(false);
                dispatch({
                  type: UPDATE_FILE_SUBJECT,
                  payload: {
                    subject: formik.values.subject,
                    id: props.fileId,
                  },
                });
                setloading(false);
                callMessageOut(
                  "success",
                  t("personal_application_updated_successfully!")
                );
              } catch (error) {
                callMessageOut("error", error.message);
                setloading(false);
              }
            })
        : props
            .personalFileFormData({
              ...data,
              userName: username,
              roleName: role,
            })
            .then(async (res) => {
              props.handleClose();
              setBlnDisable(false);
              if (res.error) {
                callMessageOut("error", res.error);
                setloading(false);
                return;
              } else {
                setTimeout(() => {
                  let trigger = true;
                  props.changingTableState(trigger, "CHANGE_PA_FILE");
                }, 0);
                dispatch({ type: CHANGE_PA_FILE, payload: !changeFile });
                await props.setRefresh(true);
                setloading(false);
                callMessageOut(
                  "success",
                  `${t("personal")} ${t("file_created_successfully!")}`
                );
              }
            });
    },
  });

  const callMessageOut = (type, msg) => {
    dispatch(setSnackbar(true, type, msg));
  };

  return (
    <div classes={classes.root}>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TextField
            {...configData}
            variant="outlined"
            multiline
            minRows={3}
            name="subject"
            label={t("subject")}
            value={formik.values.subject}
            onChange={formik.handleChange}
            error={formik.touched.subject && Boolean(formik.errors.subject)}
            helperText={formik.touched.subject && formik.errors.subject}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="PA_fileForm_reset"
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
            id="personalFile_update"
            className="submitButton"
            color="primary"
            variant="outlined"
            type="submit"
            style={{ marginLeft: "1rem" }}
            endIcon={<DoneIcon />}
            disabled={blnDisable}
          >
            {props.updateSubject ? t("update").toUpperCase() : t("submit")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default reduxConnect(mapStateToProps, {
  personalFileFormData,
  changingTableState,
  setRefresh,
  updateSubjectFileForm,
})(PersonalFileForm);
