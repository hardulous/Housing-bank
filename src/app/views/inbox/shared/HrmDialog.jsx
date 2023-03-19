import {
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Fab,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import { Autocomplete } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import SendIcon from "@material-ui/icons/Send";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import CloseIcon from "@material-ui/icons/Close";
import "./Hrm.css";
import {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  sendFilesSection,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
} from "../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import history from "../../../../history";
import { Loading } from "../therme-source/material-ui/loading";
import SelectFile from "./SelectFile";
import PaFlowDialog from "./PaFlowDialof";
import { Add, Done, RateReviewOutlined } from "@material-ui/icons";
import Axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { debounce } from "utils";
import { useCallback } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  remark_title: {
    display: "flex",
    justifyContent: "space-between",
    gap: "2rem",
    alignItems: "center",
  },
}));

const HrmDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [value, setValue] = useState(0);
  const [intService, setIntService] = useState("");
  const [intServiceList, setIntServiceList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [intServiceFavouriteList, setIntServiceFavouriteList] = useState([]);
  const [favIntServiceDepName, setFavIntServiceDepName] = useState("");
  const [favIntServiceObj, setFavIntServicObj] = useState([]);
  const [section, setSection] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [sectionFavouriteList, setSectionFavouriteList] = useState([]);
  const [favSectionObj, setFavSectionObj] = useState([]);
  const [service, setService] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [serviceObj, setServiceObj] = useState([]);
  const [favService, setFavService] = useState("");
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);
  const [favServiceObj, setFavServiceObj] = useState([]);
  const [favServiceDepName, setFavServiceDepName] = useState("");
  const [blnDisable, setBlnDisable] = useState(true);
  const [blnNextDisable, setBlnNextDisable] = useState(true);
  const [sameDep, setSameDep] = useState(true);
  const [addFavBlnDisable, setAddFavBlnDisable] = useState(true);
  const [deleteFavBlnDisable, setDeleteFavBlnDisable] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectFileDialog, setSelectFileDialog] = useState(false);
  const [paFlowDialog, setPaFlowDialog] = useState(false);

  const [addRemark, setaddRemark] = useState(false); // toggle add remark dialog
  const [sendToDep, setsendToDep] = useState(""); // to know whether sending file to same dept user
  const [remark, setremark] = useState(""); // remark message to be send

  const initialValue = {
    remark: "",
  };

  const hrmRole = Cookies.get("HrmRole");
  let hasCoverNote = Cookies.get("hasCoverNote");
  const sessionRole = sessionStorage.getItem("role");
  const inboxid = sessionStorage.getItem("InboxID");
  const Dept = sessionStorage.getItem("department");
  const username = localStorage.getItem("username");

  const validationSchema = Yup.object({
    remark: Yup.string(t("enter_a_remark"))
      .trim()
      .required(t("must_enter_a_valid_remark")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    // onSubmit: handleAddRemark,
  });

  const callMessageOut = (msg) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", msg));
  };

  const callMessageSuccess = () => {
    dispatch(setSnackbar(true, "success", "File has been send successfully!"));
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  // async function handleAddRemark(data, action) {
  //   console.log(data, action);
  //   const DATA = await Axios.post(
  //     "/partcase_service/api/add-remarks",
  //     {
  //       comment: data.remark,
  //       department:sessionStorage.getItem("department"),
  //       pcId: sessionStorage.getItem("partcaseID"),
  //       by:sessionStorage.getItem("role")
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
  //         sendTo:sendToDep
  //       },
  //     }
  //   );
  //   console.log(DATA)
  //   setaddRemark(false)
  //   action.resetForm()
  // }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setremark("");
    setsendToDep("");
    setSection("");
    setIntService("");
    setService("");
    setFavSection("");
    setFavIntService("");
    setFavService("");
  };

  const handleChangeIndex = (index) => {
    setValue(index);
    setremark("");
    setsendToDep("");
  };

  const fetchFavourite = async () => {
    await props
      .fetchFavouriteList(sessionRole)
      .then((resp) => {
        const { internalServiceFavourite, sectionFavourite, serviceFavourite } =
          resp.favourite;
        setSectionFavouriteList(sectionFavourite);
        setServiceFavouriteList(serviceFavourite);
        setIntServiceFavouriteList(internalServiceFavourite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchFavourite();
  }, []);

  useEffect(() => {
    if (
      service ||
      section ||
      intService ||
      favSection ||
      favService ||
      favIntService
    ) {
      setBlnDisable(false);
    } else {
      setBlnDisable(true);
    }

    if (section || favSection) {
      if (sameDep) {
        setBlnNextDisable(true);
      } else {
        setBlnNextDisable(false);
      }
    } else {
      setBlnNextDisable(true);
    }

    if (service || section || intService) {
      setAddFavBlnDisable(false);
    } else {
      setAddFavBlnDisable(true);
    }

    if (favSection || favService || favIntService) {
      setDeleteFavBlnDisable(false);
    } else {
      setDeleteFavBlnDisable(true);
    }
  }, [section, service, intService, favIntService, favSection, favService]);

  console.log(sameDep);

  const handleClearList = (type) => {
    switch (type) {
      case "service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "section":
        return (
          setService(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "internal_service":
        return (
          setSection(""),
          setService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_service":
        return (
          setSection(""),
          setIntService(""),
          setService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_section":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setService(""),
          setFavIntService("")
        );
      case "fav_internal_service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setService("")
        );
      default:
        break;
    }
  };

  const handleInputValueChangeInternalService = async (newValue) => {
    if (newValue && newValue.length >= 3) {
      const dept = sessionStorage.getItem("department");
      await props.getInternalServiceNumber(newValue, dept).then((resp) => {
        let tmpArray = [];
        setIntServiceObj(resp.data);
        for (var i = 0; i < resp.data.length; i++) {
          tmpArray.push(
            `${resp.data[i].deptUsername} | ${resp.data[i].deptRole} | ${resp.data[i].deptName}`
          );
        }
        setIntServiceList(tmpArray);
      });
      setSectionList([]);
      setServiceList([]);
    }
  };

  const handleOnChangeInternalService = async (newValue) => {
    let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    let deptName = !isNullOrUndefined(newValue) && newValue.split(" | ")[2];
    setRole(roleData);
    let data =
      !isNullOrUndefined(newValue) &&
      newValue.substr(0, newValue.indexOf(" |"));
    setIntService(data);
    setsendToDep(deptName);
    newValue && newValue.length > 0 && handleClearList("internal_service");
  };

  const handleOnChangeFavInternalService = async (value) => {
    setFavIntService(value);
    handleClearList("fav_internal_service");
    const dept = sessionStorage.getItem("department");
    await props
      .getInternalServiceNumber(value, dept)
      .then((resp) => {
        setFavIntServicObj(resp.data);
        const data =
          resp.data && resp.data.find((ele) => ele.deptUsername === value);
        setFavIntServiceDepName(data.deptName);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputValueChange = async (newValue) => {
    // const dept = sessionStorage.getItem("department");
    if (newValue && newValue.length >= 3) {
      let formData = new FormData();
      formData.append("sau", newValue);
      await props.getGroupList(formData).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(error.message);
          } else {
            setSectionObj(resp.data);
            let tmpArray = [];
            for (var i = 0; i < resp.data.length; i++) {
              // if(resp.data[i].deptName !== dept){
              tmpArray.push(
                `${resp.data[i].deptDisplayName} | ${resp.data[i].deptCoordRole} | ${resp.data[i].deptName}`
              );
              // }
            }
            setSectionList(tmpArray);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
      setServiceList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChange = (newValue) => {
    console.log(newValue);
    let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    let checkDep = !isNullOrUndefined(newValue) && newValue.split(" | ")[2];
    setRole(roleData);
    console.log(props.departmentList);
    let strSection =
      !isNullOrUndefined(newValue) &&
      newValue.substr(0, newValue.indexOf(" |"));
    let val = props.departmentList?.some((item) => item === checkDep);
    setSection(strSection);
    setsendToDep(checkDep);
    setSameDep(val);
    newValue && newValue.length > 0 && handleClearList("section");
  };

  const handleOnChangeFavSection = async (value) => {
    setFavSection(value);
    handleClearList("fav_section");
    await props
      .getSection(value)
      .then((resp) => {
        setFavSectionObj(resp.data);
        let data = resp.data && resp.data.find((ele) => ele.deptName === value);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDisableRemark = () => {
    if (value === 0) {
      return false;
    } else if (value === 1 && sendToDep !== Dept) {
      return true;
    } else if (value === 2 && sendToDep !== Dept) {
      return true;
    } else if (sendToDep === Dept) {
      return false;
    }
  };

  // console.log(value, sameDep, sendToDep, Dept);

  const handleInputValueChangeService = async (newValue) => {
    if (newValue && newValue.length >= 3) {
      await props.getServiceNumber(newValue).then((resp) => {
        console.log({ resp });
        let tmpArray = [];
        const response = resp.data;
        setServiceObj(response);
        for (var i = 0; i < resp.data.length; i++) {
          tmpArray.push(
            `${resp.data[i].deptUsername} | ${resp.data[i].deptRole} | ${resp.data[i].deptName}`
          );
        }
        setServiceList(tmpArray);
      });
      setSectionList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChangeService = (newValue) => {
    let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
    let deptName = !isNullOrUndefined(newValue) && newValue.split(" | ")[2];
    setRole(roleData);
    let data =
      !isNullOrUndefined(newValue) &&
      newValue.substr(0, newValue.indexOf(" |"));
    setService(data);
    setsendToDep(deptName);
    newValue && newValue.length > 0 && handleClearList("service");
  };

  const handleOnChangeFavService = async (value) => {
    setFavService(value);
    handleClearList("fav_service");
    await props
      .getServiceNumber(value)
      .then((resp) => {
        setFavServiceObj(resp.data);
        let data =
          resp.data && resp.data.find((ele) => ele.deptUsername === value);
        setFavServiceDepName(data.deptName);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddToFavourite = async () => {
    setLoading(true);
    let data = section
      ? section
      : service
      ? service
      : intService
      ? intService
      : "";
    let type = section
      ? "section"
      : service
      ? "service"
      : intService
      ? "internalService"
      : "";
    await props
      .addToFavourite(data, sessionRole, type)
      .then((resp) => {
        console.log(resp);
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            fetchFavourite();
            setLoading(false);
            dispatch(
              setSnackbar(true, "success", "Add to favourite list successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteFavourite = () => {
    setLoading(true);
    let data = favSection
      ? favSection
      : favService
      ? favService
      : favIntService
      ? favIntService
      : "";
    let type = favSection
      ? "section"
      : favService
      ? "service"
      : favIntService
      ? "internalService"
      : "";
    props
      .deleteFavourite(data, sessionRole, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            fetchFavourite();
            setFavSection("");
            setFavService("");
            setFavIntService("");
            setLoading(false);
            dispatch(
              setSnackbar(
                true,
                "success",
                "Delete to favourite list successfully"
              )
            );
          }
        } catch (error) {
          callMessageOut(resp.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSend = (val, flagNumber, isReturn) => {
    // debugger
    setLoading(true);
    const inboxId = sessionStorage.getItem("InboxID");
    const inboxids = JSON.parse(sessionStorage.getItem("InboxIDS"));
    if (inboxids) {
      inboxids.forEach((inbox) => {
        handleSendType(val, flagNumber, isReturn, inbox);
      });
    } else if (inboxId) {
      handleSendType(val, flagNumber, isReturn, inboxId);
    }
  };

  // here below inbox can be either id or object
  const handleSendType = (val, flagNumber, isReturn, inbox) => {
    flagNumber = flagNumber ? flagNumber : null;
    const canSendRemark = !handleDisableRemark();
    const remarkBody = {
      comment: formik.getFieldMeta("remark").value,
      department: sessionStorage.getItem("department"),
      pcId: sessionStorage.getItem("partcaseID"),
      by: sessionStorage.getItem("role"),
    };

    let body = canSendRemark ? remarkBody : null;
    console.log(canSendRemark);
    console.log(body);

    let group = serviceObj.find((data) => data.deptRole === role);
    let intGroup = intServiceObj.find((data) => data.deptRole === role);
    let sectionGroup = sectionObj.find(
      (data) => data.deptDisplayName === section
    );
    const partcaseID = sessionStorage.getItem("partcaseID");
    const fromRole = sessionStorage.getItem("role");

    const id = typeof inbox === "object" ? inbox.id : inbox;
    const fileName =
      typeof inbox === "object" ? inbox.referenceNumber : props.pfileName;

    if (section.length > 0) {
      const sectionData = {
        groupName: sectionGroup.deptName,
        roleName: role,
        fromRole: fromRole,
        displayDeptName: sectionGroup.deptDisplayName,
        displayRoleName: sectionGroup.deptRoleDisplayName,
      };
      props
        .sendFilesSection(
          id,
          sectionData,
          sessionRole,
          Dept,
          username,
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          console.log("resp", resp);
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (service.length > 0 || isReturn) {
      console.log(group);
      const serviceNumberData = {
        groupName: isReturn ? "" : group?.deptName,
        roleName: role,
        userName: service,
        fromRole: fromRole,
        displayDeptName: isReturn ? "" : group?.deptDisplayName,
        displayRoleName: isReturn ? "" : group?.deptRoleDisplayName,
      };
      props
        .sendFilesServiceNumber(
          id,
          serviceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          props.serviceLetterId,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(resp.error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (intService.length > 0) {
      const intServiceNumberData = {
        groupName: intGroup.deptName,
        roleName: role,
        userName: intService,
        fromRole: fromRole,
        displayDeptName: intGroup.deptDisplayName,
        displayRoleName: intGroup.deptRoleDisplayName,
      };
      props
        .sendFilesInternalServiceNumber(
          id,
          intServiceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (favSection.length > 0) {
      const favData = {
        groupName: favSection,
        roleName: favSectionObj[0].deptCoordRole,
        fromRole: fromRole,
        displayDeptName: favSectionObj[0].deptDisplayName,
        displayRoleName: favSectionObj[0].deptRoleDisplayName,
      };
      props
        .sendFilesSection(id, favData, val, fileName, flagNumber)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              setRole("");
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (favService.length > 0) {
      const favData = {
        groupName: favServiceDepName,
        roleName: favServiceObj[0].deptRole,
        userName: favService,
        fromRole: fromRole,
        displayDeptName: favServiceObj[0].deptDisplayName,
        displayRoleName: favServiceObj[0].deptRoleDisplayName,
      };
      props
        .sendFilesServiceNumber(id, favData, val, fileName, flagNumber)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              setRole("");
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (favIntService.length > 0) {
      console.log(favIntServiceObj);
      const intServiceNumberData = {
        groupName: favIntServiceDepName,
        roleName: favIntServiceObj[0].deptRole,
        userName: favIntService,
        fromRole: fromRole,
        displayDeptName: favIntServiceObj[0].deptDisplayName,
        displayRoleName: favIntServiceObj[0].deptRoleDisplayName,
      };
      props
        .sendFilesInternalServiceNumber(
          id,
          intServiceNumberData,
          val,
          fileName,
          flagNumber
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              setRole("");
              callMessageSuccess();
              props.handleClose();
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const approveRejectMessage = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const handleSendConfirmation = (value) => {
    setOpenConfirmation(false);
    setLoading(true);
    const inboxId = sessionStorage.getItem("InboxID");
    if (value != null) {
      props.PCFileClosuer(inboxId, value, props.pfileName).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          if (value === "Approved") {
            approveRejectMessage("File has been approved successfully");
          } else if (value === "Rejected") {
            approveRejectMessage("File has been rejected ");
          }

          if (resp) {
            setLoading(false);
          }
          history.push({ pathname: "/eoffice/inbox/file" });
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    }
  };

  const handleApprove = () => {
    if (props.serviceLetterId) {
      setSelectFileDialog(true);
    } else {
      handleSendConfirmation("Approved");
    }
  };

  // Optimized debounce function
  const optimizedInternalService = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );

  const optimizedSectionList = useCallback(
    debounce(handleInputValueChange),
    []
  );

  const optimizedChangeService = useCallback(
    debounce(handleInputValueChangeService),
    []
  );

  return (
    <div>
      {loading && <Loading />}
      <DialogContent dividers>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t("internal")} {...a11yProps(0)} />
          <Tab label={t("external")} {...a11yProps(1)} />
          <Tab label={t("eyes_only")} {...a11yProps(2)} />
        </Tabs>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={intServiceList}
                    getOptionLabel={(option) => {
                      return typeof option === "string" ? option : "";
                    }}
                    id="tags-outlined"
                    value={intService}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedInternalService(newInputValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip title={t("add_to_favourite")}>
                  <span>
                    <IconButton
                      id="inbox_add_to_favourite"
                      color="secondary"
                      disabled={addFavBlnDisable}
                      onClick={handleAddToFavourite}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={intServiceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    value={favIntService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavInternalService(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="inbox_delete_favourite"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={sectionList}
                    getOptionLabel={(option) => {
                      return typeof option === "string" ? option : "";
                    }}
                    value={section}
                    id="tags-outlined"
                    onChange={(event, newValue) => {
                      handleOnChange(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSectionList(newInputValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_section")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip title={t("add_to_favourite")}>
                  <span>
                    <IconButton
                      id="AddToFavourite_button"
                      color="secondary"
                      disabled={addFavBlnDisable}
                      onClick={handleAddToFavourite}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={sectionFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    value={favSection}
                    onChange={(event, newValue) => {
                      handleOnChangeFavSection(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="DeleteFavourite_button"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={serviceList}
                    getOptionLabel={(option) => {
                      return typeof option === "string" ? option : "";
                    }}
                    id="tags-outlined"
                    value={service}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedChangeService(newInputValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip title={t("add_to_favourite")}>
                  <span>
                    <IconButton
                      id="inbox_addFav_button"
                      color="secondary"
                      disabled={addFavBlnDisable}
                      onClick={handleAddToFavourite}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon={true}
                    options={serviceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    value={favService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavService(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="inbox_delFav_button"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
        </SwipeableViews>
      </DialogContent>
      <DialogActions>
        <Button
          id="hrm_add_remark_button"
          variant="contained"
          color="secondary"
          disabled={handleDisableRemark()}
          onClick={() => setaddRemark(true)}
          endIcon={<RateReviewOutlined />}
        >
          {t("Add Remark")}
        </Button>

        <Button
          id="inbox_end_task_button"
          variant="contained"
          color="secondary"
          style={{
            display: `${sessionRole === hrmRole ? "" : "none"}`,
          }}
          onClick={() =>
            props.serviceLetterId
              ? setPaFlowDialog(true)
              : setOpenConfirmation(true)
          }
          endIcon={<MailOutlineIcon />}
        >
          {t("end_task")}
        </Button>

        <Button
          id="send_to_next_level_button"
          variant="contained"
          color="secondary"
          style={{
            display: `${hasCoverNote === "true" ? "" : "none"}`,
          }}
          disabled={blnNextDisable}
          onClick={() => setSelectFileDialog(true)}
          endIcon={<MailOutlineIcon />}
        >
          {t("send_to_next_level")}
        </Button>
        <Button
          id="inbox_HrmDialog_send_button"
          variant="contained"
          color="primary"
          onClick={() => handleSend(false)}
          disabled={blnDisable}
          endIcon={<SendIcon />}
        >
          {t("send")}
        </Button>
      </DialogActions>

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
            id="inbox_HrmDialog_close_button"
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
          {props.status === "Approved" || props.status === "Rejected" ? (
            <Button
              id="inbox_fileStatus_done_button"
              variant="outlined"
              endIcon={<Done />}
              color="primary"
              onClick={() => handleSendConfirmation(props.status)}
            >
              Submit
            </Button>
          ) : (
            <FormControl component="fieldset">
              <RadioGroup row>
                <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t("rejectConfirmation")}
                  value="Rejected"
                  onClick={() => handleSendConfirmation("Rejected")}
                />
                <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t("approveConfirmation")}
                  value="Approved"
                  onClick={handleApprove}
                />

                <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t("SEND TO")}
                  disabled={blnDisable}
                  value="Send"
                  onClick={() => handleSend(false)}
                />
              </RadioGroup>
            </FormControl>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={selectFileDialog}
        onClose={() => setSelectFileDialog(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle
          style={{
            cursor: "move",
          }}
          id="draggable-dialog-title"
        >
          <span>{t("select_file")}</span>
          <IconButton
            id="inbox_fileDialog_close_button"
            aria-label="close"
            onClick={() => setSelectFileDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <SelectFile
          enclosureArr={props.enclosureArr}
          handleSend={handleSend}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={paFlowDialog}
        onClose={() => setPaFlowDialog(false)}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("Select File")}
          <IconButton
            id="PAFlowDialog_close_button"
            aria-label="close"
            onClick={() => setPaFlowDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <PaFlowDialog
          enclosureArr={props.enclosureArr}
          handleSend={handleSend}
          setService={setService}
          inboxId={inboxid}
          pfileName={props.pfileName}
          approveRejectMessage={approveRejectMessage}
        />
      </Dialog>

      <Dialog
        open={addRemark}
        onClose={() => {
          setaddRemark(false);
        }}
      >
        <DialogTitle>
          <Box className={classes.remark_title}>
            {t("WRITE INTERNAL REMARK")}
            <IconButton
              id="remark-close-button"
              aria-label="close"
              onClick={() => {
                setaddRemark(false);
              }}
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="remark"
            error={
              formik.touched.remark ? Boolean(formik.errors.remark) : false
            }
            name="remark"
            label={t("remark")}
            value={formik.values.remark}
            onChange={formik.handleChange}
            multiline
            minRows={10}
            variant="outlined"
          />
          <div style={{ fontSize: "small", color: "red", textAlign: "start" }}>
            {formik.touched.remark && Boolean(formik.errors.remark)
              ? formik.errors.remark
              : ""}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            id="remark_add_done_button"
            variant="outlined"
            endIcon={<Add />}
            color="primary"
            onClick={() => setaddRemark(false)}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme };
}

export default connect(mapStateToProps, {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  sendFilesSection,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
})(HrmDialog);

// NOTE:::::

// working with formik never make handler function as arrow function as formik handler function does not work well with arrow function so always use simple js function
