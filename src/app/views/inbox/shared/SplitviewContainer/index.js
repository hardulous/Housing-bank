import React from "react";
import { useState } from "react";
import "../../therme-source/material-ui/loading.css";
import { Loading } from "../../therme-source/material-ui/loading";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Grid } from "@material-ui/core";
import { Breadcrumb } from "matx";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import ViewOne from "../splitViewScreen/ViewOne";
import ViewTwo from "../splitViewScreen/ViewTwo";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { CgViewDay, CgViewSplit } from "react-icons/cg";
import { connect } from "react-redux";
import SplitViewProvider from "./Worker";
import SplitViewer from "./SplitViewer";

const SplitView = (props) => {
  const { t } = useTranslation();

  return (
    <SplitViewProvider>
        <SplitViewer/>
    </SplitViewProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
  };
};
export default connect(mapStateToProps, {})(SplitView);
