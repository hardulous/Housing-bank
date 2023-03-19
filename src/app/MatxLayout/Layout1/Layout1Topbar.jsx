import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import {
  FormControl,
  IconButton,
  MenuItem,
  withStyles,
  MuiThemeProvider,
  Select,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
} from "@material-ui/core";
import { connect } from "react-redux";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { logoutUser } from "app/redux/actions/UserActions";
import {
  loadUserRoleData,
  changeTheme,
  myInfo,
  getPersonalInfo,
  sideNav,
  sidenavChange,
} from "../../camunda_redux/redux/action";
import { PropTypes } from "prop-types";
import { MatxMenu } from "./../../../matx";
import { isMdScreen } from "utils";
import NotificationBar from "../SharedCompoents/NotificationBar";
import {
  changingTableStatePA,
  changingTableState,
  changingTableStateInbox,
  changingTableStateOutbox,
  changingTableStateCabinet,
} from "../../camunda_redux/redux/action/apiTriggers";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Cookies from "js-cookie";
import { withTranslation } from "react-i18next";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import InfoForm from "app/views/Personnel/InfoForm";
import Draggables from "react-draggable";
import i18next from "i18next";
import history from "history.js";
import Logout from "app/views/user-activity/logout/Logout";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import Audit from "app/views/user-activity/logout/Aduiddisable";
import Aduiddisable from "app/views/user-activity/logout/Aduiddisable";
import { setUserData } from "../../redux/actions/UserActions";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

const PaperComponent = (props) => {
  return (
    <Draggables
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggables>
  );
};

const AppWrapper = () => {
  const store = createStore(rootReducer);
};

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
});

const elem = document.documentElement;
class Layout1Topbar extends Component {
  state = {
    fullScreen: false,
    comboValue: "",
    comboList: [],
    lightMode: Cookies.get("theme") === "red" ? true : false,
    openInfo: false,
    AuditD: false,
    lang: Cookies.get("i18next"),
  };

  UNSAFE_componentWillMount() {
    const department = localStorage.getItem("username");
    this.props.loadUserRoleData(department).then((resp) => {
      let tempArr = [];
      try {
        tempArr.push({
          ...resp.data[0],
          apptDisplay: resp.data[0].deptUsername,
          username: true,
        });
        for (let x = 0; x < resp.data.length; x++) {
          tempArr.push({ ...resp.data[x], username: false });
        }
        if (tempArr.length > 0) {
          this.setState({
            comboList: tempArr,
            comboValue: JSON.stringify(tempArr[0]),
          });
          sessionStorage.setItem("role", tempArr[0].deptRole);
          sessionStorage.setItem("department", tempArr[0].deptName);
          sessionStorage.setItem("pklDirectrate", tempArr[0].deptDisplayName);
          sessionStorage.setItem(
            "displayUserName",
            tempArr[0].deptDisplayUsername
          );
          this.props.setUserData({
            role: {
              ...tempArr[0],
              username: localStorage.getItem("username"),
            },
            roleArr: tempArr,
          });
        }
      } catch (e) {
        if (e.message === "Cannot read property 'roleName' of undefined") {
          this.props.history.push("/eoffice/404");
        }
      }
    });

    if (Cookies.get("theme") === "darkTheme") {
      document.getElementById(
        "theme"
      ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion-dark.css`;
    }
  }

  // componentDidUpdate() {
  //   this.setState({ lang: Cookies.get("i18next") });
  // }

  componentDidMount() {
    const username = localStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);

    // full screen handler
    const handleResize = () => {
      if (
        document.webkitIsFullScreen ||
        document.mozFullscreen ||
        document.mozFullScreenElement
      ) {
        // console.log("FS mode");
        this.setState({ fullScreen: true });
      } else {
        // console.log("DS mode");
        this.setState({ fullScreen: false });
      }
    };
    window.addEventListener("resize", handleResize);

    window.addEventListener("keydown", (e) => {
      if (e.key == "F11") {
        if (this.state.fullScreen == false) {
          window.removeEventListener("resize", handleResize);
          // console.log(`pressed ${e.key} for FS`);
          this.setState({ fullScreen: true });
        }
        setTimeout(() => {
          window.addEventListener("resize", handleResize);
        }, 1000);
      }
    });

    username &&
      this.props.getPersonalInfo(formData).then((res) => {
        if (res.status === "OK") {
          this.props.myInfo(true);
        } else {
          this.props.myInfo(false);
        }
      });

    fetch(window.__ENV__.REEACT_IP_ADDRESS)
      .then((response) => response.json())
      .then((resp) => {
        sessionStorage.setItem("ipAddress", resp.ip);
      });
  }

  openFullScreen = () => {
    this.setState({ fullScreen: true });
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      // elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  closeFullScreen = () => {
    this.setState({ fullScreen: false });
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
    setLayoutSettings({
      ...settings,
      layout1Settings: {
        ...settings.layout1Settings,
        leftSidebar: {
          ...settings.layout1Settings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  handleSidebarToggle = () => {
    let { settings } = this.props;
    let { layout1Settings } = settings;

    let mode;
    if (isMdScreen()) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    this.updateSidebarMode({ mode });
  };

  handleSignOut = () => {
    this.props.setUserData({
      role: {},
      roleArr: [],
    });
    ReactDOM.render(<Logout />, document.getElementById("root"));
  };

  handleThemeChangeBlue = (e) => {
    let { settings } = this.props;
    let { layout1Settings } = settings;
    this.setState({ lightMode: false });
    let sideBarTheme, tobBarTheme, buttonTheme;
    sideBarTheme = layout1Settings.leftSidebar.theme = "blue";
    tobBarTheme = layout1Settings.topbar.theme = "blue";
    tobBarTheme = layout1Settings.footer.theme = "#001049";
    buttonTheme = layout1Settings.activeButton.theme = "blue";
    this.updateSidebarMode({ sideBarTheme, tobBarTheme, buttonTheme });
    Cookies.set("theme", "blue");
    this.props.changeTheme(false);
    setTimeout(() => {
      document.getElementById(
        "theme"
      ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion.css`;
    }, 200);
    // "%PUBLIC_URL%/assets1/css/syncfusion.css";
  };

  handleThemeChangeRed = (e) => {
    let { settings } = this.props;
    let { layout1Settings } = settings;
    this.setState({ lightMode: true });
    let sideBarTheme, tobBarTheme, buttonTheme;
    sideBarTheme = layout1Settings.leftSidebar.theme = "darkTheme";
    tobBarTheme = layout1Settings.topbar.theme = "darkTheme";
    tobBarTheme = layout1Settings.footer.theme = "#001049";
    buttonTheme = layout1Settings.activeButton.theme = "darkTheme";
    this.updateSidebarMode({ sideBarTheme, tobBarTheme, buttonTheme });
    Cookies.set("theme", "darkTheme");
    this.props.changeTheme(true);
    setTimeout(() => {
      document.getElementById(
        "theme"
      ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion-dark.css`;
    }, 200);
    // 'https://cdn.syncfusion.com/ej2/material-dark.css';
  };

  handleChange = (event) => {
    let data = JSON.parse(event.target.value);
    const roleName = data.deptRole;
    const dept = data.deptName;
    sessionStorage.setItem("role", roleName);
    sessionStorage.setItem("department", dept);
    sessionStorage.setItem("pklDirectrate", data.deptDisplayName);
    sessionStorage.setItem("displayUserName", data.deptDisplayUsername);
    this.props.setUserData({
      role: {
        ...data,
        username: localStorage.getItem("username"),
      },
    });
    this.setState({ comboValue: event.target.value });
    this.refreshTables();
  };

  refreshTables = () => {
    let trigger = false;
    setTimeout(() => {
      trigger = true;
      this.props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
      this.props.changingTableState(trigger, "CHANGE_PA_FILE");
      this.props.changingTableStateInbox(trigger, "CHANGE_INBOX");
      this.props.changingTableStateOutbox(trigger, "CHANGE_OUTBOX");
      this.props.changingTableStateCabinet(trigger, "CHANGE_CABINET");
    }, 1000);
  };

  render() {
    const { fullScreen, comboList, lightMode } = this.state;
    let {
      theme,
      settings,
      className,
      style,
      darkState,
      t,
      showHam,
      toggleHam,
    } = this.props;
    const topbarTheme =
      settings.themes[settings.layout1Settings.topbar.theme] || theme;
    let { layout1Settings } = settings;
    const serviceNumber = localStorage.getItem("username");
    return (
      <MuiThemeProvider theme={topbarTheme}>
        <div className="topbar">
          <div
            className={`topbar-hold ${className}`}
            style={Object.assign(
              {},
              { background: topbarTheme.palette.primary.main },
              style
            )}
          >
            <div className="flex flex-space-between flex-middle h-100">
              <div className="flex">
                <IconButton
                  onClick={() => {
                    // this.handleSidebarToggle()
                    toggleHam(!showHam);
                  }}
                  className="topbar-toggle-btn"
                >
                  {showHam ? <CloseIcon /> : <MenuIcon />}
                </IconButton>

                <div className="topbar-img">
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/logo-paperless.png"
                    }
                    alt={"EOffice"}
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      maxWidth: "75%",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-middle top-bar-icon-wrapper">
                <FormControl
                  className="topbarSelect"
                  style={{
                    minWidth: 300,
                    background: "white",
                    borderRadius: "50px",
                    textAlignLast: "center",
                  }}
                >
                  <Select
                    native
                    value={this.state.comboValue}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "age",
                      id: "age-native-simple",
                    }}
                    style={{ fontSize: "12px", color: "black" }}
                  >
                    {/* {comboList.map((x) => (
                      <option key={x.deptRole}> {x.deptRole}</option>
                    ))} */}
                    {comboList.map((x, i) => (
                      <option key={i + 1} value={JSON.stringify(x)}>
                        {x.apptDisplay}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title={t("AUDIT INFO")} aria-label="AUDIT INFO">
                  <IconButton onClick={() => this.setState({ AuditD: true })}>
                    <AssignmentTurnedInIcon
                      style={{
                        fontSize: "1.1rem",
                        color: "white",
                        padding: "3px",
                        marginTop: "3px",
                      }}
                    />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t("my_info")} aria-label="myInfo">
                  <IconButton
                    id="my_info_button"
                    onClick={() => this.setState({ openInfo: true })}
                  >
                    <PersonOutlineOutlinedIcon
                      style={{ fontSize: "1.1rem", color: "white" }}
                    />
                  </IconButton>
                </Tooltip>

                <div style={{ display: "flex" }}>
                  {this.state.lang == "en" ? (
                    <Tooltip title="हिन्दी">
                      <IconButton
                        id="hindi_lang_Button"
                        onClick={() => {
                          i18next.changeLanguage("hi");
                          this.setState({ lang: "hi" });
                        }}
                      >
                        <div
                          style={{
                            fontSize: "small",
                            color: "white",
                          }}
                        >
                          अ
                        </div>
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="ENGLISH">
                      <IconButton
                        id="eng_lang_Button"
                        onClick={() => {
                          i18next.changeLanguage("en");
                          this.setState({ lang: "en" });
                        }}
                      >
                        <div
                          style={{
                            fontSize: "medium",
                            color: "white",
                          }}
                        >
                          A
                        </div>
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
                {this.props.appTheme ? (
                  <Tooltip title={t("dark_mode")} aria-label="DarkMode">
                    <IconButton
                      id="darkMode_Button"
                      onClick={this.handleThemeChangeBlue}
                    >
                      <Brightness7Icon style={{ fontSize: "1.1rem" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("light_mode")} aria-label="LightMode">
                    <IconButton
                      id="lightMode_Button"
                      onClick={this.handleThemeChangeRed}
                    >
                      <Brightness4Icon
                        style={{ fontSize: "1.1rem", color: "#fff" }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton id="notification_Button">
                  <NotificationBar />
                </IconButton>
                <Tooltip title={t("logout")} aria-label="Logout">
                  <IconButton
                    id="logout_Button"
                    onClick={this.handleSignOut}
                    color="secondary"
                  >
                    <ExitToAppIcon style={{ fontSize: "1.2rem" }} />
                  </IconButton>
                </Tooltip>
                {fullScreen ? (
                  <Tooltip
                    title={t("exit_fullScreen")}
                    aria-label="Exit FullScreen"
                  >
                    <span>
                      <IconButton
                        id="closeFullScreen_Button"
                        onClick={this.closeFullScreen}
                      >
                        <FullscreenExitIcon
                          style={{ color: "#fff", fontSize: "1.4rem" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("fullScreen")} aria-label="FullScreen">
                    <span>
                      <IconButton
                        id="fullScreen_Button"
                        onClick={this.openFullScreen}
                      >
                        <FullscreenIcon
                          style={{ color: "#fff", fontSize: "1.4rem" }}
                        />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={this.state.openInfo}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
        >
          <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
            {t("personal_information")}
            <Tooltip title={t("close")}>
              <IconButton
                id="myInfo_closeIcon"
                aria-label="close"
                onClick={() => this.setState({ openInfo: false })}
                color="primary"
                style={{ float: "right", position: "relative", top: "-9px" }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <InfoForm
            handleSubmit={(val) => this.setState({ openInfo: val })}
            // disableBtn={(val) => this.setState({ blnDisableButtoms: val })}
            // disableBtn={(val) => this.setState({ blnDisableButtoms: val })}
          />
        </Dialog>

        {/* ----------------------------------- Audit Dialog --------------------- */}

        <Dialog
          open={this.state.AuditD}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
        >
          <DialogTitle
            id="draggable-dialog-title"
            style={{ cursor: "move", userSelect: "none" }}
          >
            {t("AUDIT INFORMATION")}
            <Tooltip title={t("close")}>
              <IconButton
                aria-label="close"
                onClick={() => this.setState({ AuditD: false })}
                color="primary"
                style={{ float: "right", position: "relative", top: "-9px" }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <DialogContent dividers>
            <Aduiddisable />
          </DialogContent>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

Layout1Topbar.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadUserRoleData: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  changeTheme: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    setLayoutSettings: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    loadUserRoleData: PropTypes.func.isRequired,
    settings: state.layout.settings,
    appTheme: state.theme,
    paInfo: state.myInfo,
    setUserData: PropTypes.func.isRequired,
  };
};

export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(mapStateToProps, {
      setLayoutSettings,
      logoutUser,
      loadUserRoleData,
      changingTableStatePA,
      changingTableState,
      changingTableStateInbox,
      changingTableStateOutbox,
      changingTableStateCabinet,
      changeTheme,
      myInfo,
      getPersonalInfo,
      sideNav,
      sidenavChange,
      setUserData,
    })(withTranslation()(Layout1Topbar))
  )
);
