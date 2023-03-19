// import { MatxLoadable } from "./../../../matx";
import { authRoles } from "../../auth/authRoles";
import Loadable from "@loadable/component";
import Loading from "matx/components/MatxLoadable/Loading";

const Personnel = Loadable(() => import("./Personnel"), {
  fallback: <Loading />,
});

const FileView = Loadable(() => import("./FileViewTable"), {
  fallback: <Loading />,
});

const PersonnelRoutes = [
  {
    path: "/eoffice/personnel/file",
    component: Personnel,
    auth: authRoles.admin,
  },
  {
    path: "/eoffice/personnel/fileview",
    component: FileView,
    auth: authRoles.admin,
  },
];

export default PersonnelRoutes;
