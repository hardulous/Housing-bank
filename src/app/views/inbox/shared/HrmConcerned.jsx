import React from "react";
import { Grid } from "@material-ui/core";
import PdfViewer from "../../../pdfViewer/pdfViewer";
import FileListTable from "./FileListTable";
import { Breadcrumb } from "../../../../matx";
import { connect } from "react-redux";
import { useState } from "react";
import { Loading } from "../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";

const HrmConcerned = (props) => {
  const location = useLocation();
  const { t } = useTranslation();
  let title = Cookies.get("inboxFile");
  let priority = Cookies.get("priority");
  let referenceNumber = Cookies.get("referenceNumber");

  const [annotId, setAnnotId] = useState("");
  const [blnShowPDF, setBlnShowPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contentId, setContentId] = useState("");
  const [flag, setFlag] = useState("");
  const [pdfLoads, setPdfLoads] = useState(false);

  const handleShowPdf = (val) => {
    setBlnShowPDF(val);
  };

  const handleContentID = (val) => {
    setContentId(val);
  };
  const annotation = (val) => {
    setAnnotId(val);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="m-sm-30">
        <div>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumb
                routeSegments={[
                  { name: t("inbox"), path: "/eoffice/inbox/file" },
                  {
                    name: t("HRM_concerned_view"),
                    path: "/eoffice/hrmConcernedView/file",
                  },
                ]}
                otherData={[
                  { key: t("title"), value: title?.toUpperCase() },
                  { key: t("ref_no"), value: referenceNumber?.toUpperCase() },
                  { key: t("priority"), value: priority?.toUpperCase() },
                ]}
              />
            </Grid>
          </Grid>
        </div>
        <SplitterComponent style={{ height: "100%" }}>
          <div style={{ width: "70%" }}>
            {blnShowPDF && (
              <div style={{ border: "1px solid #b6b6b66b", height: "calc(100vh - 100px)" }}>
                <PdfViewer
                  personalID={contentId}
                  anottId={annotId}
                  flag={flag}
                  pdfLoads={(val) => {
                    setPdfLoads(val);
                  }}
                />
              </div>
            )}
          </div>
          <div style={{ width: "30%", overflow: "hidden" }}>
            <div style={{ margin: "auto" }}>
              <FileListTable
                pdfLoadsHRM={pdfLoads}
                annotID={annotation}
                flagValue={(val) => setFlag(val)}
                contentID={handleContentID}
                fileID={title}
                blnShowPdf={handleShowPdf}
                blnEnableLoader={(val) => setLoading(val)}
                paId={location.state}
              />
            </div>
          </div>
        </SplitterComponent>
      </div>
    </>
  );
};
function mapStateToProps(state) {
  return {
    props: state.props,
    inboxData: state.inboxData,
  };
}

export default connect(mapStateToProps)(HrmConcerned);
