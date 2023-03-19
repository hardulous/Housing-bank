import React, { useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { useFormik } from "formik";
import CommentIcon from "@material-ui/icons/Comment";
import CheckIcon from "@material-ui/icons/Check";
import { useSelector, connect, useDispatch } from "react-redux";
import { quickSign } from "../../camunda_redux/redux/action";
import { setSnackbar } from "../..//camunda_redux/redux/ducks/snackbar";
import { Loading } from "./therme-source/material-ui/loading";
import  "./therme-source/material-ui/loading.css";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "420px",
  },
  red: {
    color: "red",
  },
  green: {
    color: "green",
  },
  blue: {
    color: "blue",
  },
  black: {
    color: "#808080",
  },
}));

const SignForm = (props) => {
  const { t } = useTranslation();
  const [pencilColorCode, setPencilColorCode] = useState("blue");
  const { theme } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const initialValues = {
    comments: "",
  };

  const validationSchema = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (data) => {
      let formData = new FormData();
      formData.append("comments", data.comments);
      formData.append("tag", "APPROVED");
      formData.append("signTitle", localStorage.getItem("username")); //data.signTitle
      formData.append("pencilColorCode", pencilColorCode);
      formData.append("username", localStorage.getItem("username"));
      formData.append("color", pencilColorCode);
      formData.append("personalAppliactionFileId", props.fileId);
      formData.append("dep_desc", sessionStorage.getItem("department")); //data.dep_desc
      formData.append("filebytearray", data.filebytearray);
      formData.append("url", props.fileURL);
      formData.append("partCaseFileId", props.fileId);
      formData.append("annexureSign", true);

      const roleName = sessionStorage.getItem("role");
      setloading(true);

      props
        .quickSign(formData, roleName, "", true, props.annexureId)
        .then((resp) => {
          console.log(resp);
          try {
            if (resp.error) {
              callMessageOut("error", resp.error);
              setloading(false);
            } else {
              props.handleAnnexture(resp.file);
              setloading(false);
              // props.loadAnnextureTableData(props.paID, true);
              callMessageOut(
                "success",
                t("sign_successful,_please-wait_till_PDF_renders.")
              );
              props.setOpenSign(false);
            }
          } catch (error) {
            callMessageOut("error", error.message);
            setloading(false);
          }
        })
        .catch((err) => {
          callMessageOut("error", err.message);
          setloading(false);
        });
    },
  });

  const callMessageOut = (type, msg) => {
    dispatch(setSnackbar(true, type, msg));
  };

  const options = [
    { value: "red", label: t("red") },
    { value: "green", label: t("green") },
    { value: "blue", label: t("blue") },
    { value: "black", label: t("black") },
  ];

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {loading && <Loading />}
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="comments"
            name="comments"
            label={t("comment")}
            multiline
            minRows={10}
            variant="outlined"
            value={formik.values.comments}
            onChange={formik.handleChange}
            error={formik.touched.comments && Boolean(formik.errors.comments)}
            helperText={formik.touched.comments && formik.errors.comments}
          />
          <FormControl
            component="fieldset"
            style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}
          >
            <FormLabel component="legend">{t("color")} :</FormLabel>
            <RadioGroup
              aria-label="gender"
              name=""
              row
              value={pencilColorCode}
              onChange={(e) => {
                setPencilColorCode(e.target.value);
              }}
            >
              {options.map((option, i) => (
                <FormControlLabel
                  value={option.value}
                  control={<Radio color="primary" />}
                  label={option.label}
                  key={i}
                  className={
                    option.value === "red"
                      ? classes.red
                      : option.value === "green"
                      ? classes.green
                      : option.value === "black"
                      ? classes.black
                      : classes.blue
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            id="personnel_signForm"
            className="signButton"
            type="submit"
            variant="outlined"
            color="primary"
            endIcon={<CheckIcon />}
          >
            {t("sign")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { quickSign })(SignForm);
// export default SignForm
