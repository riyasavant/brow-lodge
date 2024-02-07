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
import { useRouter } from "next/router";
import CustomTable from "src/components/Table";
import useFilter from "src/utils/useFilter";
import useApiStructure from "src/api/structure";
import { useAuthContext } from "src/auth/authContext";
import { useAuth } from "src/auth/useAuth";

const searchData_su = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "dateOfBirth", label: "Date of Birth" },
  { value: "email", label: "Email" },
  { value: "gender", label: "Gender" },
  { value: "personalContactNumber", label: "Contact Number" },
  { value: "address", label: "Address" },
];

const search_admin = [
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "dateOfBirth", label: "Date of Birth" },
  { value: "gender", label: "Gender" },
];

const headers_su = [
  { key: "firstName", label: "First Name", sort: true },
  { key: "lastName", label: "Last Name", sort: true },
  { key: "email", label: "Email", sort: true },
  { key: "gender", label: "Gender", sort: true },
  { key: "personalContactNumber", label: "Contact Number", sort: true },
  { key: "address", label: "Address", sort: true },
  { key: "dateOfBirth", label: "Date of Birth", sort: true },
];

const headers_admin = [
  { key: "firstName", label: "First Name", sort: true },
  { key: "lastName", label: "Last Name", sort: true },
  { key: "dateOfBirth", label: "Date of Birth", sort: true },
  { key: "gender", label: "Gender", sort: true },
];

const Page = () => {
  const auth = useAuth();
  const { user } = useAuthContext();
  const roles = user.Roles || [];
  const currentRole = Array.isArray(roles) ? roles[0] : {};
  const permissions = currentRole.permissions || {};
  const isAdmin = currentRole?.name === "Admin";
  const customerPermissions = permissions["clientProfile"].actions || {};

  const HEADERS = isAdmin ? headers_admin : headers_su;
  const SEARCH = isAdmin ? search_admin : searchData_su;

  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const { sort, search, setSearch, setSort, resetSearch } = useFilter({
    column: "firstName",
    value: "ASC",
  });
  const api = useApiStructure("/client-profile");

  useEffect(() => {
    api
      .getAll(page, rowsPerPage, sort, search)
      .then((res) => {
        setResponse(res.data);
      })
      .catch(() => {});
  }, [rowsPerPage, page, sort, search]);

  useEffect(() => {
    auth.refreshClientData();
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const onEdit = (id) => {
    router.push(`/customers/${id}`);
  };

  const onDelete = (id) => {
    api
      .deleteEntry(id)
      .then((res) => {
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
        <title>Customers | Brow Lodge</title>
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
                <Typography variant="h4">Customers</Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push("/customers/add")}
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
              headers={HEADERS}
              onDelete={onDelete}
              onEdit={onEdit}
              onSearch={setSearch}
              onSort={setSort}
              sort={sort}
              onResetSearch={resetSearch}
              search={SEARCH}
              permissions={customerPermissions}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
