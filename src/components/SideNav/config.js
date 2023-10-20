import HomeIcon from "@heroicons/react/24/solid/HomeIcon";
import BuildingOfficeIcon from "@heroicons/react/24/solid/BuildingOfficeIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import FolderMinusIcon from "@heroicons/react/24/solid/FolderMinusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Dashboard",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Customers",
    path: "/customers",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Staff",
    path: "/staff",
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOfficeIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Forms",
    path: "/forms",
    icon: (
      <SvgIcon fontSize="small">
        <FolderMinusIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Account",
    path: "/account",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
];
