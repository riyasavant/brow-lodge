import { Layout as DashboardLayout } from "src/layouts/dashboard";
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  TextField,
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
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Signature from "src/components/Signature";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/structure";
import StaffDropdown from "src/components/Dropdown/Staff";

const Page = () => {
  const api = useApiStructure("/wax-consultation-details");
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      therapist: "",
      skinBefore: "",
      skinAfter: "",
      treatment: "",
      careGiven: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      skinBefore: Yup.string().required("This field is required"),
      skinAfter: Yup.string().required("This field is required"),
      treatment: Yup.string().required("This field is required"),
      careGiven: Yup.string().required("This field is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        ...values,
        date: dayjs(formDate).format(),
        wax: router.query.id,
        clientSign: imgUrl,
      };

      api
        .create(payload)
        .then(() => {
          router.push(
            `/forms/waxing/details?id=${router.query.id}&name=${router.query.name}`
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
      label: "Waxing",
      isActive: false,
      link: "/forms/waxing",
    },
    {
      label: "Details",
      isActive: false,
      link: `/forms/waxing/details?id=${router.query.id}&name=${router.query.name}`,
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
                Add Waxing Consultation Card Details
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
                      <TextField
                        error={
                          !!(
                            formik.touched.skinBefore &&
                            formik.errors.skinBefore
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.skinBefore && formik.errors.skinBefore
                        }
                        label="Skin Before"
                        name="skinBefore"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.skinBefore}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.treatment && formik.errors.treatment
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.treatment && formik.errors.treatment
                        }
                        label="Treatment"
                        name="treatment"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.treatment}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.skinAfter && formik.errors.skinAfter
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.skinAfter && formik.errors.skinAfter
                        }
                        label="Skin After"
                        name="skinAfter"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.skinAfter}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.careGiven && formik.errors.careGiven
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.careGiven && formik.errors.careGiven
                        }
                        label="After Care Given?"
                        name="careGiven"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.careGiven}
                        required
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
                      `/forms/waxing/details?id=${router.query.id}&name=${router.query.name}`
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
