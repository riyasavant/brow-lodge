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
import { useState } from "react";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/structure";

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

const roleIds = {
  "Super Admin": ["ae09d6cb-7cb8-49bb-90d9-e2e6801ad70e"],
  Admin: ["5e6f59bc-617e-4783-90b2-5440256a1c3a"],
  None: null,
};

const roles = [
  {
    value: "None",
    label: "None",
  },
  {
    value: "Super Admin",
    label: "Super Admin",
  },
  {
    value: "Admin",
    label: "Admin",
  },
];

const noneRoleSchema = {
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string().required("Preferred name is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
};

const adminRoleSchema = {
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string().required("Preferred name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("This field is required"),
  confirmPassword: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("This field is required")
    .oneOf(
      [Yup.ref("password"), null],
      "Passwords did not match. Please try again."
    ),
};

const Page = () => {
  const api = useApiStructure("/staff-profile");
  const [selectedRole, setSelectedRole] = useState("None");
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      preferredName: "",
      email: "",
      gender: "Female",
      role: "None",
      password: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema:
      selectedRole === "None"
        ? Yup.object(noneRoleSchema)
        : Yup.object(adminRoleSchema),
    onSubmit: (values, helpers) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        preferredName: values.preferredName,
        gender: values.gender,
        roles: roleIds[values.role],
        jobTitle: "staff",
        blocked: false,
        email: values.email,
      };

      if (selectedRole !== "None") {
        payload.password = values.password;
      }

      api
        .create(payload)
        .then((response) => {
          if (response.status === 200) {
            router.push("/staff");
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

  const updateRole = (e) => {
    setSelectedRole(e.target.value);
    formik.handleChange(e);
  };

  const breadcrumbItems = [
    { label: "Staff", isActive: false, link: "/staff" },
    { label: "Add staff", isActive: true, link: "" },
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
            <Typography variant="h4">Add staff</Typography>
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
                    <Grid xs={12} md={6}>
                      <TextField
                        error={!!(formik.touched.role && formik.errors.role)}
                        fullWidth
                        label="Select user role"
                        name="role"
                        onChange={updateRole}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.role}
                      >
                        {roles.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
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
                    {formik.values.role !== "None" && (
                      <>
                        <Grid xs={12} md={6}>
                          <TextField
                            error={
                              !!(
                                formik.touched.password &&
                                formik.errors.password
                              )
                            }
                            fullWidth
                            helperText={
                              formik.touched.password && formik.errors.password
                            }
                            label="Password"
                            name="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.password}
                            required
                          />
                        </Grid>
                        <Grid xs={12} md={6}>
                          <TextField
                            error={
                              !!(
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                              )
                            }
                            fullWidth
                            helperText={
                              formik.touched.confirmPassword &&
                              formik.errors.confirmPassword
                            }
                            label="Confirm Password"
                            name="confirmPassword"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="password"
                            value={formik.values.confirmPassword}
                            required
                          />
                        </Grid>
                      </>
                    )}
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
