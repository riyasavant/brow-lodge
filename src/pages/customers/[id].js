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
import { updateClient, getClientProfileById } from "src/api/lib/client";
import { parseServerErrorMsg } from "src/utils/axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const gender = [
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    email: "",
    gender: "Female",
  });

  useEffect(() => {
    getClientProfileById(router.query.id)
      .then((res) => {
        const clientData = res.data;
        setData({
          firstName: clientData.firstName || "",
          lastName: clientData.lastName || "",
          preferredName: clientData.preferredName || "",
          email: clientData.email || "",
          gender: clientData.gender || "Female",
        });
      })
      .catch(() => {});
  }, [router.query.id]);

  const formik = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      preferredName: Yup.string().required("Preferred name is required"),
      //   address: Yup.string().required("Address is required"),
    }),
    onSubmit: (values, helpers) => {
      updateClient(router.query.id, values)
        .then((response) => {
          if (response.status === 200) {
            router.push("/customers");
          }
        })
        .catch((err) => {
          const msg = parseServerErrorMsg(err);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: msg });
          helpers.setSubmitting(false);
        });
    },
  });

  console.log(formik);

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
          <div>
            <Typography variant="h4">Edit customer</Typography>
          </div>
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
                            formik.touched.firstName && formik.errors.firstName
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                        label="First name"
                        name="firstName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.firstName}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(formik.touched.lastName && formik.errors.lastName)
                        }
                        fullWidth
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
                        label="Last name"
                        name="lastName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.lastName}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.preferredName &&
                            formik.errors.preferredName
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.preferredName &&
                          formik.errors.preferredName
                        }
                        label="Preferred name"
                        name="preferredName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.preferredName}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={!!(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email Address"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
                        required
                      />
                    </Grid>
                    {/* <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(formik.touched.address && formik.errors.address)
                        }
                        fullWidth
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                        label="Address"
                        name="address"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.address}
                        required
                      />
                    </Grid> */}
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(formik.touched.gender && formik.errors.gender)
                        }
                        fullWidth
                        label="Select Gender"
                        name="gender"
                        onChange={formik.handleChange}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.gender}
                      >
                        {gender.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end" }}>
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
