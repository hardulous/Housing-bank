import SignIn from "./SignIn";
import NotFound from "./NotFound";

const settings = {
  activeLayout: "layout1",
  layout1Settings: {
    topbar: {
      show: false
    },
    leftSidebar: {
      show: false,
      mode: "close"
    }
  },
  layout2Settings: {
    mode: "full",
    topbar: {
      show: false
    },
    navbar: { show: false }
  },
  secondarySidebar: { show: false },
  footer: { show: false }
};

const sessionRoutes = [
  // {
  //   path: "/eoffice/signin",
  //   component: SignIn,
  //   settings
  // },
  {
    path: "/eoffice/404",
    component: NotFound,
    settings
  }
];

export default sessionRoutes;
