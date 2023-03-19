import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getbyfilename,
  createPANotingData,
} from "../../../camunda_redux/redux/action";
import { Formik } from "formik";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "../therme-source/material-ui/loading.css";
import { useTranslation } from "react-i18next";
import { Done } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";

const useStyles = makeStyles({});

let newArr = [
  {
    block_number: "200",
    case_no: "",
    cau: "7WG",
    confidential_or_not: "",
    confidential_type: "",
    creater_role: "7wg.hrc.hrc1",
    custodian: "",
    custodian_desig: "",
    d_file_name: null,
    display_file_name: "7WG/C 200/3/HRC BM-I",
    file_bar_code_name: "7WG-C 200-3-HRC BM-I 25-Jan-2023 16:35",
    file_classification: "confidential",
    file_created_date: "25-01-2023 00:00:00",
    file_name: "7WG-C 200-3-HRC",
    filename: "CONFIDENTIAL TESTING",
    fileno: "7WG-C 200-3-HRC BM-I",
    id: "0b00303980112695",
    part_case: 0,
    pkl_branch: "WAC",
    pkl_section: "HRC",
    pkldirectorate: "7WG.HRC",
    sau_code: "HRC",
    type_of_file: "subject",
    volume_no: "1",
  },
  {
    block_number: "101",
    case_no: "",
    cau: "7WG",
    confidential_or_not: "",
    confidential_type: "",
    creater_role: "7wg.hrc.hrc1",
    custodian: "",
    custodian_desig: "",
    d_file_name: null,
    display_file_name: "7WG/101/56/HRC BM-I",
    file_bar_code_name: "7WG-101-56-HRC BM-I 19-Jan-2023 14:18",
    file_classification: "unclassified",
    file_created_date: "19-01-2023 00:00:00",
    file_name: "7WG-101-56-HRC",
    filename: "THIS IS FOR TESTING PURPOSE ONLY",
    fileno: "7WG-101-56-HRC BM-I",
    id: "0b0030398010cf9a",
    part_case: 0,
    pkl_branch: "WAC",
    pkl_section: "HRC",
    pkldirectorate: "7WG.HRC",
    sau_code: "HRC",
    type_of_file: "subject",
    volume_no: "1",
  },
  {
    block_number: "101",
    case_no: "",
    cau: "7WG",
    confidential_or_not: "",
    confidential_type: "",
    creater_role: "7wg.hrc.hrc",
    custodian: "",
    custodian_desig: "",
    d_file_name: null,
    display_file_name: "7WG/101/55/HRC BM-I",
    file_bar_code_name: "7WG-101-55-HRC BM-I 11-Jan-2023 14:46",
    file_classification: "unclassified",
    file_created_date: "11-01-2023 00:00:00",
    file_name: "7WG-101-55-HRC",
    filename: "TEST 11JAN",
    fileno: "7WG-101-55-HRC BM-I",
    id: "0b00303980102586",
    part_case: 0,
    pkl_branch: "WAC",
    pkl_section: "HRC",
    pkldirectorate: "7WG.HRC",
    sau_code: "HRC",
    type_of_file: "subject",
    volume_no: "1",
  },
];

const NofFilesTable = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [tableId, setTableId] = useState("");

  const { theme } = useSelector((state) => state);

  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const bodyFormData = () => {
    const dept = sessionStorage.getItem("pklDirectrate");
    let formData = new FormData();
    let startIndex = currentPage * pageSize + 1;
    let endIndex = (currentPage + 1) * pageSize;

    formData.append("pkldirectorate", dept);
    formData.append("filename", fileName);
    formData.append("fileno", fileNo);
    formData.append("startIndex", startIndex);
    formData.append("endIndex", endIndex);
    return formData;
  };

  const getPageCount = () => pageSize * currentPage;

  const nofHandleClick = (e, rowData) => {
    let tempArr = rows.map((item) =>
      item.id === rowData.id
        ? { ...item, isChecked: e.target.checked }
        : { ...item, isChecked: false }
    );
    // if (e.target.checked) {
    setRow(rowData);
    setTableId(rowData.id);
    // } else {
    //   setRow(null);
    //   setTableId("");
    // }
    setRows(tempArr);
  };

  const handleSubmit = () => {
    props.onSelectFileData(row);
    props.onSelectFileID(row);
    props.handleCloseDialog();
  };

  const handleCreateMultiplePartCase = () => {
    const roleName = sessionStorage.getItem("role");
    const groupName = sessionStorage.getItem("department");
    const userName = localStorage.getItem("username");
    for (let i = 0; i < props.selectedList.length; i++) {
      props
        .createPANotingData(
          props.selectedList[i].trackId,
          roleName,
          userName,
          groupName,
          row.filename,
          row.id,
          row.fileno,
          row.custodian,
          false,
          ""
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              if (i + 1 === props.selectedList.length) {
                props.loadInboxTable();
                props.handleCloseDialog();
              }
            }
          } catch (e) {
            callMessageOut(e.message);
          }
        })
        .catch((e) => {
          callMessageOut(e.message);
        });
    }
  };

  const loadData = () => {
    const pageCount = getPageCount();
    if (!loading) {
      setLoading(true);
      props
        .getbyfilename(bodyFormData())
        .then((res) => {
          console.log(res);
          try {
            if (res.error) {
              callMessageOut(res.error);
              return;
            } else {
              let tempArr = res.data.map((item) => ({
                ...item,
                isChecked: false,
              }));
              setRows(tempArr);
              setTotalCount(res.length);
              setLoading(false);
              setRow(null);
            }
          } catch (e) {
            callMessageOut(e.message);
          }
        })
        .catch((e) => callMessageOut(e.message));
    }

    // let tempArr = newArr.map((item) => ({
    //   ...item,
    //   isChecked: false,
    // }));
    // setRows(tempArr);
    // setTotalCount(tempArr.length);
    // setLoading(false);
    // setRow(null);
  };

  useEffect(() => loadData(), [pageSize, currentPage]);

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  return (
    <>
      <DialogContent dividers style={{ overflow: "hidden" }}>
        <Typography
          style={{ textAlign: "center", paddingBottom: "1rem", opacity: ".7" }}
        >
          {t("please_select_the_file_to_create_partcase_form")}
        </Typography>
        <Formik
          initialValues={{ fileName: "", fileNo: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setFileName(values.fileName);
            setFileNo(values.fileNo);
            setTimeout(() => {
              setSubmitting(false);
              setCurrentPage(0);
              loadData();
            }, 400);
          }}
        >
          {({}) => (
            <form className={classes.form} autoComplete="off">
              <div>
                <Grid
                  container
                  justifyContent="center"
                  direction="row"
                  style={{ width: "100%" }}
                ></Grid>
              </div>
            </form>
          )}
        </Formik>

        <Box sx={{ height: 310, width: "100%" }} className="cabinate_container">
          <TableContainer
            component={Paper}
            className="inbox-tab"
            elevation={3}
            style={{
              position: "relative",
              borderRadius: "9px",
              border: `1px solid ${theme ? "#727272" : "#c7c7c7"}`,
            }}
          >
            <Table component="div" className="App-main-table">
              <div>
                <div
                  className="nof_table_row head"
                  style={{
                    borderBottom: `1px solid #8080805c`,
                    display: "grid",
                    gridTemplateColumns: "2rem 1fr 1fr",
                    background: "#b1b1b15c"
                  }}
                >
                  <div></div>
                  <div>
                    <span>{t("file_no")}</span>
                  </div>
                  <div>
                    <span>{t("file_name")}</span>
                  </div>
                </div>
              </div>
              <TableBody
                component="div"
                style={{
                  height: "30vh",
                  overflow: "auto",
                }}
              >
                {/* Mapping data coming from backnd */}

                {rows.map((item, i) => {
                  return (
                    <TableRow
                      hover
                      component="div"
                      key={i}
                      selected={item.id === tableId}
                    >
                      <div
                        className="nof_table_row"
                        style={{
                          borderBottom: `1px solid ${
                            theme ? "#727070" : "#c7c7c7"
                          }`,
                          display: "grid",
                          gridTemplateColumns: "2rem 1fr 1fr",
                          alignItems: "center",
                        }}
                      >
                        <div className="checkbox">
                          <FormControlLabel
                            control={
                              <Radio
                                checked={item.isChecked}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nofHandleClick(e, item);
                                }}
                              />
                            }
                          />
                        </div>
                        <div className="info1">
                          <span>{item.fileno}</span>
                        </div>
                        <div className="info2">
                          <span>{item.filename}</span>
                        </div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <PaginationComp
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          id="MultiplePartCase_submit_button"
          variant="contained"
          color={props.multiplePartCase ? "secondary" : "primary"}
          aria-label="submit"
          onClick={
            props.multiplePartCase ? handleCreateMultiplePartCase : handleSubmit
          }
          disabled={!row}
          endIcon={<Done />}
        >
          {props.multiplePartCase ? t("create_part_case_file") : t("submit")}
        </Button>
      </DialogActions>
    </>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}
export default connect(mapStateToProps, { getbyfilename, createPANotingData })(
  NofFilesTable
);
