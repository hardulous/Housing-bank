import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { Paper, withStyles } from "@material-ui/core";
import { isMdScreen, classList } from "utils";
import { renderRoutes } from "react-router-config";
import Layout1Topbar from "./Layout1Topbar";
import Layout1Sidenav from "./Layout1Sidenav";
import Footer from "../SharedCompoents/Footer";
import "./Layout1.css"
import AppContext from "app/appContext";

const styles = (theme) => {
  return {
    layout: {
      backgroundColor: theme.palette.background.default,
    },
  };
};

class Layout1 extends Component {
  state = {
    show: false,
    showHam: false,
  };

  oldScroll = 0;

  UNSAFE_componentWillMount() {
    // if (isMdScreen()) {
    //   this.updateSidebarMode({ mode: "close" });
    // }
  }

  componentWillUnmount() {}

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

  handleScroll = (event) => {
    this.setState({ show: true });
  };

  toggleHam = (val) => {
    this.setState({
      showHam: val,
    });
  };

  componentDidMount() {
    // window.addEventListener("scroll", (e) => {
    //   let currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value
    //   if (currentScroll > 0 && this.oldScroll <= currentScroll){
    //     this.oldScroll = currentScroll;
    //     this.setState({ show: true });
    //   }else{
    //     this.oldScroll = currentScroll;
    //     this.setState({ show: false });
    //   }
    // });
  }

  render() {
    let { settings, classes, theme } = this.props;
    let { layout1Settings } = settings;
    let layoutClasses = {
      [classes.layout]: true,
      [`${settings.activeLayout} sidenav-${layout1Settings.leftSidebar.mode} theme-${theme.palette.type} flex`]: true,
      "topbar-fixed": layout1Settings.topbar.fixed,
    };
    return (
      <AppContext.Consumer>
        {({ routes }) => (
          <div className={classList(layoutClasses)}>
            <Layout1Sidenav
              showHam={this.state.showHam}
              toggleHam={this.toggleHam}
            />

            <div className="content-wrap position-relative">
              <Layout1Topbar
                className="elevation-z8"
                showHam={this.state.showHam}
                toggleHam={this.toggleHam}
              />
              <div className={this.props.appTheme ? "darkTheme" : ""}>
                <Paper
                  className="content module-mount-container"
                  style={{
                    minHeight: "100vh",
                    backgroundColor: this.props.appTheme
                      ? "rgb(46 46 46)"
                      : "rgb(241 241 241)",
                  }}
                >
                  {renderRoutes(routes)}
                </Paper>
                <div className="my-auto" />
              </div>
              <Footer show={this.state.show} />

              {/* {!settings.perfectScrollbar && (
                <div className="scrollable-content">
                  {layout1Settings.topbar.show &&
                    !layout1Settings.topbar.fixed && <Layout1Topbar />}
                  <div
                    className={this.props.appTheme ? "darkTheme" : "lighTheme"}
                  >
                    <Paper
                      className="content"
                      style={{
                        minHeight: "100vh",
                        backgroundColor: this.props.appTheme
                          ? "rgb(46 46 46)"
                          : "rgb(241 241 241)",
                      }}
                    >
                      {renderRoutes(routes)}
                    </Paper>
                    <div className="my-auto" />
                  </div>
                  {settings.footer.show && !settings.footer.fixed && (
                    <Footer show={this.state.show} />
                  )}
                </div>
              )} */}
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

Layout1.propTypes = {
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  // console.log(state.layout);
  return {
    setLayoutSettings: PropTypes.func.isRequired,
    settings: state.layout.settings,
    appTheme: state.theme,
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, { setLayoutSettings })(Layout1)
);
