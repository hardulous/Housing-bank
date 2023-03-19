import React from "react";
import "./logout.css";
import ReactDOM from "react-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useEffect, useState } from "react";
import HomeIcon from "@material-ui/icons/Home";
import PaginationComp from "app/views/utilities/PaginationComp";
import Axios from "axios";
import Cookies from "js-cookie";
import Feedback from "./Feedback";
import LoginPage from "LoginPage";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { CSVLink } from "react-csv";
import { IconButton, Tooltip } from "@material-ui/core";
import history from "../../../../history"

const columns = [
  {
    id: "size",
    label: "Action",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Message",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

const Logout = () => {
  const [expoertrowdata, setExpoertrowdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [user, setUser] = useState("");
  const [auth, setAuth] = useState("");
  let username = localStorage.getItem("username");

  const getApidata = async () => {
    try {
      setAuth(sessionStorage.getItem("jwt_token"));
      setUser(localStorage.getItem("username"));

      const { data } = await Axios.get("/audit_view_service/api/getaudit", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          username: username,
          sessionId: sessionStorage.getItem("sessionId"),
        },
      });
      setExpoertrowdata(data);
    } catch (error) {}
  };

  useEffect(() => {
    getApidata();
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (expoertrowdata) {
      setTotalCount(expoertrowdata.length);
      Cookies.set("userActivities", expoertrowdata);
    }
  }, [expoertrowdata]);

  const gotohome = () =>{
    ReactDOM.render(<LoginPage />, document.getElementById("root"));
    history.push({
      pathname:"/eoffice/login"
    })
  }

  return (
    <>
      {/* -------------------------------------------NAV_BAR START--------------------------------------------- */}
      <div className="topbardivmain">
        <div className="topbardivleft">
          <div className="topbardivleftchild">
            <img
              src={process.env.PUBLIC_URL + "/assets/images/logo-paperless.png"}
            ></img>
          </div>
        </div>
        <div className="topbardivright">
          <div className="topbardivrightchild">
            <CSVLink data={expoertrowdata} filename="User-Session-data">
              {" "}
              <IconButton>
                <Tooltip title="Download Session data " aria-label="Download">
                  <ArrowDownwardIcon style={{ color: "white" }} />
                </Tooltip>
              </IconButton>
            </CSVLink>
            <Tooltip title={"Home"} aria-label="Home">
              <IconButton onClick={gotohome}>
                <HomeIcon style={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------NAV_BAR END------------------------------------------------------------ */}

      <div className="table">
        <div className="tablemain">
          <Paper
            style={{
              position: "relative",
              borderRadius: "8px",
              border: `1px solid "#727070" : "#c7c7c7"`,
            }}
            sx={{ overflow: "hidden" }}
          >
            <TableContainer  style={{ maxHeight: "27rem", minHeight: "27rem" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          paddingLeft: "8rem",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expoertrowdata
                    .slice(
                      currentPage * pageSizes + 1,
                      (currentPage + 1) * pageSize
                    )
                    .map((data) => {
                      return (
                        <TableRow className="bodyrow" key={data.id}>
                          <TableCell
                            style={{ paddingLeft: "8rem" }}
                            component="th"
                            scope="row"
                          >
                            {data.action}
                          </TableCell>
                          <TableCell align="right">{data.message}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <PaginationComp
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              pageSizes={pageSizes}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
            />
          </Paper>
        </div>
      </div>
      <Feedback user={user} auth={auth} />
    </>
  );
};

export default Logout;
