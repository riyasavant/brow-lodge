import Head from "next/head";
import { Box, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { useAuthContext } from "src/auth/authContext";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import BuildingOfficeIcon from "@heroicons/react/24/solid/BuildingOfficeIcon";
import FolderMinusIcon from "@heroicons/react/24/solid/FolderMinusIcon";
import DashboardCard from "src/components/DashboardCard";

const FORM_CARDS = [
  {
    title: "Eyelash Extension Consultation",
    icon: <FolderMinusIcon />,
    onAdd: "/forms/eyelash-extension/add",
    onView: "/forms/eyelash-extension",
  },
  {
    title: "Waxing Consultation",
    icon: <FolderMinusIcon />,
    onAdd: "/forms/waxing/add",
    onView: "/forms/waxing",
  },
  {
    title: "Eyelash and Brow Tint Consultation",
    icon: <FolderMinusIcon />,
    onAdd: "/forms/tinting/add",
    onView: "/forms/tinting",
  },
];

const PROFILE_CARDS = [
  {
    title: "Customers",
    subHeader: "List all customers present or add new",
    icon: <UsersIcon />,
    onAdd: "/customers/add",
    onView: "/customers",
  },
  {
    title: "Staff",
    subHeader: "List all staff present or add new",
    icon: <BuildingOfficeIcon />,
    onAdd: "/staff/add",
    onView: "/staff",
  },
];

const Page = () => {
  const { user } = useAuthContext();
  return (
    <>
      <Head>
        <title>Overview | Brow Lodge</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 4,
        }}
      >
        <h1>{`Welcome, ${user?.Staff?.firstName}!`}</h1>
        <Grid container spacing={3}>
          {PROFILE_CARDS.map((item, index) => (
            <Grid xs={12} sm={4} key={index}>
              <DashboardCard {...item} />
            </Grid>
          ))}
        </Grid>
        <h3 style={{ marginTop: "50px" }}>Forms</h3>
        <Grid container spacing={3}>
          {FORM_CARDS.map((form, index) => {
            return (
              <Grid xs={12} sm={6} md={4} key={index}>
                <DashboardCard {...form} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
