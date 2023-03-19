// import React, { useEffect, useState } from "react";
// import { Autocomplete } from "@material-ui/lab";
// import { Button, Card, TextField, Typography } from "@material-ui/core";
// import SendIcon from "@material-ui/icons/Send";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { connect as reduxConnect, useDispatch } from "react-redux";
// import {
//   getGroupList,
//   sendFiles,
//   addToFavourite,
//   fetchFavouriteList,
//   deleteFavourite,
// } from "../../camunda_redux/redux/action";
// import {
//   changingTableStatePA,
//   changeTableStateDraft,
// } from "../../camunda_redux/redux/action/apiTriggers";
// import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
// import { isNullOrUndefined } from "@syncfusion/ej2-base";
// import { useTranslation } from "react-i18next";
// import ThumbUpIcon from "@material-ui/icons/ThumbUp";
// import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

// const SendFileForm = (props) => {
//   const { t } = useTranslation();
//   const [hobbies, setHobbies] = useState([]);
//   const [values, setValues] = useState([]);
//   const [favouriteList, setFavouriteList] = useState([]);
//   const [deleteFavourite, setDeleteFavourite] = useState("");
//   const username = localStorage.getItem("username");
//   const displayUserName = sessionStorage.getItem("displayUserName");
//   const [addedFavourite, setAddedFavourite] = useState(false);

//   const dispatch = useDispatch();
//   const role = sessionStorage.getItem("role");

//   const initialState = {
//     section: [],
//   };

//   const validation = Yup.object().shape({
//     section: Yup.string()
//       .nullable()
//       .required(`${t("this_field_is_required")} !`),
//   });
//   console.log(props.pfileName);

//   const onHandleSubmit = async (value) => {
//     props.setSend(false);
//     await props
//       .sendFiles(props.fileId, value, role, username, displayUserName, props.pfileName)
//       .then((resp) => {
//         console.log(resp);
//         if (resp.status === "OK") {
//           dispatch(setSnackbar(true, "success", t("file_sent_successfully!")));
//           props.handleCloseEvent(false);
//           let trigger = false;
//           setTimeout(() => {
//             trigger = true;
//             props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
//             props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
//           }, 0);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const formik = useFormik({
//     initialValues: initialState,
//     validationSchema: validation,

//     onSubmit: (value) => onHandleSubmit(value.section.sau),
//   });

//   const formik1 = useFormik({
//     initialValues: initialState,
//     validationSchema: validation,

//     onSubmit: (value) => onHandleSubmit(value.section),
//   });

//   const handleInputChange = async (e) => {
//     if (!isNullOrUndefined(e.target.value)) {
//       if (e.target.value.length > 2) {
//         let formData = new FormData();
//         formData.append("sau", e.target.value);
//         await props.getGroupList(formData).then((resp) => {
//           console.log(resp);
//           let tmpArray = [];
//           for (var i = 0; i < resp.data.length; i++) {
//             tmpArray.push(resp.data[i]);
//           }
//           setHobbies(tmpArray);
//         });
//       }
//     }
//   };

//   const handleAddToFavourite = async (e) => {
//     await props
//       .addToFavourite(values, role, "send")
//       .then((resp) => {
//         console.log(resp);
//         fetchFavourite();
//         setAddedFavourite(true);
//         setValues([]);
//         dispatch(
//           setSnackbar(true, "success", "Added to favourite successfully")
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const fetchFavourite = async () => {
//     await props
//       .fetchFavouriteList(role)
//       .then((resp) => {
//         console.log(resp);
//         setFavouriteList(resp.favourite.sendFavourite);
//         // dispatch(setSnackbar(true, "success", t("Favourite list added!")));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   useEffect(async () => {
//     fetchFavourite();
//   }, []);

//   const handleDeletFavourite = async () => {
//     await props
//       .deleteFavourite(deleteFavourite, role, "send")
//       .then((resp) => {
//         console.log(resp);
//         fetchFavourite();
//         setDeleteFavourite("");
//         dispatch(
//           setSnackbar(true, "success", "Delete to favourite successfully")
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <>
//       <div className="dialog_sendButton">
//         <div style={{ border: "1px solid #b6b6b66b" }}>
//           <Card className="card_1" style={{ padding: "25px" }} elevation={5}>
//             <Typography
//               color="primary"
//               style={{ fontSize: "1.2rem", textAlign: "left" }}
//               className="typography"
//             >
//               DEPARTMENT LIST
//             </Typography>
//             <form onSubmit={formik.handleSubmit} autocomplete="off">
//               <Autocomplete
//                 //   multiple
//                 limitTags={2}
//                 value={formik.values.section}
//                 options={hobbies}
//                 onChange={(_, value) => {
//                   formik.setFieldValue("section", value), setValues(value.sau);
//                 }}
//                 onInputChange={handleInputChange}
//                 name="section"
//                 getOptionLabel={(option) => option.sauDisplayName}
//                 getOptionSelected={(option, value) =>
//                   option.sauDisplayName === value.sauDisplayName
//                 }
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="outlined"
//                     label={t("choose_department")}
//                     margin="normal"
//                     error={
//                       formik.touched.section && Boolean(formik.errors.section)
//                     }
//                     helperText={formik.touched.section && formik.errors.section}
//                   />
//                 )}
//               />
//               <Button
//                 color="primary"
//                 variant="outlined"
//                 type="submit"
//                 style={{ float: "right", marginTop: "1rem" }}
//                 endIcon={<SendIcon />}
//               >
//                 {t("send")}
//               </Button>
//               <Button
//                 color="secondary"
//                 variant="outlined"
//                 onClick={handleAddToFavourite}
//                 style={{
//                   float: "right",
//                   marginTop: "1rem",
//                   marginRight: "1rem",
//                 }}
//                 endIcon={<ThumbUpIcon />}
//                 // disabled={formik.values.section ? false : true}
//               >
//                 {t("ADD TO FAVOURITE")}
//               </Button>
//             </form>
//           </Card>
//         </div>
//         <div style={{ border: "1px solid #b6b6b66b", marginTop: "2rem" }}>
//           <Card className="card_1" style={{ padding: "25px" }} elevation={5}>
//             <Typography
//               color="primary"
//               style={{ fontSize: "1.2rem", textAlign: "left" }}
//               className="typography"
//             >
//               FAVOURITE LIST
//             </Typography>
//             <form onSubmit={formik1.handleSubmit} autocomplete="off">
//               <Autocomplete
//                 limitTags={2}
//                 value={formik1.values.section}
//                 options={favouriteList}
//                 onChange={(_, value) => {
//                   formik1.setFieldValue("section", value),
//                     setDeleteFavourite(value);
//                 }}
//                 name="section"
//                 getOptionLabel={(option) => option}
//                 getOptionSelected={(option, value) => option === value}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     variant="outlined"
//                     label={t("CHOOSE FROM FAVOURITE LIST")}
//                     margin="normal"
//                     error={
//                       formik1.touched.section && Boolean(formik1.errors.section)
//                     }
//                     helperText={
//                       formik1.touched.section && formik1.errors.section
//                     }
//                   />
//                 )}
//               />
//               <Button
//                 color="primary"
//                 variant="outlined"
//                 type="submit"
//                 style={{ float: "right", marginTop: "1rem" }}
//                 endIcon={<SendIcon />}
//               >
//                 {t("send")}
//               </Button>
//               <Button
//                 color="secondary"
//                 variant="outlined"
//                 style={{
//                   float: "right",
//                   marginTop: "1rem",
//                   marginRight: "1rem",
//                 }}
//                 onClick={handleDeletFavourite}
//                 endIcon={<DeleteOutlineIcon />}
//               >
//                 {t("DELETE FAVOURITE")}
//               </Button>
//             </form>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// };

// function mapStateToProps(state) {
//   return {
//     props: state.props,
//   };
// }

// export default reduxConnect(mapStateToProps, {
//   getGroupList,
//   sendFiles,
//   addToFavourite,
//   fetchFavouriteList,
//   changingTableStatePA,
//   changeTableStateDraft,
//   deleteFavourite,
// })(SendFileForm);

import React, { useCallback, useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect as reduxConnect, useDispatch } from "react-redux";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  getGroupList,
  sendFiles,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
} from "../../camunda_redux/redux/action";
import {
  changingTableState,
  changingTableStatePA,
  changeTableStateDraft,
} from "../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useTranslation } from "react-i18next";
import "./therme-source/material-ui/loading.css";
import { debounce } from "utils";

// let newArr = [
//   {
//     deptCoordRole: "7wg.hrc.hrc",
//     deptDisplayName: "7WG.HRC",
//     deptName: "7wghrc",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02c9",
//   },
//   {
//     deptCoordRole: "7wg.meto.meto",
//     deptDisplayName: "7WG.METO",
//     deptName: "7wgmeto",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02ca",
//   },
//   {
//     deptCoordRole: "7wg.cad.cad",
//     deptDisplayName: "7WG.CAD",
//     deptName: "7wgcad",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02cb",
//   },
//   {
//     deptCoordRole: "7wg.adm.adm",
//     deptDisplayName: "7WG.ADM",
//     deptName: "7wgadm",
//     deptRoleDisplayName: null,
//     id: "63d9f6c175e822719efb02cc",
//   },
// ];

const SendFileForm = (props) => {
  const { t } = useTranslation();
  const [hobbies, setHobbies] = useState([]);
  const [values, setValues] = useState("");
  const [favouriteList, setFavouriteList] = useState([]);
  const [deleteFavourite, setDeleteFavourite] = useState("");
  const [addFavourite, setAddFavourite] = useState("");
  const [deleteDisable, setDeleteDisable] = useState(true);
  const [addDisable, setAddDisable] = useState(true);
  const [blnDisable, setBlnDisable] = useState(true);
  const [addFavIcon, setAddFavIcon] = useState(false);
  const username = localStorage.getItem("username");
  const displayUserName = sessionStorage.getItem("displayUserName");

  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const initialState = {
    priority: "low",
    section: [],
  };

  const validation = Yup.object().shape({
    section: Yup.string()
      .nullable()
      .required(`${t("this_field_is_required")} !`),
  });
  const onHandleSubmit = async (value, priority) => {
    props.setSend(false);
    await props
      .sendFiles(
        props.fileId,
        value,
        role,
        username,
        displayUserName,
        props.pfileName,
        priority
      )
      .then((resp) => {
        console.log(resp);
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            dispatch(
              setSnackbar(true, "success", t("file_sent_successfully!"))
            );
            props.handleCloseEvent(false);
            props.handleStatus(props.fileId);
            let trigger = false;
            setTimeout(() => {
              trigger = true;
              props.changingTableState(trigger, "CHANGE_PA_FILE");
              props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
              props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
            }, 0);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((error) => {
        callMessageOut(error.message);
      });
  };

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validation,
    onSubmit: (value) => {
      onHandleSubmit(value.section.deptDisplayName, value.priority);
    },
  });

  const formik1 = useFormik({
    initialValues: initialState,
    onSubmit: (value) => onHandleSubmit(value.section, value.priority),
  });

  // Debounce function
  const optimizedInpChange = useCallback(debounce(getGroupListFunc), []);

  const handleInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedInpChange(e.target.value);
      }
    }
  };

  async function getGroupListFunc(value) {
    if (value && value.length > 2) {
      let formData = new FormData();
      formData.append("sau", value);
      await props
        .getGroupList(formData)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              let tmpArray = [];
              for (var i = 0; i < resp.data.length; i++) {
                tmpArray.push(resp.data[i]);
              }
              setHobbies(tmpArray);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
    }
  }

  const handleAddToFavourite = async (e) => {
    await props
      .addToFavourite(values, role, "send")
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            fetchFavourite();
            setValues("");
            dispatch(
              setSnackbar(true, "success", "Added to favourite successfully")
            );
            setAddFavIcon(true);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })

      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const fetchFavourite = async () => {
    await props
      .fetchFavouriteList(role)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setFavouriteList(resp.favourite.sendFavourite);
          }
        } catch (err) {
          callMessageOut(err.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  useEffect(() => {
    if (addFavourite) {
      setDeleteFavourite("");
    }

    if (deleteFavourite) {
      setAddFavourite("");
      setAddFavIcon(false);
    }

    if (addFavourite) {
      setAddDisable(false);
      setDeleteDisable(true);
    }

    if (deleteFavourite) {
      setDeleteDisable(false);
      setAddDisable(true);
      setAddFavIcon(false);
    }

    if (addFavourite || deleteFavourite) {
      setBlnDisable(false);
    }

    if (favouriteList.includes(values)) {
      setAddFavIcon(true);
    }

    if (deleteFavourite === null) {
      setDeleteDisable(true);
      setAddFavIcon(false);
    }
  }, [addFavourite, deleteFavourite, favouriteList]);

  useEffect(async () => {
    fetchFavourite();
  }, []);

  const handleDeletFavourite = async () => {
    await props
      .deleteFavourite(deleteFavourite, role, "send")
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            fetchFavourite();
            setDeleteFavourite("");
            dispatch(
              setSnackbar(true, "success", "Delete to favourite successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const handleChange = (value) => {
    formik.setFieldValue("section", value);
    formik1.setFieldValue("section", "");

    if (value) {
      setValues(value.deptDisplayName);
    }
    if (!value) {
      setAddDisable(true);
      setBlnDisable(true);
      setAddFavIcon(true);
    }
    setAddFavourite(value);
    setAddFavIcon(false);
  };

  const handleChangeDelete = (value) => {
    formik1.setFieldValue("section", value);
    formik.setFieldValue("section", "");
    setDeleteFavourite(value);
    if (value) {
      setValues(value.sau);
    } else {
      setAddFavIcon(true);
    }
  };

  const handleSubmitBtn = () => {
    if (addFavourite) {
      formik.handleSubmit();
    } else {
      formik1.handleSubmit();
    }
  };

  return (
    <>
      <DialogContent dividers>
        {/* <div className="department_list"> */}
        {/* <Typography
            color="primary"
            style={{ fontSize: "1.2rem", textAlign: "left" }}
            className="typography"
          >
            DEPARTMENT LIST
          </Typography> */}
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div style={{ display: "flex" }}>
            <FormControl style={{ width: "100%" }}>
              <Autocomplete
                freeSolo
                limitTags={2}
                value={formik.values.section}
                options={hobbies}
                onChange={(_, value) => handleChange(value)}
                onInputChange={handleInputChange}
                name="section"
                // getOptionLabel={(option) => {
                //   return option.sau_display_name ? option.sau_display_name : "";
                // }}
                // getOptionSelected={(option, value) =>
                //   option.sau_display_name === value.sau_display_name
                // }
                // getOptionLabel={(option) => option.sauDisplayName}
                // getOptionSelected={(option, value) =>
                //   option.sauDisplayName === value.sauDisplayName
                // }
                getOptionLabel={(option) => {
                  return option.deptDisplayName ? option.deptDisplayName : "";
                }}
                getOptionSelected={(option, value) =>
                  option.deptDisplayName === value.deptDisplayName
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t("choose_department")}
                    margin="normal"
                    error={
                      formik.touched.section && Boolean(formik.errors.section)
                    }
                    helperText={formik.touched.section && formik.errors.section}
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <IconButton
              color="secondary"
              id="fileForm_favourite"
              onClick={handleAddToFavourite}
              style={{ cursor: "pointer" }}
              disabled={addDisable}
            >
              <Tooltip title={t("ADD TO FAVOURITE")}>
                {addFavIcon ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </Tooltip>
            </IconButton>
          </div>
        </form>
        {/* </div> */}

        <div className="favourite_list">
          <form onSubmit={formik1.handleSubmit} autoComplete="off">
            <div style={{ display: "flex" }}>
              <FormControl style={{ width: "100%" }}>
                <Autocomplete
                  freeSolo
                  limitTags={2}
                  value={formik1.values.section}
                  options={favouriteList}
                  onChange={(_, value) => handleChangeDelete(value)}
                  name="section"
                  getOptionLabel={(option) => {
                    return option.length !== 0 ? option : "";
                  }}
                  getOptionSelected={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t("CHOOSE FROM FAVOURITE LIST")}
                      margin="normal"
                      error={
                        formik1.touched.section &&
                        Boolean(formik1.errors.section)
                      }
                      helperText={
                        formik1.touched.section && formik1.errors.section
                      }
                    />
                  )}
                />
              </FormControl>
              <IconButton
                id="fileForm_delete_fav"
                color="secondary"
                style={{ cursor: "pointer" }}
                onClick={handleDeletFavourite}
                disabled={deleteDisable}
              >
                <Tooltip title={t("delete_favourite")}>
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
            </div>
          </form>
        </div>
        <FormControl
          style={{
            paddingLeft: "4px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <h6>PRIORITY:</h6>
          <RadioGroup
            row
            name="priority"
            defaultValue="low"
            onChange={(_, value) => {
              formik.setFieldValue("priority", value);
              formik1.setFieldValue("priority", value);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              justifyContent: "space-evenly",
            }}
          >
            <FormControlLabel
              value="low"
              control={<Radio color="primary" />}
              label="LOW"
            />
            <FormControlLabel
              value="medium"
              control={<Radio color="primary" />}
              label="MEDIUM"
            />
            <FormControlLabel
              value="high"
              control={<Radio color="primary" />}
              label="HIGH"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          id="fileForm_send_btn"
          className="sendIcon"
          color="primary"
          variant="outlined"
          type="submit"
          disabled={blnDisable}
          endIcon={<SendIcon />}
          onClick={handleSubmitBtn}
        >
          {t("send")}
        </Button>
      </DialogActions>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default reduxConnect(mapStateToProps, {
  getGroupList,
  sendFiles,
  addToFavourite,
  fetchFavouriteList,
  changingTableState,
  changingTableStatePA,
  changeTableStateDraft,
  deleteFavourite,
})(SendFileForm);
