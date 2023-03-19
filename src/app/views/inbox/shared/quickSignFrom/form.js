import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {
  Collapse,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { connect, useSelector } from "react-redux";
import { loadUserRoleData } from "app/camunda_redux/redux/action";
import PaginationComp from "app/views/utilities/PaginationComp";
import { Check } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  red: {
    color: theme ? "#fd3f3f" : "red",
  },
  green: {
    color: theme ? "lime" : "green",
  },
  blue: {
    color: theme ? "#3080ff" : "blue",
  },
  black: {
    color: "#808080",
  },
  checkbox: {
    margin: 0,
    display: "flex",
    gap: "0.4rem",
  },
  table: {
    minWidth: "350px",
  },
}));

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
];

const FormikEyesOnlyGroup = ({
  field,
  name,
  options,
  children,
  theme,
  t,
  ...props
}) => {
  const { setFieldValue } = props.form;
  const fieldName = name || field.name;
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [desigNo, setdesigNo] = useState("");
  const [roleArr, setroleArr] = useState([]);
  const [selectedRoles, setselectedRoles] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    handleChange();
  }, [desigNo]);

  useEffect(() => {
    setFieldValue("sendTo", selectedRoles);
  }, [selectedRoles]);

  const handleChange = () => {
    if (desigNo && desigNo.length >= 3) {
      let tmpArr = [];
      props
        .loadUserRoleData(desigNo)
        .then((resp) => {
          for (var i = 0; i < resp.data.length; i++) {
            tmpArr.push({ ...resp.data[i], isChecked: false });
          }
          setroleArr(tmpArr);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const CheckBoxSelectAll = (e) => {
    console.log(e.target.checked);
    const newSelecteds = roleArr.map((item) => ({
      ...item,
      isChecked: selectedRoles.length !== roleArr.length ? true : false,
    }));
    setroleArr(newSelecteds);
    if (selectedRoles.length !== roleArr.length) {
      setselectedRoles(newSelecteds);
    } else {
      setselectedRoles([]);
    }
  };

  console.log(selectedRoles);

  const CheckBoxSelection = (event, unique) => {
    let tempArr = roleArr.map((item) =>
      item.id === unique.id ? { ...item, isChecked: !item.isChecked } : item
    );
    if (!unique.isChecked) {
      setselectedRoles([...selectedRoles, unique]);
    } else {
      let checkData = selectedRoles.filter((item) => item.id !== unique.id);
      setselectedRoles(checkData);
    }
    setroleArr(tempArr);
  };

  const updateOption = (role, roleArr) => {
    console.log(role);
    console.log(roleArr);
  };

  return (
    <div
      style={{
        margin: "0.6rem 0rem",
      }}
      className="eyes_only_container"
    >
      <TextField
        name="Service Number"
        value={desigNo}
        label={t("Service Number")}
        onChange={(e) => setdesigNo(e.target.value)}
        fullWidth
        size="small"
        variant="outlined"
      />

      <Paper
        style={{
          width: "100%",
          position: "relative",
          borderRadius: "6px",
          border: `1px solid ${props.theme ? "#727272" : "#c7c7c7"}`,
        }}
      >
        <TableContainer component={Paper} className="eyes_only_table">
          <Table
            component="div"
            className={`${classes.table} App-main-table`}
            aria-label="simple table"
          >
            <div>
              <div className="eyes_only_table_head">
                <Checkbox
                  disabled={false}
                  indeterminate={
                    selectedRoles.length > 0 &&
                    selectedRoles.length < roleArr.length
                  }
                  checked={
                    roleArr.length > 0 &&
                    selectedRoles.length === roleArr.length
                  }
                  onChange={CheckBoxSelectAll}
                  style={{
                    marginLeft: "1rem",
                    padding: "0.6rem",
                  }}
                />
                <div>
                  <span>{t("Username")}</span>
                </div>
                <div>
                  <span>{t("User Role")}</span>
                </div>
                <div>
                  <span>{t("User Department")}</span>
                </div>
              </div>
            </div>
            <TableBody
              component="div"
              style={{
                height: "14vh",
              }}
            >
              {/* Mapping data coming from backnd */}
              {roleArr.map((item, i) => {
                // Row defination and styling here
                return (
                  <TableRow
                    hover
                    component="div"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    key={i}
                    style={{
                      border: "1px solid #8080805c",
                      borderWidth: "0px 0px 1px 0px",
                      position: "relative",
                    }}
                    selected={item.isChecked}
                  >
                    <div
                      className="eyes_only_table_row"
                      style={{
                        borderBottom: `1px solid ${
                          props.theme ? "#727070" : "#c7c7c7"
                        }`,
                      }}
                    >
                      <Checkbox
                        checked={item.isChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          CheckBoxSelection(e, item);
                        }}
                        style={{
                          padding: 0,
                          marginLeft: "1.6rem",
                        }}
                      />

                      <div className="eyes_only_info1">
                        <span>{item.deptUsername}</span>
                      </div>
                      <div className="eyes_only_info2">
                        <span>{item.deptRole}</span>
                      </div>
                      <div className="eyes_only_info3">
                        <span>{item.deptName}</span>
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
      </Paper>
    </div>
  );
};

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

  const classes = useStyles();
  const renderOptions = (options) => {
    return options.map((option) => (
      <FormControlLabel
        key={option}
        value={option}
        control={<Radio color="primary" />}
        label={option}
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
    <div style={{ marginTop: "20px" }}>
      <FormLabel
        component="legend"
        style={{ display: "flex", color: theme ? "" : "black" }}
      >
        {t("color")}
      </FormLabel>
      <RadioGroup
        {...field}
        // {...props}
        value={props.value}
        name={fieldName}
        style={{ position: "relative", display: "table-cell" }}
      >
        {options ? renderOptions(options) : children}
      </RadioGroup>
    </div>
  );
};

const Form = (props) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const classses = useStyles();
  const {
    values: { comments, pencilColorCode, eyesOnly, sendTo },
    errors,
    touched,
    handleSubmit,
    handleChange,
    isYloNote,
  } = props;

  const options = [t("red"), t("green"), t("blue"), t("black")];

  return (
    <form onSubmit={handleSubmit}>
      <DialogContent
        dividers
        style={{
          padding: isYloNote ? "0 1rem" : "",
        }}
      >
        {isYloNote && (
          <FormControlLabel
            control={
              <Checkbox
                checked={eyesOnly}
                onChange={handleChange}
                name="eyesOnly"
                color="primary"
              />
            }
            label="Eyes Only"
            className={classses.checkbox}
          />
        )}
        {isYloNote && (
          <Collapse in={eyesOnly}>
            <Field
              name="sendTo"
              value={sendTo}
              loadUserRoleData={props.loadUserRoleData}
              component={FormikEyesOnlyGroup}
              helpertext={touched.sendTo ? errors.sendTo : ""}
              error={Boolean(errors.sendTo)}
              theme={theme}
              t={t}
            />
            <div
              style={{ fontSize: "small", color: "red", textAlign: "start" }}
            >
              {touched.sendTo && Boolean(errors.sendTo) ? errors.sendTo : ""}
            </div>
          </Collapse>
        )}

        <TextField
          name="comments"
          error={touched.comments ? Boolean(errors.comments) : false}
          label={isYloNote ? t("yellow note") : t("comment")}
          value={comments || ""}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={isYloNote ? 2 : 10}
          variant="outlined"
        />

        <div style={{ fontSize: "small", color: "red", textAlign: "start" }}>
          {touched.comments && Boolean(errors.comments) ? errors.comments : ""}
        </div>

        <Field
          name="pencilColorCode"
          value={pencilColorCode}
          options={options}
          component={FormikRadioGroup}
          helpertext={touched.pencilColorCode ? errors.pencilColorCode : ""}
          error={Boolean(errors.pencilColorCode)}
          theme={theme}
          t={t}
        />
        <div style={{ fontSize: "small", color: "red", textAlign: "end" }}>
          {Boolean(errors.pencilColorCode) ? errors.pencilColorCode : ""}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          id="inboxSign_button"
          type="submit"
          variant="outlined"
          color="primary"
          disabled={props.blnDisable}
          endIcon={<Check />}
        >
          {isYloNote ? t("Create") : t("sign")}
        </Button>
      </DialogActions>
    </form>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { loadUserRoleData })(Form);


// NOTE:::

// when working with mui checkbox note that if u want e.target.checked value or onChange to execute then do not change the default mui css of checkbox otherwise some bug will come 