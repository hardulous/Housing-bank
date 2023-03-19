import React, { useState, useEffect } from "react";
import {
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  Menu,
  MenuItem,
  TableContainer,
  Table,
  Checkbox,
  TableBody,
  TableRow,
  Grid,
  TableHead,
} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import {
  loadInboxData,
  loadSfdt,
  getReadStatus,
  getPinInboxId,
  getFlagStatus,
} from "../../../camunda_redux/redux/action";
import history from "../../../../history";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import { setInboxDatas } from "../../../redux/actions/InboxActions";
import { changingTableStateInbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import "../therme-source/material-ui/loading.css";
import { RiFlag2Fill, RiMailOpenLine, RiFlag2Line } from "react-icons/ri";
import { AiFillPushpin, AiOutlineMail, AiOutlinePushpin } from "react-icons/ai";
import DraftsIcon from "@material-ui/icons/Drafts";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import ReplyIcon from "@material-ui/icons/Reply";
import PaginationComp from "app/views/utilities/PaginationComp";
import HrmDialog from "./HrmDialog";
import { unstable_batchedUpdates } from "react-dom";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import Draggable from "react-draggable";
import NofFilesTable from "./NofFilesTable";
import { clearCookie } from "utils";

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

const InboxTable = (props) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [inboxId, setInboxId] = useState("");
  const dispatch = useDispatch();
  const { blnValueInbox } = props.subscribeApi;
  const { personalId, annotationId, blnShowPdf } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, SetAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("All");
  const [selectedList, setSelectedList] = useState([]); // use to keep track of checkbox selected rowData but will store only unique identity of each row for better performance and to avoid use of loop
  const [pinListener, setPinListener] = useState(false);
  const [nofDialog, setNofDialog] = useState(false);
  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  const department = sessionStorage.getItem("department");

  // Filter State Variables
  const [Filter, setFilter] = useState(false);

  const openMenu = Boolean(anchorEl);

  let ClickTimer;
  let preventClick = false;

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "referenceNumber",
      label: "ReferenceNumber",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "from",
      label: "From",
    },
    {
      value: "type",
      label: "Type",
    },
    {
      value: "createdOn",
      label: "Created On",
    },
    {
      value: "priority",
      label: "Priority",
    },
  ];

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
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "referenceNumber",
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
      name: "type",
      type: "select",
      optionValue: ["File", "Service Letter", "PA"],
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "from",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "priority",
      type: "select",
      optionValue: ["low", "medium", "high"],
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

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

  const addSort = (sortObj) => {
    console.log(sortObj);
    setSortBy(sortObj);
  };

  const SortValueTypes = [
    {
      name: "pFileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "PFilename",
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
      label: "CreatedOn",
    },
  ];

  const NestedSort = [
    {
      name: "All",
      onClick: handleMenuClose,
    },
    {
      name: "Unread",
      onClick: handleMenuClose,
    },
    {
      name: "Flagged",
      onClick: handleMenuClose,
    },
  ];

  // Filter State Variables

  // state Variable which get track of sort option with orderBy
  const [SortBy, setSortBy] = useState({});

  useEffect(
    () => loadInboxTable(),
    [blnValueInbox, currentPage, pageSize, selectedMenuItem, Filter, SortBy]
  );

  const loadInboxTable = () => {
    props.handleLoading(true);
    setRowData([]);
    props
      .loadInboxData(role, userName,department, pageSize, currentPage, selectedMenuItem, {
        filter: _.isEmpty(Filter) ? null : Filter,
        sort: _.isEmpty(SortBy) ? null : SortBy,
      })
      .then((resp) => {
        const tmpArr = [];
        try {
          if (resp.response.Data !== undefined) {
            props.handleLoading(false);
            for (var i = 0; i < resp.response.Data.length; i++) {
              tmpArr.push({ ...resp.response.Data[i], isChecked: false });
            }
            props.changingTableStateInbox(false, "CHANGE_INBOX");
            blnShowPdf(true);
            setTotalCount(resp.response.length);
            if (tmpArr.length > 0) {
              annotationId(tmpArr[0].annotationId);
              personalId(tmpArr[0].personalApplicationInventoryId);
              setInboxId(tmpArr[0].id);
              let data = { extension: "docx", url: tmpArr[0].personalUrl };
              dispatch(setPassData(data));
            }
          } else {
            const errorMessage =
              resp.response.status +
              " : " +
              resp.response.error +
              " AT " +
              resp.response.path;
            callMessageOut(errorMessage);
          }
          setRowData(tmpArr);
        } catch (e) {
          callMessageOut(e.message);
        }
      });
  };

  const callMessageOut = (message) => {
    props.handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    clearCookie();
  }, []);

  const handleOnRowClick = (rowData) => {
    ClickTimer = setTimeout(() => {
      if (!preventClick) {
        // the reasone for this because with event double click single click event will be registerted 2 times
        annotationId(rowData.annotationId);
        setInboxId(rowData.id);
        personalId(rowData.personalApplicationInventoryId);
        let data = { extension: "docx", url: rowData.personalUrl };
        dispatch(setPassData(data));
      }
      preventClick = false;
    }, 200);
  };

  const handleOnRowDoubleClick = (rowData) => {
    clearTimeout(ClickTimer);
    preventClick = true;
    sessionStorage.removeItem("InboxIDS");
    props.setInboxDatas(rowData);
    if (
      rowData.personalApplicationInventoryId !== undefined &&
      rowData.personalApplicationInventoryId !== ""
    ) {
      sessionStorage.setItem("InboxID", rowData.id);
      sessionStorage.setItem("pa_id", rowData.personalApplicationInventoryId);
      Cookies.set("inboxFile", rowData.subject);
      Cookies.set("priority", rowData.priority);
      Cookies.set("referenceNumber", rowData.referenceNumber);
      Cookies.set("type", rowData.type);
      Cookies.set("partCase", false);
      Cookies.set("status", rowData.statuss);

      if (rowData.type === "RTI") {
        Cookies.set("isRti", true);
        Cookies.set("partcaseId", rowData.partCase);
      }
      rowData.type === "PA"
        ? history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: rowData.id,
          })
        : rowData.type === "File"
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: rowData.subject,
          })
        : rowData.type === "RTI"
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: rowData.partcase,
          })
        : rowData.pcCoverNote === true
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: rowData.id,
          })
        : history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: rowData.id,
          });
    } else {
      const errorMessage = `${t("ID_is_undefined_please_refresh_page")} !`;
      callMessageOut(errorMessage);
    }
  };

  function handleReadUnread(inboxIds, value, selectCheckBox) {
    let tempArr = [];
    props.handleLoading(true);
    props
      .getReadStatus(inboxIds, value)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          if (selectCheckBox) {
            tempArr = rowData;
            for (let id of inboxIds) {
              tempArr = tempArr.map((item) =>
                item.id === id ? { ...item, read: true } : item
              );
            }
          } else {
            tempArr = rowData.map((item) =>
              item.id === inboxIds[0] ? { ...item, read: value } : item
            );
          }
          setRowData(tempArr);
          props.handleLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  }

  const handleReadAll = () => {
    let tmpArr = [];
    selectedList.map((item) => {
      tmpArr.push(item.id);
    });
    handleReadUnread(tmpArr, true, true);
  };

  const handlePin = (id) => {
    props
      .getPinInboxId(id)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(e.message);
          }
          setPinListener(!pinListener);
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleFlag = (id) => {
    props.handleLoading(true);
    props
      .getFlagStatus(id)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(e.message);
          } else {
            let tmpArr = rowData.map((item) =>
              item.id === id ? { ...item, flag: !item.flag } : item
            );
            setRowData(tmpArr);
            props.handleLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleClickOpenDialog = () => {
    setOpen(true);
    sessionStorage.setItem("InboxIDS", JSON.stringify(selectedList));
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    if (event.target.innerText != "") {
      setSelectedMenuItem(event.target.innerText);
      setCurrentPage(0);
    }
    SetAnchorEl(null);
  };

  const handleFilterOpen = (event) => {
    SetAnchorEl(event.currentTarget);
  };

  const CheckBoxSelection = (event, unique) => {
    let tempArr = rowData.map((item) =>
      item.id === unique.id ? { ...item, isChecked: !item.isChecked } : item
    );
    if (event.target.checked) {
      setSelectedList([...selectedList, unique]);
    } else {
      let checkData = selectedList.filter((item) => item.id !== unique.id);
      setSelectedList(checkData);
    }
    setRowData(tempArr);
  };

  const CheckBoxSelectAll = (e) => {
    console.log(e.target.checked);
    const newSelecteds = rowData.map((item) => ({
      ...item,
      isChecked: e.target.checked,
    }));
    setRowData(newSelecteds);
    if (e.target.checked) {
      setSelectedList(newSelecteds);
    } else {
      setSelectedList([]);
    }
  };

  const handleNofDialog = () => {
    setNofDialog(!nofDialog);
  };

  const handleIconsVisibility = (item) => item.type === "PA";

  return (
    <div
      className="inbox_table"
      id="inbox_table"
      style={{ position: "relative", height: "100%" }}
    >
      <Paper
        className="inbox_paper"
        style={{
          borderRadius: "8px",
        }}
      >
        <div
          className="InboxHeader"
          // style={{
          //   borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
          // }}
        >
          <div className="headChild1">
            <Grid container>
              <Grid item xs={7}>
                <GenericSearch
                  FilterTypes={FilterTypes}
                  FilterValueTypes={FilterValueTypes}
                  addFilter={addFilter}
                  cssCls={{}}
                />
              </Grid>
              <Grid
                item
                xs="auto"
                style={{
                  marginLeft: "auto",
                }}
              >
                <div>
                  {selectedList.length > 0 && (
                    <div>
                      <Tooltip title="Marks as Read" arrow>
                        <IconButton
                          id="inbox_Mark_as_Read_button"
                          onClick={handleReadAll}
                        >
                          <DraftsIcon className="inbox_header_icons" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Farward" arrow>
                        <IconButton
                          id="inbox_reply_button"
                          onClick={() => handleClickOpenDialog()}
                          style={{
                            display: selectedList.some(handleIconsVisibility)
                              ? "none"
                              : "initial",
                          }}
                        >
                          <ReplyIcon
                            className="inbox_header_icons"
                            style={{ transform: "rotateY(180deg)" }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save All" arrow>
                        <IconButton
                          id="inbox_Nof_Save_Button"
                          className="checkbox_action_icons"
                          style={{
                            display: !selectedList.every(handleIconsVisibility)
                              ? "none"
                              : "",
                          }}
                          onClick={handleNofDialog}
                        >
                          <SaveIcon className="inbox_header_icons" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs="auto">
                <GenericFilterMenu
                  SortValueTypes={SortValueTypes}
                  addSort={addSort}
                  NestedSort={NestedSort}
                />
              </Grid>
            </Grid>
            <GenericChip Filter={Filter} deleteChip={deleteChip} />
          </div>
        </div>
        <div style={{ padding: "0 1rem" }}>
          <TableContainer
            style={{
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
            }}
            component={Paper}
          >
            <Table
              component="div"
              className="inbox_custom_table App-main-table"
              aria-label="simple table"
            >
              <TableHead component="div">
                <TableRow component="div" className="inbox_row">
                  <div
                    className="InboxCon"
                    style={{
                      backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                    }}
                  >
                    <div className="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedList.length > 0 &&
                          selectedList.length < rowData.length
                        }
                        checked={
                          rowData.length > 0 &&
                          selectedList.length === rowData.length
                        }
                        onChange={CheckBoxSelectAll}
                      />
                    </div>
                    <div className="info1">
                      <span>{t("from")}</span>
                    </div>
                    <div className="info2">
                      <span>{t("inbox_referenceNumber")}</span>
                    </div>
                    <div className="info3">
                      <span>{t("subject")}</span>
                    </div>
                    <div className="info4">
                      <span>{t("type")}</span>
                    </div>
                    <div className="info4">
                      <span>{t("created_on")}</span>
                    </div>
                    <div className="InboxIcons"></div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                component="div"
                style={{
                  height: "calc(100vh - 260px)",
                  overflowY: "auto",
                }}
              >
                {/* Mapping data coming from backnd */}

                {rowData.map((item, i) => {
                  const sts =
                    !item.read && item.priority == "high"
                      ? "#d73c3c"
                      : !item.read && item.priority
                      ? "#4b4bbf"
                      : !item.read
                      ? "#4b4bbf"
                      : "initial";

                  const StripColor = sts && sts;
                  const bold =
                    sts != "initial"
                      ? {
                          color: StripColor,
                        }
                      : {
                          color: "",
                        };
                  const bold2 =
                    sts != "initial"
                      ? {
                          fontWeight: "bolder",
                        }
                      : {
                          fontWeight: "initial",
                        };

                  return (
                    <TableRow
                      hover
                      component="div"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnRowClick(item);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleOnRowDoubleClick(item);
                      }}
                      selected={item.isChecked}
                      key={i}
                      className="inbox_row"
                    >
                      <div
                        className={`InboxCon body ${
                          item.id === inboxId ? "active" : ""
                        }`}
                        style={{
                          borderBottom: `1px solid ${
                            props.theme ? "#727070" : "#c7c7c7"
                          }`,
                        }}
                      >
                        <div className="checkbox">
                          <Checkbox
                            checked={item.isChecked}
                            onClick={(e) => {
                              e.stopPropagation();
                              CheckBoxSelection(e, item);
                            }}
                          />
                        </div>
                        <div className="info1">
                          <span style={bold2}>{item.from}</span>
                        </div>
                        <div className="info2">
                          <span style={bold2}>{item.referenceNumber}</span>
                        </div>
                        <div className="info3">
                          <span style={bold}>{item.subject}</span>
                        </div>
                        <div className="info4">
                          <span style={bold2}>{item.type}</span>
                        </div>
                        <div className="info4">
                          <span style={bold}>{item.createdOn}</span>
                        </div>
                        <div className="InboxIcons">
                          <IconButton
                            className="InboxBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              item.read
                                ? handleReadUnread([item.id], false, false)
                                : handleReadUnread([item.id], true, false);
                            }}
                          >
                            {item.read ? <AiOutlineMail /> : <RiMailOpenLine />}
                          </IconButton>
                          <IconButton
                            id="inbox_item_flag_button"
                            className="InboxBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFlag(item.id);
                            }}
                          >
                            {item.flag ? <RiFlag2Fill /> : <RiFlag2Line />}
                          </IconButton>
                          <IconButton
                            id="inbox_item_pin_button"
                            className="InboxBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePin(item.id);
                            }}
                          >
                            {item.pin ? (
                              <AiFillPushpin />
                            ) : (
                              <AiOutlinePushpin />
                            )}
                          </IconButton>
                        </div>
                        <div
                          className="strips"
                          style={{
                            background: StripColor,
                          }}
                        ></div>
                      </div>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <PaginationComp
          pageSize={pageSize}
          pageSizes={[5, 10, 15]}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />
      </Paper>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperComponent={PaperComponent}
        onClose={handleDialogClose}
      >
        <DialogTitle
          id="draggable-dialog-title"
          className="dialog_title"
          style={{ cursor: "move" }}
        >
          {t("send_to")}
          <IconButton
            id="inboxTable_close_button"
            onClick={handleDialogClose}
            aria-label="close"
            color="primary"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <HrmDialog checkedData={selectedList} handleClose={handleDialogClose} />
      </Dialog>
      <Dialog
        open={nofDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          onClose={handleNofDialog}
          className="dialog_title"
        >
          <span>{t("part_case_file_creation")}</span>
          <IconButton
            id="part_case_file_close_button"
            aria-label="close"
            onClick={handleNofDialog}
            color="primary"
            style={{ float: "right" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <NofFilesTable
          // onSelectFileData={nofHandleClick}
          // onSelectFileID={(id) => setNofFileID(id)}
          // handleCloseDialog={handleCloseDialog}
          selectedList={selectedList}
          multiplePartCase={nofDialog}
          loadInboxTable={loadInboxTable}
          handleCloseDialog={handleNofDialog}
        />
      </Dialog>
      <Menu
        id="filter_menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={openMenu}
        MenuListProps={{
          "aria-labelledby": "filter_button",
        }}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleMenuClose} style={{ marginLeft: "0.3rem" }}>
          All
        </MenuItem>
        <MenuItem onClick={handleMenuClose} style={{ marginLeft: "0.3rem" }}>
          Unread
        </MenuItem>
        <MenuItem onClick={handleMenuClose} style={{ marginLeft: "0.3rem" }}>
          Flagged
        </MenuItem>
      </Menu>
    </div>
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
  setInboxDatas,
  loadInboxData,
  loadSfdt,
  getReadStatus,
  changingTableStateInbox,
  getPinInboxId,
  getFlagStatus,
})(InboxTable);
// export default InboxTable
