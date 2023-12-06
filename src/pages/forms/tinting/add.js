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
  FormGroup,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { parseServerErrorMsg } from "src/utils/axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getClients } from "src/api/lib/client";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createEyelashExtension } from "src/api/lib/forms/eyelash-extension";
import Signature from "src/components/Signature";
import Breadcrumb from "src/components/Breadcrumb";

const Page = () => {
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [skinTest, setSkinTest] = useState(false);
  const [skinTestDate, setSkinTestDate] = useState(new Date());
  const [clients, setClients] = useState([]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      day: "",
      evening: "",
      technicianName: "",
      doctorName: "",
      doctorAddress: "",
      isPregnant: "false",
      eyeSyndrome: "false",
      hrt: "false",
      eyeComplaint: "false",
      client: clients.length > 0 ? clients[0].value : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      day: Yup.string().required("Tel (Day) is required"),
      evening: Yup.string().required("Evening is required"),
      technicianName: Yup.string().required("Technician name is required"),
      doctorName: Yup.string().required("Doctor's name is required"),
      doctorAddress: Yup.string().required("Doctor's address is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        ...values,
        doctorName: imgUrl,
        isPregnant: values.isPregnant === "true" ? true : false,
        eyeSyndrome: values.eyeSyndrome === "true" ? true : false,
        hrt: values.hrt === "true" ? true : false,
        eyeComplaint: values.eyeComplaint === "true" ? true : false,
        skinPatchTest: skinTest,
        skinPatchTestDate: dayjs(skinTestDate).format(),
        date: dayjs(formDate).format(),
      };

      createEyelashExtension(payload)
        .then((res) => {
          router.push("/forms/eyelash-extension");
        })
        .catch((err) => {
          const msg = parseServerErrorMsg(err);
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: msg });
          helpers.setSubmitting(false);
        });
    },
  });

  const parseClients = (data) => {
    return data.map((client) => ({
      label: client.preferredName,
      value: client.id,
    }));
  };

  useEffect(() => {
    getClients(0, 1000)
      .then((res) => {
        setClients(parseClients(res.data.data));
      })
      .catch(() => {});
  }, []);

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Eyelash and Brow Tint",
      isActive: false,
      link: "/forms/tinting",
    },
    { label: "Add", isActive: true, link: "/forms/tinting" },
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
            <Typography variant="h6">
              Add Eyelash and Brow Tint Consultation Card
            </Typography>
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
                          !!(formik.touched.client && formik.errors.client)
                        }
                        fullWidth
                        label="Select client"
                        name="client"
                        onChange={formik.handleChange}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.client}
                      >
                        {clients.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={!!(formik.touched.day && formik.errors.day)}
                        fullWidth
                        helperText={formik.touched.day && formik.errors.day}
                        label="Tel (Day)"
                        name="day"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.day}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(formik.touched.evening && formik.errors.evening)
                        }
                        fullWidth
                        helperText={
                          formik.touched.evening && formik.errors.evening
                        }
                        label="Evening"
                        name="evening"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.evening}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.doctorName &&
                            formik.errors.doctorName
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.doctorName && formik.errors.doctorName
                        }
                        label="Doctor's Name"
                        name="doctorName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.doctorName}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.doctorAddress &&
                            formik.errors.doctorAddress
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.doctorAddress &&
                          formik.errors.doctorAddress
                        }
                        label="Doctor's Address"
                        name="doctorAddress"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.doctorAddress}
                        required
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Typography
                        sx={{ mt: 1, ml: 2, fontWeight: "bold" }}
                        variant="body2"
                      >
                        Do any of the following apply to you?
                      </Typography>
                    </Grid>
                    <Grid xs={12} ml={2} container>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Inflammation
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Bruising
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Eye Disease
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Hypersensitive Skin
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Oedema
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Lenses
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Allergies
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                New Scar Tissue (under 6 months old)
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Psoriasis
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Cuts and Abrasion
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Skin Diseases
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={4} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                A positive reaction to tint
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid xs={12}>
                      <Box sx={{ display: "flex", mt: 3, ml: 2 }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                value={skinTest}
                                onChange={() => setSkinTest((prev) => !prev)}
                              />
                            }
                            label={
                              <Typography
                                sx={{ color: "red", fontSize: "14px" }}
                              >
                                Skin patch test carried out?
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                        {skinTest && (
                          <DatePicker
                            format="DD/MM/YYYY"
                            label="Skin patch test date"
                            value={dayjs(skinTestDate)}
                            onChange={(val) => setSkinTestDate(val)}
                          />
                        )}
                      </Box>
                      <Divider sx={{ mt: 2 }} />
                      <Box sx={{ ml: 2 }}>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "bold",
                            fontStyle: "italic",
                          }}
                        >
                          I understand that I am responsible for notifying the
                          Beauty Therapist if any of the above information
                          should change before treatment and I have received
                          after care leaflet.
                        </p>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                  onClick={() => router.push("/forms/eyelash-extension")}
                >
                  Cancel
                </Button>
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
