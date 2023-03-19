import {
  Box,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import React, { useState } from "react";
import AdminNavbar from "./Components/AdminNavbar";
import { useTranslation } from "react-i18next";
import Dashboard from "./Components/Dashboard/Dashboard";
import UserSection from "./Components/Users/UserSection";
import RolesSection from "./Components/Roles/RolesSection";
import DepartmentSection from "./Components/Departments/DepartmentSection";

const useStyles = makeStyles({
  navbarGrid: {
    alignSelf: "self-start",
    padding: "0px !important",
    boxShadow: "0px 4px 4px #0000001f",
    marginLeft: "1.5rem",
    borderRadius:"10px",
    width:"12%"
  },
  adminHome: {
    display:'flex',
    height: "100%",
    justifyContent:'space-between'
  },
  section4:{
    display: "flex",
    justifyContent:'center',
    alignItems:'center',
    width:"88%"
  }
});

const AdminHome = () => {
  
  const {t} = useTranslation();

  const cls = useStyles();

  const [SelectedTab, setSelectedTab] = useState(0);

  const changeNavigation = (e,val) => {
    setSelectedTab(val);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <div>
        <Grid container justifyContent="center" spacing={2} style={{
          margin:"2px"
        }}>
          <Grid item xs={4}>
            <Breadcrumb
              routeSegments={[
                { name: t("admin"), path: "/admin/dashboard" },
              ]}
            />
          </Grid>
          <Grid item xs={8}></Grid>
        </Grid>
      </div>

      <div className={cls.adminHome}>
        <div className={cls.navbarGrid}>
         <Paper style={{borderRadius:"10px"}}>
         <AdminNavbar
            changeNavigation={changeNavigation}
            SelectedTab={SelectedTab}
          />
         </Paper>
        </div>
        
        {/* Conditionally showing component based on tab change */}
        {
          SelectedTab == 0 ? 
            
          <div className={cls.section4}>
            <Dashboard changeNavigation={changeNavigation}/>
          </div>

          : SelectedTab == 1 ?
            
           <div className={cls.section4}>
             <UserSection changeNavigation={changeNavigation}/>
           </div>

          : SelectedTab == 2 ?
          
           <div className={cls.section4}>
             <RolesSection changeNavigation={changeNavigation}/>
           </div>

          : SelectedTab == 3 ?

           <div className={cls.section4}>
             <DepartmentSection changeNavigation={changeNavigation}/>
           </div>

          : "" 

        }

      </div>

    </Box>
  );
};

export default AdminHome;
