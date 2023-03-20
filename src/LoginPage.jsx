import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Slide,
} from "@material-ui/core";
import App from "app/App";
import Axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./_index.scss";
import { TextField } from "@material-ui/core";
import Loading from "matx/components/MatxLoadable/Loading";
// import { setSnackbar } from "../../pa/src/app/camunda_redux/redux/ducks/snackbar";
// import bcrypt from 'bcryptjs';
import CryptoJS from "crypto-js";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import history from "./history"

const LoginPage = () => {
  const [showPassword, setshowPassword] = useState(false);
  const [Cred, setCred] = useState({
    username: "",
    password: "",
    // error: "",
  });
  const [Secret, setSecret] = useState("");
  const [success, setSuccess] = useState(false);

  let Prime_No, Primitive, Private_Key_A, Secret_A, Shared_Secret;

  // let salt;

  const userName = localStorage.getItem("username");

  function encryptFun(password, username) {
    var keybefore = Secret + "appolocomputers";
    var ivbefore = username + "costacloud012014";
    var key = CryptoJS.enc.Latin1.parse(keybefore.substring(0, 16));
    var iv = CryptoJS.enc.Latin1.parse(ivbefore.substring(0, 16));
    var ciphertext = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }).toString();
    return ciphertext;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const data = JSON.stringify({
        username: Cred.username,
        password: encryptFun(Cred.password, Cred.username),
        keycloak: window.__ENV__.REACT_APP_KEYCLOACK,
        client_id: window.__ENV__.REACT_APP_CLIENT_ID,
      });

      const login = await Axios.post("/auth/token1", data, { headers });
      setCred({
        ...Cred,
        error: "",
      });
      if (login.status == 200) {
        const { data } = login;
        sessionStorage.setItem("jwt_token", data.access_token);
        sessionStorage.setItem("sessionId", data.session_state);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", "costa_cloud");
        localStorage.setItem("username", Cred.username);
        localStorage.setItem("expires_in", data.expires_in);
        document.body.style.zoom = "95%";
        ReactDOM.render(<App />, document.getElementById("root"));
        history.push({
          pathname:"/eoffice/dashboard/analytics"
        })
      }
    } catch (error) {
      const errMsg = error.response.data;
      setCred({
        ...Cred,
        error: errMsg,
      });
    }
  };

  const getPublicSecret = async (secret_front) => {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      clientKey: secret_front,
    };
    const secret_back = (await Axios.get("/auth/share", { headers })).data;
    Shared_Secret = power(secret_back, Private_Key_A, Prime_No);
    setSecret(Shared_Secret);
    setSuccess(true);
  };

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Power function to return value of a ^ b mod P
  const power = (a, b, p) => {
    if (b == 1) return a;
    else return Math.pow(a, b) % p;
  };

  // for handling refresh token
  useEffect(() => {
    setInterval(() => {
      handleRefreshToken();
    }, 400000);

    userName && handleRefreshToken();
  }, []);

  // for handling diffi hellman alogrithm
  useEffect(() => {
    Prime_No = window.__ENV__.REACT_APP_PRIME_NO;
    Primitive = window.__ENV__.REACT_APP_PRIMITIVE;
    Private_Key_A = Math.floor(Math.random() * (10 - 1 + 1) + 1);
    Secret_A = power(Primitive, Private_Key_A, Prime_No);
    getPublicSecret(Secret_A);
  }, []);

  const handleRefreshToken = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      // new FormData()
      // require
      const data = JSON.stringify({
        grant_type: "refresh_token",

        refresh_token: localStorage.getItem("refresh_token"),
        keycloak: window.__ENV__.REACT_APP_KEYCLOACK,
        client_id: localStorage.getItem("client_id"),
      });
      const login = await Axios.post(
        "/auth/refresh-token",
        data,
        { headers }
        // const refreshToken = localStorage.getItem("refresh_token");
      );

      // important to clear first because previous logged in might contain some inboxId or imp data

      if (login.status == 200) {
        const { data } = login;
        sessionStorage.setItem("jwt_token", data.access_token);
        sessionStorage.setItem("sessionId", data.session_state);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("client_id", window.__ENV__.REACT_APP_CLIENT_ID);
        localStorage.setItem("expires_in", data.expires_in);
        ReactDOM.render(<App />, document.getElementById("root"));
      }
    } catch (error) {
      localStorage.clear();
      const errMsg = error.response.data.error_description;
      setCred({
        username: "",
        password: "",
        error: errMsg,
      });
      // dispatch(setSnackbar(true, "error", error));
    }
  };

  return (
    <>
      {/* <ParticlesBackground /> */}

      {userName ? (
        <Loading />
      ) : (
        <div
          className="app"
          style={{
            backgroundImage: `
            linear-gradient(118deg, rgb(88 86 86 / 19%), rgb(73 75 77 / 43%)), url(${process.env.PUBLIC_URL}/assets/images/clouds.webp)`,
          }}
        >
          <Slide
            direction="up"
            className="sign-in-alert"
            in={Cred.error ? true : false}
            mountOnEnter
            unmountOnExit
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => {
                setCred({ ...Cred, error: false });
              }}
            >
              {Cred.error}
            </Alert>
          </Slide>

          <div className="form-animate">
            <div className="eoffice-img-Con">
              <img
                src={
                  process.env.PUBLIC_URL + "/assets/images/logo-paperless2.png"
                }
                alt="eOffice.png"
              />
              <span>
                {" "}
                Solutions Designed for Your Business eOffice for Government,
                Procurement Automation, Health Records and may more..
              </span>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <h4>Sign In</h4>
              <TextField
                autoComplete="off"
                required
                fullWidth
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
                size="small"
                name="username"
                label="Username"
                variant="outlined"
                value={Cred.username}
                onChange={(e) => {
                  setCred({ ...Cred, [e.target.name]: e.target.value });
                }}
              />
              <TextField
                autoComplete="off"
                required
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <Visibility
                            style={{
                              color: "#fe9832",
                            }}
                          />
                        ) : (
                          <VisibilityOff
                            style={{
                              color: "#fe9832",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                size="small"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                value={Cred.password}
                onChange={(e) => {
                  setCred({ ...Cred, [e.target.name]: e.target.value });
                }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                className="sign-in-submit"
                style={{ background: "#fe9832", color: "white" }}
                disabled={!success}
              >
                {!success ? (
                  <CircularProgress size={24} className="login-disable-btn" />
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
            <Avatar className="form-icon">
              <Lock />
            </Avatar>
            <span className="form-border"></span>
          </div>
        </div>
      )}
    </>
  );
};
export default LoginPage;
