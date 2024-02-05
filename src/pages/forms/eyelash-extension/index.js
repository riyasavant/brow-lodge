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
import dayjs from "dayjs";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/structure";
import useFilter from "src/utils/useFilter";
import { useAuthContext } from "src/auth/authContext";

const headers = [
  { key: "date", label: "Date", sort: true },
  { key: "name", label: "Client Name", sort: true },
  { key: "dateOfBirth", label: "Client Date of Birth", sort: true },
  { key: "technicianName", label: "Technician Name", sort: true },
  { key: "clientSign", label: "Client signature" },
];

const searchData = [
  { value: "Client.firstName", label: "Client Name" },
  { value: "date", label: "Date" },
  { value: "Client.dateOfBirth", label: "Client Date of Birth" },
  { value: "technicianName", label: "Technician Name" },
];

const parseData = (data) => {
  return data.map((form) => ({
    date: dayjs(form?.date || new Date()).format("DD/MM/YYYY"),
    name: form?.Client?.firstName + " " + form?.Client?.lastName || "",
    dateOfBirth: form?.Client.dateOfBirth || "",
    clientSign: form?.clientSign || "",
    technicianName: form?.technicianName || "",
    id: form?.id,
  }));
};

const Page = () => {
  const { user } = useAuthContext();
  const roles = user.Roles || [];
  const currentRole = Array.isArray(roles) ? roles[0] : {};
  const permissions = currentRole.permissions || {};
  const eePermission = permissions["eyelashExtension"].actions || {};

  const router = useRouter();
  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const api = useApiStructure("/eyelash-extension");
  const { sort, search, setSearch, setSort, resetSearch } = useFilter({
    column: "date",
    value: "DESC",
  });

  useEffect(() => {
    api
      .getAll(page, rowsPerPage, sort, search)
      .then((res) => {
        setResponse({
          data: parseData(res.data?.data),
          total: res.data?.total,
        });
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
    router.push(`/forms/eyelash-extension/${id}`);
  };

  const onDelete = (id) => {
    api
      .deleteEntry(id)
      .then(() => {
        api
          .getAll(page, rowsPerPage, sort, search)
          .then((res) => {
            setResponse({
              data: parseData(res.data?.data),
              total: res.data?.total,
            });
          })
          .catch(() => {});
      })
      .catch(() => {});
  };

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    { label: "Eyelash Extension", isActive: true, link: "" },
  ];

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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              spacing={4}
            >
              <Stack spacing={4}>
                <Breadcrumb items={breadcrumbItems} />
                <Typography variant="h5">
                  Eyelash Extension Consultation Card
                </Typography>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={() => router.push("/forms/eyelash-extension/add")}
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
              isRowClickable
              onRowClick={(id, name) =>
                router.push(
                  `/forms/eyelash-extension/details?id=${id}&name=${name}`
                )
              }
              sort={sort}
              onSort={setSort}
              onSearch={setSearch}
              onResetSearch={resetSearch}
              search={searchData}
              permissions={eePermission}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
