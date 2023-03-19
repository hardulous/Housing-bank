import React, { createElement, memo, useEffect, useRef, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  downloadFile,
  saveAnnotation,
  getAnnotation,
} from "../camunda_redux/redux/action";
import { PropTypes } from "prop-types";
import { setPassData } from "../camunda_redux/redux/ducks/passData";
import { setPdfInstance } from "../camunda_redux/redux/ducks/instanceStore";
import { setLoadData } from "../redux/actions/LoadingActions";
import { setSnackbar } from "../camunda_redux/redux/ducks/snackbar";
import {
  changingTableStateInbox,
  changingTableStateAnnexure,
  changingTableStateHrmConcern,
} from "../camunda_redux/redux/action/apiTriggers";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { URLHide } from "../camunda_redux/redux/action";
import { useTranslation } from "react-i18next";

const PdfViewer = (props) => {
  const viewer = useRef(null);
  const messageReceived = useSelector(
    (state) => state.passData.messageToPassUrl
  );

  const { extension } = useSelector((state) => state.passData);

  const { personalID, flag, flagNumber, pageNumber, anottId, isSample } = props;

  const [instance, setInstance] = useState(null);
  let [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const darkMode = props.theme;

  const handleWaterMark = (docViewer) => {
    docViewer.setWatermark({
      // Draw diagonal watermark in middle of the document
      diagonal: {
        fontSize: 35, // or even smaller size
        fontFamily: "sans-serif",
        color: "#5a5ad6",
        opacity: 40, // from 0 to 100
        text: `${sessionStorage.getItem("pklDirectrate")}`,
      },

      // Draw header watermark
      header: {
        fontSize: 10,
        fontFamily: "sans-serif",
        color: "red",
        opacity: 70,
      },
    });
  };

  // console.log(messageReceived, sfdt);

  useEffect(() => {
    if (instance !== null) {
      if (darkMode) {
        instance.setTheme("dark");
      } else instance.setTheme("default");
    }
  }, [instance, darkMode]);

  useEffect(() => {
    try {
      if (
        instance !== null &&
        messageReceived !== "" &&
        messageReceived !== null &&
        !isNullOrUndefined(messageReceived)
      ) {
        let flag1 = true;
        instance.setHeaderItems((header) => {
          header.pop();
        });
        if (isSample) {
          instance.loadDocument(messageReceived);
        } else {
          props.URLHide(messageReceived).then(async (response) => {
            let data = await response.blob();

            let file = new File([data], "test.docx");
            instance.loadDocument(file, {
              extension: extension ? extension : "docx",
            });
          });
        }

        const { docViewer, annotManager } = instance;

        handleWaterMark(docViewer);

        docViewer.on("pageNumberUpdated", (pageNumber) => {
          props.isPage && props.handleChangePage(pageNumber);
        });

        instance.setHeaderItems((header) => {
          header.push({
            type: "actionButton",
            img: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
            title: "Save",
            onClick: async () => {
              annotManager.exportAnnotations().then((res) => {
                const body = { annotationData: res };
                const val = JSON.stringify(body);
                props
                  .saveAnnotation(val, personalID, flag, flagNumber)
                  .then(function (response) {
                    if (response.status === "OK") {
                      // props.setReloadInboxData();
                      flag1 = true;
                      dispatch(
                        setSnackbar(
                          true,
                          "success",
                          "Annotation saved successfully"
                        )
                      );

                      let trigger = false;
                      setTimeout(() => {
                        trigger = true;
                        props.changingTableStateInbox(trigger, "CHANGE_INBOX");
                        if (flag === "Initiate") {
                          props.changingTableStateAnnexure(
                            trigger,
                            "CHANGE_PA_ANNEXURE"
                          );
                        }
                        if (flag === "PA" || "Annexture") {
                          props.changingTableStateHrmConcern(
                            trigger,
                            "CHANGE_HRM"
                          );
                        }
                      }, 2000);
                    } else {
                      dispatch(
                        setSnackbar(true, "error", "Annotation saved Failure !")
                      );
                    }
                  });
                setLoading(false);
              });
            },
          });
        });

        docViewer.on("documentLoaded", function () {
          docViewer.setCurrentPage(parseInt(pageNumber), true);
          if (flag1) {
            flag1 = false;
            if (anottId !== null && anottId !== undefined && anottId !== "") {
              loadxfdfStrings(anottId).then(function (rows) {
                let xString = rows.xsdfString;
                annotManager.importAnnotations(xString).then((response) => {
                  response.forEach((col) => {
                    annotManager
                      .importAnnotCommand(col)
                      .then(function (annotations) {
                        annotManager.drawAnnotationsFromList(annotations);
                      });
                  });
                });
              });
            }
            anottId = "";
          }
        });
        dispatch(setPassData(""));
      }
    } catch (e) {}
    // props.setLoadData(true);
  }, [messageReceived, instance]);

  useEffect(() => {
    WebViewer(
      {
        path: `${process.env.PUBLIC_URL + "/webviewer/lib"}`,
        initialDoc: `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`,
        fullAPI: true,
        enableRedaction: true,
        backendType: "ems",
        disableLogs: true,
      },
      viewer.current
    )
      .then((instance) => {
        setInstance(instance);
        props.pdfLoads(true);

        instance.setLanguage("en");

        const { docViewer } = instance;

        handleWaterMark(docViewer);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  // Make a GET request to get XFDF string
  var loadxfdfStrings = function (documentId) {
    return props.getAnnotation(documentId);
  };

  const renderPdf = () => {
    // const prevPdf = <div className="webviewer" style={{ height: "100vh" }} ref={ViewerDiv}></div>
    const newPdf = createElement("div", {
      id: "pdfv",
      className: "webviewer",
      style: { height: "100%" },
      ref: viewer,
    });
    return newPdf;
  };

  return <div className="App">{renderPdf()}</div>;
};

function mapStateToProps(state) {
  return {
    saveAnnotation: PropTypes.func.isRequired,
    getAnnotation: PropTypes.func.isRequired,
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  setLoadData,
  downloadFile,
  saveAnnotation,
  getAnnotation,
  changingTableStateInbox,
  changingTableStateAnnexure,
  changingTableStateHrmConcern,
  URLHide,
})(memo(PdfViewer));
