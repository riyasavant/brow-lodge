import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { CustomersTable } from "src/sections/customer/customers-table";
import { applyPagination } from "src/utils/apply-pagination";
import { getClients } from "src/api/lib/client";

const now = new Date();

const mock = {
  preferredName: "Riya",
  email: "riya@gmail.com",
  gender: "Female",
};

const useCustomers = (page, rowsPerPage) => {
  const [response, setResponse] = useState({ data: [mock], total: 1 });

  useEffect(() => {
    getClients()
      .then((res) => setResponse(res))
      .catch(() => {});
  }, []);

  return useMemo(() => {
    return {
      customers: applyPagination(response.data, page, rowsPerPage),
      total: response.total,
    };
  }, [page, rowsPerPage]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { customers, total } = useCustomers(page, rowsPerPage);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Staff | Brow Lodge</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Staff</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomersTable
              count={total}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
