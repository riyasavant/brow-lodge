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
import {
  createEyelashExtensionDetail,
  getEyelashExtensionDetailById,
  updateEyelashExtensionDetail,
} from "src/api/lib/forms/details";

const Page = () => {
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [data, setData] = useState({
    therapist: "",
    feedback: "",
    eyeFeedback: "",
    careFeedback: "",
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: Yup.object({
      therapist: Yup.string().required("This field is required"),
      feedback: Yup.string().required("This field is required"),
      eyeFeedback: Yup.string().required("This field is required"),
      careFeedback: Yup.string().required("This field is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        therapist: values.therapist || "",
        feedback: values.feedback || "",
        eyeFeedback: values.eyeFeedback || "",
        careFeedback: values.careFeedback || "",
        date: dayjs(formDate).format(),
        eyelash: router.query.id,
      };

      updateEyelashExtensionDetail(router.query.id, payload)
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

  useEffect(() => {
    getEyelashExtensionDetailById(router.query.id)
      .then((res) => {
        const formData = res.data;
        setData({
          therapist: formData.therapist || "",
          feedback: formData.feedback || "",
          eyeFeedback: formData.eyeFeedback || "",
          careFeedback: formData.careFeedback || "",
        });
        setFormDate(formData.date);
      })
      .catch(() => {});
  }, [router.query.id]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Typography variant="h6">
              Edit Eyelash Extension Consultation Card Details
            </Typography>
            <Typography variant="h8" color="primary" fontWeight="bold">
              {`Client: ${router.query.name}`}
            </Typography>
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
                      <TextField
                        error={
                          !!(
                            formik.touched.therapist &&
                            formik.errors.dtherapistay
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.therapist && formik.errors.therapist
                        }
                        label="Therapist"
                        name="therapist"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.therapist}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(formik.touched.feedback && formik.errors.feedback)
                        }
                        fullWidth
                        helperText={
                          formik.touched.feedback && formik.errors.feedback
                        }
                        label="Is the answer to any of the 4 questions 'Yes'?"
                        name="feedback"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.feedback}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.eyeFeedback &&
                            formik.errors.eyeFeedback
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.eyeFeedback &&
                          formik.errors.eyeFeedback
                        }
                        label="Eyes OK after treatment?"
                        name="eyeFeedback"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.eyeFeedback}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.careFeedback &&
                            formik.errors.careFeedback
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.careFeedback &&
                          formik.errors.careFeedback
                        }
                        label="After Care Given?"
                        name="careFeedback"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.careFeedback}
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
                      `/forms/eyelash-extension/details?id=${router.query.id}&name=${router.query.name}`
                    )
                  }
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Edit
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
