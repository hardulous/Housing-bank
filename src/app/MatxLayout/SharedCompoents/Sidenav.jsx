import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// import { navigations } from "../../navigations";

import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import MatxVerticalNav from "../../../matx/components/MatxVerticalNav/MatxVerticalNav";
import { withTranslation } from "react-i18next";
import { Icon, Tooltip } from "@material-ui/core";

import FolderIcon from "@material-ui/icons/Folder";
// import KitchenIcon from "@mui/icons-material/Kitchen";

import { Class, SupervisedUserCircle } from "@material-ui/icons";
import KitchenIcon from "@material-ui/icons/Kitchen";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import DraftsRoundedIcon from "@material-ui/icons/DraftsRounded";
import SearchIcon from "@material-ui/icons/Search";
import ContactMailIcon from "@material-ui/icons/ContactMail";

class Sidenav extends Component {
  state = {};

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    setLayoutSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  renderOverlay = () => (
    <div
      onClick={() => this.updateSidebarMode({ mode: "close" })}
      className="sidenav__overlay"
    />
  );
  render() {
    const { t , showHam , toggleHam } = this.props;

    const navigations = [
      {
        name: t("dashboard"),
        path: "/eoffice/dashboard/analytics",
        icon: (
          <Tooltip
            title={t("dashboard")}
            aria-label="Dashboard"
            style={{ marginTop: "10px" }}
            placement="right-start"
            arrow
          >
            <DashboardIcon fontSize="small" style={{ marginTop: "-10px" }} />
          </Tooltip>
        ),
      },
      {
        name: t("inbox"),
        path: "/eoffice/inbox/file",
        icon: (
          <Tooltip
            title={t("inbox")}
            aria-label="Inbox"
            placement="right-start"
            arrow
          >
            <DraftsRoundedIcon
              fontSize="small"
              style={{ marginTop: "-10px" }}
            />
          </Tooltip>
        ),
      },
      {
        name: t("outbox"),
        path: "/eoffice/outbox/file",
        icon: (
          <Tooltip
            title={t("outbox")}
            aria-label="Outbox"
            placement="right-start"
            arrow
          >
            <OpenInBrowserIcon
              fontSize="small"
              style={{ marginTop: "-10px" }}
            />
          </Tooltip>
        ),
      },
      {
        name: t("pa"),
        path: "/eoffice/personnel/file",
        icon: (
          <Tooltip
            title={t("pa")}
            aria-label="PA"
            placement="right-start"
            arrow
          >
            <MoveToInboxIcon fontSize="small" style={{ marginTop: "-10px" }} />
          </Tooltip>
        ),
      },
      // {
      //   name: t("initiate"),
      //   path: "/eoffice/initiate/file",
      //   icon: <Tooltip title={t("initiate")} aria-label="Initiate"><ViewQuiltIcon fontSize="normal" style={{ marginTop: '-10px' }} /></Tooltip>
      // },

      // {
      //   name: t("DMS"),
      //   path: "/eoffice/dms/DmsFolderStructure",
      //   icon: <Tooltip title={t("dms")} aria-label="DMS"><FolderIcon fontSize="small" style={{ marginTop: '-10px' }} /></Tooltip>
      // },

      {
        name: t("cabinet"),
        path: "/eoffice/cabinet/file",
        icon: (
          <Tooltip
            title={t("cabinet")}
            aria-label="cabinet"
            placement="right-start"
            arrow
          >
            <KitchenIcon fontSize="small" style={{ marginTop: "-10px" }} />
          </Tooltip>
        ),
      },
      {
        name: t("search"),
        path: "/eoffice/search",
        icon: (
          <Tooltip
            title={t("search")}
            aria-label="SEARCH"
            placement="right-start"
            arrow
          >
            <SearchIcon fontSize="small" style={{ marginTop: "-10px" }} />
          </Tooltip>
        ),
      },

      {
        name: t("admin"),
        path: "/eoffice/admin/dashboard",
        icon: (
          <Tooltip
            title={t("admin")}
            aria-label="admin"
            placement="right-start"
            arrow
          >
            <SupervisedUserCircle
              fontSize="small"
              style={{ marginTop: "-10px" }}
            />
          </Tooltip>
        ),
      },

      {
        name: t("RTI"),
        path: "/eoffice/rti/file",
        icon: (
          <Tooltip
            title={t("RTI")}
            aria-label="RTI"
            placement="right-start"
            arrow
          >
            <Class fontSize="small" style={{ marginTop: "-10px" }} />
          </Tooltip>
        ),
      },
      {
        name: t("MEETING"),
        path: "/eoffice/Meeting/meetingschedule",
        icon: (
          <Tooltip
            title={t("meeting")}
            aria-label="MEETING"
            placement="right-start"
            arrow
          >
            <ContactMailIcon fontSize="small" style={{ marginTop: "-10px" }} />
          </Tooltip>
        ),
      },
    ];

    return (
      <Fragment>
        {this.props.children}
        <MatxVerticalNav navigation={navigations} showHam={showHam} toggleHam={toggleHam} />
      </Fragment>
    );
  }
}
Sidenav.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  setLayoutSettings: PropTypes.func.isRequired,
  settings: state.layout.settings,
});
export default withRouter(
  connect(mapStateToProps, {
    setLayoutSettings,
  })(withTranslation()(Sidenav))
);
