import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  Button,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import Form from "src/sections/forms/form";

const Page = () => {
  return (
    <>
      <Head>
        <title>Forms | Brow Lodge</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Forms</Typography>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Form
                  title="Eyelash Extension Consultation Card"
                  redirectLink="/forms/eyelash-extension"
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
