import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { getStatus } from "app/camunda_redux/redux/action/index";
import CabinetTableView from "./CabinetTableView";
import ExternalCabinet from "./ExternalCabinet";
import PermanentlyClose from "./PermanentlyClose";
import "./index.css";
import { clearCookie } from "utils";

import { Breadcrumb } from "matx";

const CabinetView = (props) => {

  const [cab, setCab] = useState(false);
  const [closefile, setClosefile] = useState(true);
  const [permanentClose, setpermanentClose] = useState(true);
  const [cabinet, setCabinet] = useState(true);
  const [extCabinet, setextCabinet] = useState(false);
  

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);
  }, []);

  useEffect(() => {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    clearCookie()
  }, []);

  const handleShow = () => { 
    setCab(false);
    setCabinet(true);
    setClosefile(true);
    setpermanentClose(true);
  };

  const handleclose = () => {
    setClosefile(false);
    setCab(true);
    setCabinet(false);
    setpermanentClose(true);
    setextCabinet(true);
  };
  const handlepClose = () => {
    setClosefile(true);
    setCab(true);
    setCabinet(true)
    setpermanentClose(false)
  };
  const { t } = props;

  return (
    <>
      <div className="m-sm-30">
        <Grid container className="cabinate_container">
          <Grid item xs={12}>
            <Breadcrumb
              routeSegments={[{ name: t("cabinet"), path: "/personnel/file" }]}
            />
          </Grid>
          <Grid
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3rem",
            }}
            item
            xs={12}
          >
            <Grid item>
              {cabinet ? (
                <CabinetTableView />
              ) : extCabinet ? (
                <ExternalCabinet />
              ) : (
                <PermanentlyClose />
              )}
            </Grid>

            <Grid item>
              <ul
                style={{
                  // position: "fixed",
                  right: "16px",
                  padding: 0,
                }}
              >
                {cab ? (
                  <li className="hide1" onClick={() => handleShow()}>
                    INTERNAL
                  </li>
                ) : (
                  <li
                    className="hide"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    INTERNAL
                  </li>
                )}

                {closefile ? (
                  <li className="hide1" onClick={() => handleclose()}>
                    EXTERNAL
                  </li>
                ) : (
                  <li
                    className="hide"
                    onClick={() => handleclose()}
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    EXTERNAL
                  </li>
                )}
                {permanentClose ? (
                  <li className="hide1" onClick={() => handlepClose()}>
                    CLOSED
                  </li>
                ) : (
                  <li
                    className="hide"
                    onClick={() => handlepClose()}
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    CLOSED
                  </li>
                )}
              </ul>
            </Grid>
          </Grid>



        </Grid>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme,
});
export default withRouter(
  connect(mapStateToProps, { getStatus })(withTranslation()(CabinetView))
);
