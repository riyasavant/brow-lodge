import { useCallback, useState, useEffect } from "react";
import Head from "next/head";
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
import { getStaffProfiles, deleteStaff } from "src/api/lib/staff";
import CustomTable from "src/components/Table";
import { useRouter } from "next/router";

const headers = [
  { key: "preferredName", label: "Name", sort: true },
  { key: "email", label: "Email", sort: true },
  { key: "gender", label: "Gender", sort: true },
];

const Page = () => {
  const router = useRouter();
  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sort, setSort] = useState({ column: "preferredName", value: "ASC" });

  useEffect(() => {
    getStaffProfiles(page, rowsPerPage, sort)
      .then((res) => {
        setResponse(res.data);
      })
      .catch(() => {});
  }, [rowsPerPage, page, sort]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const onSort = useCallback((column, value) => {
    setSort({ column, value });
  }, []);

  const onEdit = (id) => {
    router.push(`/staff/${id}`);
  };

  const onDelete = (id) => {
    deleteStaff(id)
      .then((res) => {
        getStaffProfiles(page, rowsPerPage)
          .then((res) => {
            setResponse(res.data);
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <>
      <Head>
        <title>Staff | Brow Lodge</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Staff</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push("/staff/add")}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomTable
              count={response.total}
              items={response.data}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              headers={headers}
              onDelete={onDelete}
              onEdit={onEdit}
              onSort={onSort}
              sort={sort}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
