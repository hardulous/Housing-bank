import React, { Fragment } from "react";
import { Icon, Tooltip } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import HomeIcon from "@material-ui/icons/Home";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const Breadcrumb = ({ routeSegments, otherData }) => {
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);

  return (
    <div className="flex flex-middle position-relative">
      <NavLink to="/eoffice/dashboard/analytics">
        <HomeIcon
          fontSize="small"
          style={{ color: theme ? "rbg(5 100 200)" : "#FFAF38" }}
        />
      </NavLink>
      <div
        style={{
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        {routeSegments
          ? routeSegments.map((route, index) => (
              <Fragment key={index}>
                <ArrowForwardIosIcon
                  style={{ fontSize: ".8rem", color: theme ? "#fff" : "gray" }}
                />
                {index !== routeSegments.length - 1 ? (
                  <NavLink to={route.path}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: theme ? "rbg(5 100 200)" : "#FFAF38",
                        fontWeight: "bold",
                      }}
                      className="capitalize"
                    >
                      {route.name}
                    </span>
                  </NavLink>
                ) : (
                  <span style={{ fontSize: "12px" }} className="capitalize">
                    {route.name}
                  </span>
                )}
              </Fragment>
            ))
          : null}
        {otherData && (
          <div
            style={{
              flexGrow: 1,
              display: "flex",
              marginLeft: "12px",
              gap: "14px",
            }}
          >
            {otherData.map((data, index) => (
              <Fragment key={index}>
                {index !== otherData.length - 1 ? (
                  <span style={{ fontSize: "12px" }} className="capitalize">
                    &nbsp;|{" "}
                    <span style={{ fontWeight: "800" }}>{data.key} - </span>
                    {data.value}
                  </span>
                ) : (
                  <span style={{ fontSize: "12px" }} className="capitalize">
                    &nbsp;|{" "}
                    <span style={{ fontWeight: "800" }}>{data.key} - </span>
                    {data.value}
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
