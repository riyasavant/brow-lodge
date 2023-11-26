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
import { getEyelashExtensionEntries } from "src/api/lib/forms/eyelash-extension";
import dayjs from "dayjs";
import { deleteEyelashExtensionForm } from "src/api/lib/forms/eyelash-extension";
import Breadcrumb from "src/components/Breadcrumb";

const headers = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "doctorName", label: "Doctor's Name" },
];

const parseData = (data) => {
  return data.map((form) => ({
    date: dayjs(form?.date || new Date()).format("DD/MM/YYYY"),
    name: form?.Client?.preferredName || "",
    doctorName: form?.doctorName || "",
    id: form?.id,
  }));
};

const Page = () => {
  const router = useRouter();
  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getEyelashExtensionEntries(page, rowsPerPage)
      .then((res) => {
        setResponse({
          data: parseData(res.data?.data),
          total: res.data?.total,
        });
      })
      .catch(() => {});
  }, [rowsPerPage, page]);

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
    deleteEyelashExtensionForm(id)
      .then(() => {
        getEyelashExtensionEntries(page, rowsPerPage)
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
    { label: "Eyelash and Brow Tint", isActive: true, link: "" },
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
                  Eyelash and Brow Tint Consultation Card
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
                  onClick={() => router.push("/forms/tinting/add")}
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
