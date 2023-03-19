import React, { useState } from "react";
import { Formik } from "formik";
import Form from "./form";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import { quickSign } from "../../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import { Loading } from "../../therme-source/material-ui/loading";
import Cookies from "js-cookie";
import { addYlowNote } from "../../../../camunda_redux/redux/action";

const InputForm = (props) => {
  const { t } = useTranslation();

  const [fileURL, setFileURL] = useState("");
  const [blnDisable, setBlnDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { SignURL, flagNum, isYloNote } = props;
  let isRti = Cookies.get("isRti");

  const validationSchema1 = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
  });

  console.log(SignURL);
  console.log(flagNum);

  const validationSchema2 = Yup.object({
    comments: Yup.string(t("enter_a_yellow_note"))
      .trim()
      .required(t("yellow_note_is_required")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
    sendTo: Yup.array()
      .of(Yup.string())
      .when("eyesOnly", {
        is: true,
        then: Yup.array().required("Send field is required"),
        otherwise: Yup.array(),
      }),
  });

  const submit1 = (data, action) => {
    setBlnDisable(true);
    setIsLoading(true);
    let formData = new FormData();
    formData.append("comments", data.comments);
    formData.append("tag", "APPROVED");
    formData.append("signTitle", localStorage.getItem("username")); //data.signTitle
    formData.append("pencilColorCode", data.pencilColorCode);
    formData.append("username", localStorage.getItem("username"));
    formData.append("color", data.pencilColorCode);
    formData.append(
      "personalAppliactionFileId",
      data.personalAppliactionFileId
    );
    formData.append("dep_desc", sessionStorage.getItem("department")); //data.dep_desc
    formData.append("filebytearray", data.filebytearray);
    formData.append("url", SignURL);
    formData.append("partCaseFileId", data.personalAppliactionFileId);

    const roleName = sessionStorage.getItem("role");
    const depart = sessionStorage.getItem("department");
    const username = localStorage.getItem("username");

    props
      .quickSign(
        formData,
        roleName,
        depart,
        username,
        flagNum,
        "",
        "",
        "",
        isRti
      )

      .then((response) => {
        try {
          if (response !== undefined && response !== null) {
            setBlnDisable(false);
            if (response.url) {
              setFileURL(response.url);
              {
                props.flag == "Enclouser"
                  ? props.handleEnclosure(response.enclosure)
                  : isRti
                  ? props.loadRtiData()
                  : props.callBackURL(response.file);
              }
              action.resetForm();
              props.isSignedCompleted(true);
              setIsLoading(false);
            }
          } else {
            props.isSignedCompleted(false);
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
          }
        } catch (e) {
          props.isSignedCompleted(false);
          callMessageOut(e.message);
        }
      });
  };

  const submit2 = async (data, action) => {
    const roles = data.sendTo.map((item, i) => item.deptRole);
    props
      .addYlowNote(
        data.comments,
        data.pencilColorCode,
        data.partcaseId,
        data.user,
        roles
      )
      .then((res) => {
        props.addedSuccess(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const callMessageOut = (message) => {
    setIsLoading(false);
    props.isSignedCompleted(true);
    dispatch(setSnackbar(true, "error", message));
  };

  const values1 = {
    comments: "",
    pencilColorCode: t("blue"),
    personalAppliactionFileId: props.fileId,
  }; //tag: "", signTitle: "",username: "", dep_desc: "", color: "",

  const values2 = {
    comments: "",
    pencilColorCode: t("blue"),
    eyesOnly: false,
    sendTo: [],
    partcaseId: sessionStorage.getItem("partcaseID"),
    user: sessionStorage.getItem("role"),
  };

  return (
    <React.Fragment>
      {isLoading && <Loading />}
      <Formik
        initialValues={isYloNote ? values2 : values1}
        validationSchema={isYloNote ? validationSchema2 : validationSchema1}
        onSubmit={isYloNote ? submit2 : submit1}
      >
        {(props) => (
          <Form {...props} blnDisable={blnDisable} isYloNote={isYloNote} />
        )}
      </Formik>
    </React.Fragment>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { quickSign, addYlowNote })(InputForm);
