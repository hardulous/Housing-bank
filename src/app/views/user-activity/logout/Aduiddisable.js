import React, { useEffect, useState } from "react";
import "./logout.css";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

export default function Aduiddisable() {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedC: true,
    checkedD: true,
    checkedE: true,
    checkedF: true,
    checkedG: true,
    checkedH: true
  });

  let username = localStorage.getItem("username");

  const [meta, setMeta] = React.useState();

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const getAuditdata = async () => {
    try {
      const { data } = await Axios.get("/audit_view_service/api/getConfig", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          username: username,
          sessionId: sessionStorage.getItem("sessionId")
        },
      });
      setMeta(data);
    } catch (error) {}
  };

  useEffect(() => {
    getAuditdata();
  }, []);

  return (
    <div className="Pswitchbutton">
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          checked={state.checkedA}
          onChange={handleChange}
          name="checkedA"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>

        <Switch
          checked={state.checkedB}
          onChange={handleChange}
          name="checkedB"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          checked={state.checkedC}
          onChange={handleChange}
          name="checkedC"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          checked={state.checkedD}
          onChange={handleChange}
          name="checkedD"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          checked={state.checkedE}
          onChange={handleChange}
          name="checkedE"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          checked={state.checkedF}
          onChange={handleChange}
          name="checkedF"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          checked={state.checkedG}
          onChange={handleChange}
          name="checkedG"
          color="primary"
        />
      </div>
      <div className="Cswitchbutton">
        <Typography variant="body1"> Hello Audit </Typography>
        <Switch
          inputProps={{ "aria-label": "Switch A" }}
          checked={state.checkedH}
          onChange={handleChange}
          name="checkedH"
          color="primary"
        />
      </div>
    </div>
  );
}
