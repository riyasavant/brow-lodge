import Head from "next/head";
import { Box } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { useAuthContext } from "src/auth/authContext";

const now = new Date();

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
        <h1>{`Welcome, ${user?.Staff?.preferredName}`}</h1>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
