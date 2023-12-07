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
import CustomTable from "src/components/Table";
import { useRouter } from "next/router";
import useFilter from "src/utils/useFilter";
import useApiStructure from "src/api/structure";

const headers = [
  { key: "preferredName", label: "Name", sort: true },
  { key: "email", label: "Email", sort: true },
  { key: "gender", label: "Gender", sort: true },
];

const searchData = [
  { value: "preferredName", label: "Name" },
  { value: "email", label: "Email" },
  { value: "gender", label: "Gender" },
];

const Page = () => {
  const router = useRouter();
  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { sort, search, setSearch, setSort, resetSearch } = useFilter({
    column: "preferredName",
    value: "ASC",
  });
  const api = useApiStructure("/staff-profile");

  useEffect(() => {
    api
      .getAll(page, rowsPerPage, sort, search)
      .then((res) => {
        setResponse(res.data);
      })
      .catch(() => {});
  }, [rowsPerPage, page, sort, search]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const onEdit = (id) => {
    router.push(`/staff/${id}`);
  };

  const onDelete = (id) => {
    api
      .deleteEntry(id)
      .then(() => {
        api
          .getAll(page, rowsPerPage, sort, search)
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
              onSort={setSort}
              sort={sort}
              onResetSearch={resetSearch}
              onSearch={setSearch}
              search={searchData}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
