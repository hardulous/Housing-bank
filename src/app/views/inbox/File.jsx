import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { Breadcrumb } from "../../../matx";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import InboxTable from "./shared/InboxTable";
import PdfViewer from "../../pdfViewer/pdfViewer";
import { Loading } from "./therme-source/material-ui/loading";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import './therme-source/material-ui/loading.css'

const Inbox1 = (props) => {
  const [personalid, setPersonalid] = useState("");
  const [annotId, setAnnotId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const personalID = (id) => {
    setPersonalid(id);
  };

  const hanldeAnnotId = (val) => {
    setAnnotId(val);
  };

  const handleShowPdf = (val) => {
    setShowPdf(val);
  };

  const handleLoading = (val) => {
    setIsLoading(val);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="m-sm-30">
        <div>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={4}>
             
              <Breadcrumb
                routeSegments={[{  name: t("inbox")  ,  path: "/inbox/file"}]}
              />
             
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
        </div>
        <div>
          <SplitterComponent>
            <div
              style={{
                width: "67%",
                borderRadius: "8px",
                // border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              }}
            >
              <InboxTable
                pdfLoadsInbox={pdfLoads}
                personalId={personalID}
                annotationId={hanldeAnnotId}
                blnShowPdf={handleShowPdf}
                handleLoading={handleLoading}
              />
            </div>
            <div style={{ width: "33%", height: "calc(100vh - 100px)" }}>
              <PdfViewer
                personalID={personalid}
                anottId={annotId}
                flag={"PA"}
                pdfLoads={(val) => {
                  setPdfLoads(val);
                }}
              />
            </div>
          </SplitterComponent>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  props: state.props,
  loader: state.loader,
  theme: state.theme,
});

export default connect(mapStateToProps)(Inbox1);
