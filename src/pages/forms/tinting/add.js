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
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Signature from "src/components/Signature";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/structure";
import ClientDropdown from "src/components/Dropdown/Client";
import StaffDropdown from "src/components/Dropdown/Staff";

const Page = () => {
  const api = useApiStructure("/tint-consultation");
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [skinTest, setSkinTest] = useState(false);
  const [skinTestDate, setSkinTestDate] = useState(new Date());

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      doctorName: "",
      doctorAddress: "",
      technicianName: null,
      colourEyelash: "",
      colourEyebrow: "",
      disease: [],
      client: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      client: Yup.object().required("This field is required"),
      technicianName: Yup.object().required("This field is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        ...values,
        skinPatchTest: skinTest,
        skinPatchTestDate: dayjs(skinTestDate).format(),
        date: dayjs(formDate).format(),
        disease: values.disease.length === 0 ? null : values.disease,
        clientSign: imgUrl,
        client: values.client.value,
        technicianName: values.technicianName.value,
      };

      api
        .create(payload)
        .then(() => {
          router.push("/forms/tinting");
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
      label: "Eyelash and Brow Tint",
      isActive: false,
      link: "/forms/tinting",
    },
    { label: "Add", isActive: true, link: "/forms/tinting" },
  ];

  const onCheckboxChange = (e) => {
    const isChecked = !e.target.checked;
    let filtered;
    if (!isChecked) {
      filtered = [...formik.values.disease, e.target.name];
    } else {
      filtered = formik.values.disease.filter((name) => name !== e.target.name);
    }
    formik.setFieldValue("disease", filtered);
  };

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
                      <ClientDropdown formik={formik} />
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
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <StaffDropdown
                        inputKey="technicianName"
                        label="Technician Name"
                        formik={formik}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.colourEyebrow &&
                            formik.errors.colourEyebrow
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.colourEyebrow &&
                          formik.errors.colourEyebrow
                        }
                        label="Colour Eye brows"
                        name="colourEyebrow"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.colourEyebrow}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.colourEyelash &&
                            formik.errors.colourEyelash
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.colourEyelash &&
                          formik.errors.colourEyelash
                        }
                        label="Colour Eye lashes"
                        name="colourEyelash"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.colourEyelash}
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
                                name="inflammation"
                                checked={formik.values.disease.includes(
                                  "inflammation"
                                )}
                                onChange={onCheckboxChange}
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
                                checked={formik.values.disease.includes(
                                  "bruising"
                                )}
                                onChange={onCheckboxChange}
                                name="bruising"
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
                                name="eyeDisease"
                                checked={formik.values.disease.includes(
                                  "eyeDisease"
                                )}
                                onChange={onCheckboxChange}
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
                                name="hypersensitiveSkin"
                                checked={formik.values.disease.includes(
                                  "hypersensitiveSkin"
                                )}
                                onChange={onCheckboxChange}
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
                                name="oedema"
                                checked={formik.values.disease.includes(
                                  "oedema"
                                )}
                                onChange={onCheckboxChange}
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
                                name="lenses"
                                checked={formik.values.disease.includes(
                                  "lenses"
                                )}
                                onChange={onCheckboxChange}
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
                                name="allergies"
                                checked={formik.values.disease.includes(
                                  "allergies"
                                )}
                                onChange={onCheckboxChange}
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
                                name="newScarTissue"
                                checked={formik.values.disease.includes(
                                  "newScarTissue"
                                )}
                                onChange={onCheckboxChange}
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
                                name="psoriasis"
                                checked={formik.values.disease.includes(
                                  "psoriasis"
                                )}
                                onChange={onCheckboxChange}
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
                                name="cutsAndAbrasion"
                                checked={formik.values.disease.includes(
                                  "cutsAndAbrasion"
                                )}
                                onChange={onCheckboxChange}
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
                                name="skinDiseases"
                                checked={formik.values.disease.includes(
                                  "skinDiseases"
                                )}
                                onChange={onCheckboxChange}
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
                                name="positiveReactionToTint"
                                checked={formik.values.disease.includes(
                                  "positiveReactionToTint"
                                )}
                                onChange={onCheckboxChange}
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
