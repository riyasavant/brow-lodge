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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Signature from "src/components/Signature";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/structure";

const Page = () => {
  const api = useApiStructure("/eyelash-extension");
  const clientApi = useApiStructure("/client-profile");
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [skinTest, setSkinTest] = useState(false);
  const [skinTestDate, setSkinTestDate] = useState(new Date());
  const [clients, setClients] = useState([]);

  // Form initial values
  const [formData, setFormData] = useState({
    technicianName: "",
    doctorName: "",
    doctorAddress: "",
    isPregnant: "false",
    eyeSyndrome: "false",
    hrt: "false",
    eyeComplaint: "false",
    client: clients.length > 0 ? clients[0].value : "",
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: Yup.object({
      technicianName: Yup.string().required("Technician name is required"),
      doctorName: Yup.string().required("Doctor's name is required"),
      doctorAddress: Yup.string().required("Doctor's address is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        ...values,
        isPregnant: values.isPregnant === "true" ? true : false,
        eyeSyndrome: values.eyeSyndrome === "true" ? true : false,
        hrt: values.hrt === "true" ? true : false,
        eyeComplaint: values.eyeComplaint === "true" ? true : false,
        skinPatchTest: skinTest,
        skinPatchTestDate: dayjs(skinTestDate).format(),
        date: dayjs(formDate).format(),
        clientSign: imgUrl,
      };

      api
        .update(router.query.id, payload)
        .then(() => {
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
    api
      .getById(router.query.id)
      .then((res) => {
        clientApi.getAll(0, 1000).then((response) => {
          const formData = res.data;
          const client = response.data.data.filter(
            (client) => client.id === formData.client
          )[0];
          setClients(parseClients(response.data.data));
          setFormData({
            technicianName: formData.technicianName || "",
            doctorName: formData.doctorName || "",
            doctorAddress: formData.doctorAddress || "",
            isPregnant: formData.isPregnant ? "true" : "false",
            eyeSyndrome: formData.eyeSyndrome ? "true" : "false",
            hrt: formData.hrt ? "true" : "false",
            eyeComplaint: formData.eyeComplaint ? "true" : "false",
            client: client.id,
          });
          setFormDate(formData.date);
          setSkinTest(formData.skinPatchTest);
          setSkinTestDate(formData.skinPatchTestDate);
          setImgUrl(formData.clientSign);
        });
      })
      .catch(() => {});
  }, [router.query.id]);

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Eyelash Extension",
      isActive: false,
      link: "/forms/eyelash-extension",
    },
    { label: "Edit", isActive: true, link: "" },
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
              Edit Eyelash Extension Consultation Card
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
                    <Grid xs={12} md={6}>
                      <TextField
                        error={
                          !!(
                            formik.touched.technicianName &&
                            formik.errors.technicianName
                          )
                        }
                        fullWidth
                        helperText={
                          formik.touched.technicianName &&
                          formik.errors.technicianName
                        }
                        label="Name of Technician"
                        name="technicianName"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        type="text"
                        value={formik.values.technicianName}
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
                    <Grid xs={12} md={6}>
                      <FormControl sx={{ ml: 2 }}>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Are you pregnant or breast-feeding
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="isPregnant"
                          onChange={formik.handleChange}
                          value={formik.values.isPregnant}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl sx={{ ml: 2 }}>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Do you suffer from Dry Eye Syndrome or Conjunctivitis?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="eyeSyndrome"
                          onChange={formik.handleChange}
                          value={formik.values.eyeSyndrome}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl sx={{ ml: 2 }}>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Are you taking HRT (Hormone Replacement Therapy)
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="hrt"
                          onChange={formik.handleChange}
                          value={formik.values.hrt}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl sx={{ ml: 2 }}>
                        <FormLabel id="demo-row-radio-buttons-group-label">
                          Have you previously had eye complaints
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="eyeComplaint"
                          onChange={formik.handleChange}
                          value={formik.values.eyeComplaint}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="Yes"
                          />
                          <FormControlLabel
                            value="false"
                            control={
                              <Radio
                                sx={{
                                  "& .MuiSvgIcon-root": {
                                    fontSize: 20,
                                  },
                                }}
                              />
                            }
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <Box sx={{ display: "flex", mt: 3, ml: 2 }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="skinPatchTest"
                                checked={skinTest}
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
                      <div>
                        <ul>
                          <li style={{ fontSize: "14px" }}>
                            I accept full responsibility for determining the
                            length and type of lashes that have been agreed
                            during the course of my consultation.
                          </li>
                          <li style={{ fontSize: "14px" }}>
                            I further understand that it is not uncommon for
                            some eyelashes to fall out prematurely whilst the
                            eyelashes adjust and set.
                          </li>
                          <li style={{ fontSize: "14px" }}>
                            I can confirm that I have received the relevant
                            aftercare information leaflet for my records and
                            understand that I should follow the recommendations.
                          </li>
                          <li style={{ fontSize: "14px" }}>
                            It is my responsibility to carry out the advised
                            aftercare routine to keep the lashes looking thick,
                            full & conditioned, I acknowledge that eyelash
                            extensions, when not cared for properly: can be
                            permanently lost and/ or look unslightly.
                          </li>
                          <li style={{ fontSize: "14px" }}>
                            I am aware that I will be charged an additional fee
                            for any further maintenance treatments.
                          </li>
                          <li style={{ fontSize: "14px" }}>
                            I understand that there is a risk that there may be
                            a negative reaction from the application of eyelash
                            extensions. Should this occur there could be
                            swelling, redness or a rash. I appreciate that there
                            is a risk that Brow Lodge cannot foresee however I
                            wish to receive the treatment and agree that Brow
                            Lodge shall not be responsible for these or any
                            reaction that I may experience from this service.
                          </li>
                          <li style={{ fontSize: "14px" }}>
                            I understand that Brow Lodge cannot be responsible
                            for any undisclosed information regarding an eyelash
                            extension treatment.
                          </li>
                        </ul>
                      </div>
                      <Divider />
                      <Box sx={{ ml: 2 }}>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "bold",
                            fontStyle: "italic",
                          }}
                        >
                          I (the undersigned) have read and understand the above
                          and all that has been explained. I am fully aware of
                          the potential risk and that future maintenance
                          treatments will be required for both after care and
                          home care
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
