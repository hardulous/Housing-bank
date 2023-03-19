import React, { useEffect, useState, createElement } from "react";
import WebViewer from "@pdftron/webviewer";
import "./App.css";
import { connect, useDispatch } from "react-redux";
import {
  URLHide,
  saveAnnotation,
  getAnnotation,
} from "../../../../camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close, Done } from "@material-ui/icons";
import CustomLinkDialog from "../CustomLinkDialog";

const SplitViewPdfViewer = (props) => {
  const dispatch = useDispatch();
  const viewer = React.createRef();
  const { flag, extension, anottId, fileUrl } = props;
  const [instance, setInstance] = useState(null);
  const darkMode = props.theme;
  const [openHyerLinkDialog, setopenHyerLinkDialog] = useState(false);

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

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

  useEffect(() => {
    try {
      if (instance !== null) {
        const { docViewer, annotManager, Actions, Annotations } = instance;
        let flag1 = true;

        if (!fileUrl) {
          return;
        } else {
          handleWaterMark(docViewer);

          const URL =
            fileUrl === ""
              ? `${process.env.PUBLIC_URL + "/assets/sample.pdf"}`
              : fileUrl;
          props.URLHide(URL).then(async (response) => {
            let data = await response.blob();

            let file = new File([data], "test.docx");
            instance.loadDocument(file, {
              extension: extension ? extension : "docx",
            });
            props.pdfLoads(true);
          });

          if (props.isCustomLink) {
            const onTriggered = Actions.URI.prototype.onTriggered;

            Actions.URI.prototype.onTriggered = function (target, event) {
              if (target instanceof Annotations.Link) {
                const link = JSON.parse(target.kk.U[0].Kq);
                console.log(link)
                let newObj = props.enclosureData.find(
                  (item) => Number(item.flagNumber) === Number(link.flagNumber)
                );
                props.handleChange1(newObj, link.pageNumber, link.id, true);
                return;
              }
              onTriggered.apply(this, arguments);
            };

            instance.textPopup.update([
              {
                type: "actionButton",
                img: "icon-tool-link",
                onClick: (arg) => {
                  setopenHyerLinkDialog(true);
                },
              },
            ]);
          }

          docViewer.on("pageNumberUpdated", (pageNumber) => {
            props.isPage && props.handleChangePage(pageNumber);
          });

          docViewer.on("documentLoaded", function () {
            props.isPage &&
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
        }
      } else {
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
            const { docViewer } = instance;
            handleWaterMark(docViewer);
          })
          .catch((e) => {});
      }
    } catch (e) {
      callMessageOut(e.message);
    }
  }, [instance, fileUrl]);

  useEffect(() => {
    if (instance !== null) {
      if (darkMode) {
        instance.setTheme("dark");
      } else instance.setTheme("default");
    }
  }, [instance, darkMode]);

  const renderPdf = () => {
    // const prevPdf = <div className="webviewer" style={{ height: "100vh" }} ref={ViewerDiv}></div>
    const newPdf = createElement("div", {
      id: "pdfv" + Math.random(),
      className: "webviewer",
      style: { height: "100%" },
      ref: viewer,
    });
    return newPdf;
  };

  const addHyperLink = (url) => {
    const { Actions, annotManager, docViewer } = instance;

    const selectedTextQuads = docViewer.getSelectedTextQuads();
    const currentPageLinks = [];
    const action = new Actions.URI({ uri: url });

    for (const pageNumber in selectedTextQuads) {
      selectedTextQuads[pageNumber].forEach((quad) => {
        const link = newLink(
          Math.min(quad.x1, quad.x3),
          Math.min(quad.y1, quad.y3),
          Math.abs(quad.x1 - quad.x3),
          Math.abs(quad.y1 - quad.y3),
          parseInt(pageNumber) + 1
        );
        link.addAction("U", action);
        currentPageLinks.push(link);
      });
    }
    annotManager.addAnnotations(currentPageLinks);
    let pageNumbersToDraw = currentPageLinks.map((link) => link.PageNumber);
    pageNumbersToDraw = [...new Set(pageNumbersToDraw)];
    pageNumbersToDraw.forEach((pageNumberToDraw) => {
      annotManager.drawAnnotations(pageNumberToDraw, null, true);
    });
    handleSave();
  };

  const newLink = (x, y, width, height, linkPageNumber) => {
    const { Annotations } = instance;
    const link = new Annotations.Link();
    link.PageNumber = linkPageNumber;
    link.StrokeColor = new Annotations.Color(0, 165, 228);
    link.StrokeStyle = "underline";
    link.StrokeThickness = 2;
    link.Author = "Test user";
    link.Subject = "Link";
    link.X = x;
    link.Y = y;
    link.Width = width;
    link.Height = height;
    return link;
  };

  const handleSave = async () => {
    const { annotManager } = instance;

    annotManager
      .exportAnnotations({ link: true })
      .then((resp) => {
        const body = { annotationData: resp };
        const val = JSON.stringify(body);
        props
          .saveAnnotation(val, props.fileId, props.flag, props.flagNumber)
          .then((resp) => {
            handleClose();
          })
          .catch((e) => {
            console.log(e.message);
          });
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  useEffect(() => {
    if (props.getSfdt) {
      const { annotManager } = instance;

      annotManager
        .exportAnnotations({ link: true })
        .then((resp) => {
          // const body = { annotationData: resp };
          // const val = JSON.stringify(body);
          props.handleSfdt(resp);
        })
        .catch((e) => {});
    }
  }, [props.getSfdt]);

  const handleClose = () => {
    setopenHyerLinkDialog(false);
  };

  var loadxfdfStrings = function (documentId) {
    return props.getAnnotation(documentId);
  };

  return (
    <>
      {props.isCustomLink && (
        <Dialog
          open={openHyerLinkDialog}
          aria-labelledby="draggable-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{ minWidth: "600px" }}>
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
              onClose={handleClose}
            >
              <Typography>Insert Hyperlink</Typography>
            </DialogTitle>
            <CustomLinkDialog
              enclosureData={props.enclosureData}
              addHyperLink={addHyperLink}
              handleClose={handleClose}
            />
          </div>
        </Dialog>
      )}
      <div className="App">{renderPdf()}</div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  URLHide,
  saveAnnotation,
  getAnnotation,
})(React.memo(SplitViewPdfViewer));
