import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "src/auth/useAuth";
import { doLogin } from "src/api/lib/auth";
import { parseServerErrorMsg } from "src/utils/axios";
import { getUserProfile } from "src/api/lib/auth";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();

  const login = async (credentials, helpers) => {
    doLogin(credentials.email, credentials.password)
      .then((res) => {
        const { jwt, user } = res.data;
        getUserProfile(jwt)
          .then((response) => {
            window.sessionStorage.setItem("auth-token", jwt);
            window.localStorage.setItem("auth-token", jwt);
            auth.setLogin(jwt, response.data);
            router.push("/");
          })
          .catch(() => {
            window.sessionStorage.setItem("auth-token", jwt);
            auth.setLogin(jwt, user);
            router.push("/");
          });
      })
      .catch((err) => {
        const msg = parseServerErrorMsg(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: msg });
        helpers.setSubmitting(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).min(6).required("Password is required"),
    }),
    onSubmit: login,
  });

  return (
    <>
      <Head>
        <title>Login | Brow Lodge</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <img
                src="/assets/image.png"
                width={200}
                style={{ marginBottom: "20px", marginLeft: "-10px" }}
              />
              <Typography variant="h4">Login</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
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
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
              <Alert color="primary" severity="info" sx={{ mt: 3 }}>
                Please contact your administrator to create a new account.
              </Alert>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Page;
