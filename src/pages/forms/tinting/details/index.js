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
  { key: "browColour", label: "Brow Colour", sort: true },
  { key: "lashColour", label: "Lash Colour", sort: true },
  {
    key: "overleafCondition",
    label: "Do any of the conditions overleaf apply to you?",
    sort: true,
  },
  { key: "careGiven", label: "After Care Leaflet Given?", sort: true },
  { key: "clientSign", label: "Client Signature" },
];

const searchData = [
  { value: "date", label: "Date" },
  { value: "therapist", label: "Therapist" },
  { value: "browColour", label: "Brow Colour" },
  { value: "lashColour", label: "Lash Colour" },
  {
    value: "overleafCondition",
    label: "Do any of the conditions overleaf apply to you?",
  },
  { value: "careGiven", label: "After Care Leaflet Given?" },
];

const parseData = (data) => {
  return data.map((form) => ({
    date: dayjs(form?.date || new Date()).format("DD/MM/YYYY"),
    therapist: form?.therapist || "",
    browColour: form?.browColour || "",
    lashColour: form?.lashColour || "",
    overleafCondition: form?.overleafCondition || "",
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
  const tintDetailPermission =
    permissions["tintConsultationDetail"].actions || {};

  const api = useApiStructure("/tint-consultation-details");
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
      .getAllDetails(router.query.id, "Tint", page, rowsPerPage, sort, search)
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
      `/forms/tinting/details/${id}?name=${router.query.name}&formId=${router.query.id}`
    );
  };

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Eyelash and Brow Tinting",
      isActive: false,
      link: "/forms/tinting",
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
            "Tint",
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
                    Eyelash and Brow Tint Consultation Card Details
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
                      `/forms/tinting/details/add?id=${router.query.id}&name=${router.query.name}`
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
              permissions={tintDetailPermission}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
