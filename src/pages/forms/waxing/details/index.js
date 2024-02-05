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
import useFilter from "src/utils/useFilter";
import useApiStructure from "src/api/structure";
import { useAuthContext } from "src/auth/authContext";

const headers = [
  { key: "date", label: "Date", sort: true },
  { key: "therapist", label: "Therapist", sort: true },
  { key: "skinBefore", label: "Skin Before", sort: true },
  { key: "treatment", label: "Treatment", sort: true },
  { key: "skinAfter", label: "Skin After", sort: true },
  { key: "careGiven", label: "After Care Given?", sort: true },
  { key: "clientSign", label: "Client Signature" },
];

const searchData = [
  { value: "date", label: "Date" },
  { value: "therapist", label: "Therapist" },
  { value: "skinBefore", label: "Skin Before" },
  { value: "treatment", label: "Treatment" },
  { value: "skinAfter", label: "Skin After" },
  { value: "careGiven", label: "After Care Given?" },
];

const parseData = (data) => {
  return data.map((form) => ({
    date: dayjs(form?.date || new Date()).format("DD/MM/YYYY"),
    therapist: form?.therapist || "",
    skinBefore: form?.skinBefore || "",
    skinAfter: form?.skinAfter || "",
    treatment: form?.treatment || "",
    careGiven: form?.careGiven || "",
    clientSign: form?.clientSign || "",
    id: form?.id,
  }));
};

const Page = () => {
  const { user } = useAuthContext();
  const roles = user.Roles || [];
  const currentRole = Array.isArray(roles) ? roles[0] : {};
  const permissions = currentRole.permissions || {};
  const waxDetailPermission =
    permissions["waxConsultationDetail"].actions || {};

  const api = useApiStructure("/wax-consultation-details");
  const router = useRouter();
  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { sort, search, setSearch, setSort, resetSearch } = useFilter({
    column: "date",
    value: "DESC",
  });

  useEffect(() => {
    api
      .getAllDetails(router.query.id, "Wax", page, rowsPerPage, sort, search)
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
    router.push(
      `/forms/waxing/details/${id}?name=${router.query.name}&formId=${router.query.id}`
    );
  };

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Waxing",
      isActive: false,
      link: "/forms/waxing",
    },
    { label: "Details", isActive: true },
  ];

  const onDelete = (id) => {
    api
      .deleteEntry(id)
      .then(() => {
        api
          .getAllDetails(
            router.query.id,
            "Wax",
            page,
            rowsPerPage,
            sort,
            search
          )
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
              <Stack spacing={3}>
                <Breadcrumb items={breadcrumbItems} />
                <Stack spacing={1}>
                  <Typography variant="h6">
                    Waxing Consultation Card Details
                  </Typography>
                  <Typography variant="h8" color="primary" fontWeight="bold">
                    {`Client: ${router.query.name}`}
                  </Typography>
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
                  onClick={() =>
                    router.push(
                      `/forms/waxing/details/add?id=${router.query.id}&name=${router.query.name}`
                    )
                  }
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
              sort={sort}
              onSearch={setSearch}
              onResetSearch={resetSearch}
              onSort={setSort}
              search={searchData}
              permissions={waxDetailPermission}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
