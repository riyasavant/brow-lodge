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
import {
  getEyelashExtensionDetails,
  deleteEyelashExtensionDetail,
} from "src/api/lib/forms/details";
import Breadcrumb from "src/components/Breadcrumb";

const headers = [
  { key: "date", label: "Date" },
  { key: "therapist", label: "Therapist" },
  { key: "feedback", label: "Is the answer to any of the 4 questions 'Yes'?" },
  { key: "eyeFeedback", label: "Eyes OK after treatment?" },
  { key: "careFeedback", label: "After Care Given?" },
  { key: "signature", label: "Client Signature" },
];

const parseData = (data) => {
  return data.map((form) => ({
    date: dayjs(form?.date || new Date()).format("DD/MM/YYYY"),
    therapist: form?.therapist || "",
    feedback: form?.feedback || "",
    eyeFeedback: form?.eyeFeedback || "",
    careFeedback: form?.careFeedback || "",
    id: form?.id,
  }));
};

const Page = () => {
  const router = useRouter();
  const [response, setResponse] = useState({ data: [], total: 0 });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getEyelashExtensionDetails(page, rowsPerPage, router.query.id)
      .then((res) => {
        console.log(res);
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
    router.push(
      `/forms/eyelash-extension/details/${id}?name=${router.query.name}&formId=${router.query.id}`
    );
  };

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Eyelash Extension",
      isActive: false,
      link: "/forms/eyelash-extension",
    },
    { label: "Details", isActive: true },
  ];

  const onDelete = (id) => {
    deleteEyelashExtensionDetail(id)
      .then(() => {
        getEyelashExtensionDetails(page, rowsPerPage, router.query.id)
          .then((res) => {
            console.log(res);
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
                    Eyelash Extension Consultation Card Details
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
                      `/forms/eyelash-extension/details/add?id=${router.query.id}&name=${router.query.name}`
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
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
