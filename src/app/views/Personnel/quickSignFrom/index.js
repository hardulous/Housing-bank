import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form } from "./form";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import { quickSign } from "../../../camunda_redux/redux/action";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";

const InputForm = (props) => {
  const { t } = useTranslation();
  const url = sessionStorage.getItem("FileURL");
  const dispatch = useDispatch();
  const [quickSignLoading, setQuickSignLoading] = useState(false);
  const [blnDisable, setBlnDisable] = useState(false);

  const validationSchema = Yup.object({
    comments: Yup.string(t("enter_a_comment")),
    pencilColorCode: Yup.string(t("select_a_pencil_color")).required(
      t("color_is_required")
    ),
  });

  useEffect(() => {
    if (props.fileUrl1) {
      if (props.fileUrl1 !== null && props.fileUrl1 !== "") {
        setTimeout(() => {
          dispatch(setPassData(props.fileUrl1));
        }, 1000);
      }
    }
  }, [props.fileUrl1]);

  const submit = (data, action) => {
    setBlnDisable(true);
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
    formData.append("url", url.split("?versionId")[0]);
    formData.append("partCaseFileId", data.personalAppliactionFileId);

    const roleName = sessionStorage.getItem("role");
    setQuickSignLoading(true);

    props
      .quickSign(formData, roleName, "", false, "", props.pfileName)
      .then((response) => {
        console.log(response);
        try {
          if (response !== undefined && response !== null) {
            if (response.url) {
              props.updatePa(response.file);
              const url = response.url;
              props.toggleViewer(false, url);
              dispatch(
                setSnackbar(
                  true,
                  "success",
                  t("sign_successful,_please-wait_till_PDF_renders.")
                )
              );
              action.resetForm();
              setBlnDisable(false);
              setQuickSignLoading(false);
            }
          } else {
            const errorMessage =
              response.status + " : " + response.error + " AT " + response.path;
            callMessageOut(errorMessage);
            setQuickSignLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setQuickSignLoading(false);
        }
      });
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const send = () => {
    const { sendToogle } = props;
    sendToogle(true);
  };

  const handleReturnToEditor = () => {
    const { returnToEditor } = props;
    returnToEditor(true);
  };

  const values = {
    comments: "",
    pencilColorCode: t("blue"),
    personalAppliactionFileId: props.fileId,
  }; //tag: "", signTitle: "",username: "", dep_desc: "", color: "",
  return (
    <>
      {quickSignLoading && <Loading />}
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={submit}
      >
        {(props, quickSignLoading) => (
          <Form
            {...props}
            quickSignLoading={quickSignLoading}
            sendClick={send}
            returnToEditorCLick={handleReturnToEditor}
            blnDisable={blnDisable}
          />
        )}
      </Formik>
    </>
  );
};

function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, { quickSign })(InputForm);
