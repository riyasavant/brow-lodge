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
import { useEffect, useState } from "react";
import Breadcrumb from "src/components/Breadcrumb";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import useApiStructure from "src/api/structure";

const gender = [
  {
    value: null,
    label: "Not selected",
  },
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
  const api = useApiStructure("/client-profile");
  const router = useRouter();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: null,
    address: "",
    personalContactNumber: "",
    dateOfBirth: dayjs(new Date()),
  });

  useEffect(() => {
    api
      .getById(router.query.id)
      .then((res) => {
        const clientData = res.data;
        setData({
          firstName: clientData.firstName || "",
          lastName: clientData.lastName || "",
          email: clientData.email || "",
          gender: clientData.gender || null,
          address: clientData.address || "",
          personalContactNumber: clientData.personalContactNumber || "",
          dateOfBirth: clientData.dateOfBirth
            ? dayjs(clientData.dateOfBirth)
            : null,
        });
      })
      .catch(() => {});
  }, [router.query.id]);

  const formik = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email("Must be a valid email").max(255),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      address: Yup.string(),
      personalContactNumber: Yup.string(),
    }),
    onSubmit: (values, helpers) => {
      const payload = Object.keys(values).reduce((acc, current) => {
        if (values[current] !== null && values[current].length !== 0) {
          acc[current] = values[current];
        }
        return acc;
      }, {});

      api
        .update(router.query.id, payload)
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

  const breadcrumbItems = [
    { label: "Customers", isActive: false, link: "/customers" },
    { label: "Edit customer", isActive: true, link: "" },
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
          <Breadcrumb items={breadcrumbItems} />
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
                        error={!!(formik.touched.email && formik.errors.email)}
                        fullWidth
                        helperText={formik.touched.email && formik.errors.email}
                        label="Email Address"
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="email"
                        value={formik.values.email}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
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
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.personalContactNumber &&
                            formik.errors.personalContactNumber
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.personalContactNumber &&
                          formik.errors.personalContactNumber
                        }
                        label="Contact Number"
                        name="personalContactNumber"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.personalContactNumber}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(formik.touched.gender && formik.errors.gender)
                        }
                        fullWidth
                        label="Select Gender"
                        name="gender"
                        onChange={formik.handleChange}
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
                    <Grid xs={12} sm={6}>
                      <DatePicker
                        error={
                          !!(
                            formik.touched.dateOfBirth &&
                            formik.errors.dateOfBirth
                          )
                        }
                        value={formik.values.dateOfBirth}
                        sx={{ width: "100%" }}
                        fullWidth
                        format="DD/MM/YYYY"
                        label="Date of Birth"
                        onChange={(e) => {
                          formik.setFieldValue("dateOfBirth", dayjs(e));
                        }}
                        name="dateOfBirth"
                        type="date"
                        helperText={
                          formik.touched.dateOfBirth &&
                          formik.errors.dateOfBirth
                        }
                      />
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
                <Button
                  variant="outlined"
                  onClick={() => router.push("/customers")}
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
