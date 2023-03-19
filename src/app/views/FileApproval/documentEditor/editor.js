import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import {
  DocumentEditorContainerComponent,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor";
import { connect } from "react-redux";
import { saveDocument, saveDoc, URLHide } from "../../../camunda_redux/redux/action";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { PropTypes } from "prop-types";
import { withTranslation } from "react-i18next";
import { Loading } from "../../Personnel/therme-source/material-ui/loading";
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
import Close from "@material-ui/icons/Close";
import Done from "@material-ui/icons/Done";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { debounce } from "utils";
import Cookies from "js-cookie";

DocumentEditorContainerComponent.Inject(Toolbar);

const HeadersAndFootersView = (props) => {
  let isRti = Cookies.get("isRti");
  let container = useRef();
  const [editorLoading, setEditorLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [newToolBar, setNewToolBar] = useState([]);
  const [contentChange, setContentChange] = useState(false);
  const [openHyerLinkDialog, setopenHyerLinkDialog] = useState(false);
  const [linkObj, setlinkObj] = useState({
    linkText: "",
    linkValue: "",
  });
  const [id, setid] = useState(
    "container" + Math.floor(Math.random() * (100000 - 1 + 1) + 1)
  );
  const [navigateLinkObj, setnavigateLinkObj] = useState();
  const role = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");

  // this useEffect to load initial document
  useEffect(() => {
    let id;
    if (props.fileUrl1) {
      console.log(props);
      console.log("editor is", props.fileUrl1);
      id = setTimeout(() => {
        window.onbeforeunload = function () {
          return "Want to save your changes?";
        };
        onLoadDefault(props.fileUrl1);
      });
      container.current.contentChange = () => {
        setContentChange(true);
      };
      return () => {
        clearTimeout(id);
      };
    }
  }, [props.fileUrl1]);

  // it means undo has been formed but document is not suppossed to open in docx so just again false the resave to unable the sign button
  useEffect(() => {
    if (!props.fileUrl1) {
      props.setreSave(false);
    }
  }, [props.reSave]);

  // this useEffect is to handle auto save
  // useEffect(() => {
  //   if (props.reSave) {
  //     optimizedAutoSave(props, false);
  //   }
  // }, [props.reSave]);

  useEffect(() => {
    container.current.documentEditor.requestNavigate = (args) => {
      const link = args.navigationLink.charAt(args.navigationLink.length - 1);
      let newObj = props.enclosureData.find(
        (item) => Number(item.flagNumber) === Number(link)
      );
      setnavigateLinkObj(newObj);
    };
    if (!isNullOrUndefined(navigateLinkObj) && navigateLinkObj !== "") {
      props.handleChange1(navigateLinkObj);
    }
  }, [navigateLinkObj, props.handleChange1]);

  const onCreate = () => {
    container.current.serviceUrl =
      window.__ENV__.REACT_APP_SYNCFUSION_SERVICE_URL;
    container.current.documentEditor.pageOutline = "#E0E0E0";
    container.current.documentEditor.acceptTab = true;
    container.current.documentEditor.resize();
  };

  const loadFile = (file) => {
    let ajax = new XMLHttpRequest();
    ajax.open("POST", window.__ENV__.REACT_APP_SYNCFUSION_URL, true);
    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200 || ajax.status === 304) {
          container.current &&
            container.current.documentEditor.open(ajax.responseText);
          if (props.reSave) {
            save(props, false);
            props.setreSave(false);
          }
          // else if (props.reSaveNof) {
          //   save(props, false);
          //   props.setreSaveNof(false);
          // } else if (props.reSaveEnco) {
          //   save(props, false);
          //   props.setreSaveEnco(false);
          // }
        }
      }
    };
    setEditorLoading(false);
    let formData = new FormData();
    formData.append("files", file);
    ajax.send(formData);
  };

  const onLoadDefault = async (url) => {
    // tslint:disable
    props.URLHide(url).then(async (response) => {
      let data = await response.blob();

      let file = new File([data], "test.docx");
      loadFile(file);
    });

    let saveButton = {
      prefixIcon: "e-save-icon",
      tooltipText: "Save",
      text: "Save",
      id: "save",
      type: "Button",
    };
    let printButton = {
      prefixIcon: "e-print-icon",
      tooltipText: "Print",
      text: "Print",
      id: "print",
      type: "Button",
    };
    let fullScreen = {
      prefixIcon: "e-full-screen-2-icon",
      tooltipText: "FullScreen",
      text: "Full Screen",
      id: "fullScreen",
      type: "Button",
    };
    let link = {
      prefixIcon: "e-link-icon",
      tooltipText: "Hyperlink",
      text: "Link",
      id: "link",
      type: "Button",
    };
    let hyperlink = {
      prefixIcon: "e-link-icon",
      tooltipText: "Link",
      text: "Link",
      id: "link",
      type: "Button",
    };

    props.blnShowQuickSign
      ? setNewToolBar([
          saveButton,
          "Open",
          "Undo",
          "Redo",
          "Separator",
          fullScreen,
          props.enclosureData ? link : hyperlink,
          "Image",
          "Table",
          "Comments",
          "TableOfContents",
          "Separator",
          "Header",
          "Footer",
          "PageSetup",
          "PageNumber",
          "Break",
          "Separator",
          "Find",
          "Separator",
          "LocalClipboard",
          "RestrictEditing",
          printButton,
        ])
      : setNewToolBar([
          saveButton,
          "Open",
          "Undo",
          "Redo",
          "Separator",
          fullScreen,
          props.enclosureData ? link : "Hyperlink",
          "Image",
          "Table",
          "Comments",
          "TableOfContents",
          "Separator",
          "Header",
          "Footer",
          "PageSetup",
          "PageNumber",
          "Break",
          "Separator",
          "Find",
          "Separator",
          "LocalClipboard",
          "RestrictEditing",
          printButton,
        ]);
  };

  function save(props, showSnackbar) {
    console.log("Came here");
    container.current.documentEditor.saveAsBlob("Docx").then((blob) => {
      console.log(blob);
      var file = new File([blob], "SampleFile.docx");
      let formData = new FormData();
      formData.append("file", file);
      formData.append("isPartCase", props.blnIsPartCase);
      var reader = new FileReader();
      reader.onload = function () {};
      reader.readAsText(blob);
      const { fileUrl1, fileId, isAnnexure } = props;
      props
        .saveDocument(
          fileId,
          formData,
          role,
          username,
          props.blnIsPartCase,
          fileUrl1,
          isAnnexure
        )
        .then((resp) => {
          props.setreSave(false);

          showSnackbar &&
            props.setSnackbar(
              true,
              "success",
              props.t("Document_saved_successfully!")
            );
        })
        .catch((e) => {
          props.setSnackbar(true, "error", e.message);
        });
    });
  }

  const handeLink = () => {
    setopenHyerLinkDialog(true);
  };

  const addHyperLink = () => {
    container.current.documentEditor.editor.insertHyperlink(
      linkObj.linkValue.replace(" ", "%20"),
      linkObj.linkText,
      true
    );
    setopenHyerLinkDialog(false);
  };

  const fullScreenFun = () => {
    let elem = document.getElementById(id);
    if (fullScreen) {
      setFullScreen(false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      setFullScreen(true);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }
  };

  // Optimized debounce function for auto save
  const optimizedAutoSave = useCallback(debounce(save, 1000), []);

  return (
    <>
      {props.enclosureData && (
        <Dialog
          open={openHyerLinkDialog}
          aria-labelledby="draggable-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div style={{ width: "300px" }}>
            <DialogTitle
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
              onClose={() => setopenHyerLinkDialog(false)}
            >
              <Typography>Insert Hyperlink</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                label="Text to display"
                size="small"
                fullWidth
                variant="outlined"
                style={{ paddingBottom: "10px" }}
                value={linkObj.linkText}
                onChange={(e) =>
                  setlinkObj({
                    ...linkObj,
                    linkText: e.target.value,
                  })
                }
              />
              <TextField
                select
                label="Address"
                size="small"
                fullWidth
                variant="outlined"
                value={linkObj.linkValue}
                onChange={(e) =>
                  setlinkObj({
                    ...linkObj,
                    linkValue: e.target.value,
                  })
                }
              >
                {props.enclosureData.map((item, index) => (
                  <MenuItem
                    key={index}
                    value={`${item.fileName} ${item.flagNumber}`}
                  >
                    {item.fileName}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button
                id="inboxEditor_OK_button"
                color="primary"
                variant="outlined"
                style={{ marginBottom: "1rem" }}
                endIcon={<Done />}
                onClick={addHyperLink}
              >
                OK
              </Button>
              <Button
                id="inboxFileEditor_cancel_button"
                color="primary"
                variant="outlined"
                style={{ marginRight: "1rem", marginBottom: "1rem" }}
                endIcon={<Close />}
                onClick={() => setopenHyerLinkDialog(false)}
              >
                CANCEL
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      )}
      <div className="control-pane" style={{height: "100%"}}>
        {editorLoading && <Loading />}
        <DocumentEditorContainerComponent
          id={id}
          ref={container}
          created={onCreate}
          style={{ display: "block" }}
          height="100%"
          enableToolbar={true}
          showPropertiesPane={false}
          locale="en-US"
          toolbarItems={newToolBar}
          contentChange={(e) => {
            optimizedAutoSave(props, false);
            setTimeout(() => {
              if (!props.reSave) {
                props.setreSave(true);
              }
            }, 0);
          }}
          toolbarClick={(args) => {
            switch (args.item.id) {
              case "save":
                save(props, true);
                break;
              case "send":
                send(props);
                break;
              case "print":
                print;
                break;
              case "link":
                handeLink();
                break;
              case "fullScreen":
                fullScreenFun(props);
                break;
            }
          }}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  props: state.props,
  saveDocument: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { saveDocument,saveDoc, setSnackbar, URLHide })(
  withTranslation()(React.memo(HeadersAndFootersView))
);
