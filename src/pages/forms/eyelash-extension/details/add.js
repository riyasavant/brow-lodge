import { Layout as DashboardLayout } from "src/layouts/dashboard";
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  Unstable_Grid2 as Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { parseServerErrorMsg } from "src/utils/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Signature from "src/components/Signature";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/structure";
import StaffDropdown from "src/components/Dropdown/Staff";
import BooleanDropdown from "src/components/Dropdown/Boolean";

const Page = () => {
  const api = useApiStructure("/eyelash-extension-details");
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      therapist: null,
      feedback: "Yes",
      eyeFeedback: "Yes",
      careFeedback: "Yes",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      therapist: Yup.object().required("This field is required"),
      feedback: Yup.string().required("This field is required"),
      eyeFeedback: Yup.string().required("This field is required"),
      careFeedback: Yup.string().required("This field is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        therapist: values.therapist.value || "",
        feedback: values.feedback || "",
        eyeFeedback: values.eyeFeedback || "",
        careFeedback: values.careFeedback || "",
        date: dayjs(formDate).format(),
        eyelash: router.query.id,
        clientSign: imgUrl,
      };

      api
        .create(payload)
        .then(() => {
          router.push(
            `/forms/eyelash-extension/details?id=${router.query.id}&name=${router.query.name}`
          );
        })
        .catch((err) => {
          const msg = parseServerErrorMsg(err);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: msg });
          helpers.setSubmitting(false);
        });
    },
  });

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Eyelash Extension",
      isActive: false,
      link: "/forms/eyelash-extension",
    },
    {
      label: "Details",
      isActive: false,
      link: `/forms/eyelash-extension/details?id=${router.query.id}&name=${router.query.name}`,
    },
    { label: "Add", isActive: true },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={3}>
            <Breadcrumb items={breadcrumbItems} />
            <Stack spacing={2}>
              <Typography variant="h6">
                Add Eyelash Extension Consultation Card Details
              </Typography>
              <Typography variant="h8" color="primary" fontWeight="bold">
                {`Client: ${router.query.name}`}
              </Typography>
            </Stack>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Card>
              <CardHeader
                subheader="All fields marked with * are required"
                title="Fill details"
              />
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={6}>
                      <StaffDropdown
                        inputKey="therapist"
                        label="Therapist"
                        formik={formik}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <BooleanDropdown
                        formik={formik}
                        inputKey="feedback"
                        label="Is the answer to any of the 4 questions 'Yes'?"
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <BooleanDropdown
                        formik={formik}
                        inputKey="eyeFeedback"
                        label="Eyes OK after treatment?"
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <BooleanDropdown
                        formik={formik}
                        inputKey="careFeedback"
                        label="After Care Given?"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Box>
                    {imgUrl && <img src={imgUrl} height={80} width={150} />}
                    <br />
                    <Button onClick={() => setSignature(true)}>
                      Sign here
                    </Button>
                    <Signature
                      open={signature}
                      onClose={() => setSignature(false)}
                      onSave={(val) => setImgUrl(val)}
                    />
                  </Box>
                  <Box>
                    <DatePicker
                      format="DD/MM/YYYY"
                      label="Form date"
                      value={dayjs(formDate)}
                      onChange={(val) => setFormDate(val)}
                    />
                  </Box>
                </div>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() =>
                    router.push(
                      `/forms/eyelash-extension/details?id=${router.query.id}&name=${router.query.name}`
                    )
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={imgUrl === ""}
                >
                  Add
                </Button>
              </CardActions>
            </Card>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
