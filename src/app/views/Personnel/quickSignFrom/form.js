import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
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
    color: "black",
  },
}));

const FormikRadioGroup = ({
  field,
  name,
  options,
  children,
  theme,
  t,
  ...props
}) => {
  const fieldName = name || field.name;

  const renderOptions = (options) => {
    const classes = useStyles();
    return options.map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        control={<Radio color="primary" />}
        label={option}
        style={{ color: { option } }}
        className={
          option === t("red")
            ? classes.red
            : option === t("green")
            ? classes.green
            : option === t("black")
            ? classes.black
            : classes.blue
        }
      />
    ));
  };

  return (
    <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
      <FormLabel
        component="legend"
        style={{
          display: "flex",
          width: "auto",
          marginRight: "15px",
          color: theme ? "" : "black",
        }}
      >
        {t("color")} :
      </FormLabel>
      <RadioGroup
        {...field}
        {...props}
        name={fieldName}
        style={{ position: "relative", display: "table-cell" }}
      >
        {options ? renderOptions(options) : children}
      </RadioGroup>
    </div>
  );
};

export const Form = (props) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const {
    values: { comments, pencilColorCode },
    errors,
    handleSubmit,
    handleChange,
    blnDisable,
  } = props;

  const options = [t("red"), t("green"), t("blue"), t("black")];

  const [rowHeight, setRowHeight] = useState(14);
  useEffect(() => {
    window.innerWidth >= 1920 ? setRowHeight(14) : setRowHeight(10);
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <DialogContent dividers >
        <TextField
          name="comments"
          error={Boolean(errors.comments)}
          label={t("comment")}
          value={comments || ""}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={rowHeight}
          variant="outlined"
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.comments) ? errors.comments : ""}
        </div>
        <Field
          name="pencilColorCode"
          value={pencilColorCode}
          options={options}
          component={FormikRadioGroup}
          t={t}
          theme={theme}
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.pencilColorCode) ? errors.pencilColorCode : ""}
        </div>
      </DialogContent>
      <DialogActions
      >
        <Button
          id="PA_file_form_sign_btn"
          type="submit"
          variant="outlined"
          color="primary"
          disabled={blnDisable}
          endIcon={<CheckIcon />}
        >
          {t("sign")}
        </Button>
      </DialogActions>
    </form>
  );
};
