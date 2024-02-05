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
  const clientApi = useApiStructure("/client-profile");
  const staffApi = useApiStructure("/staff-profile");
  const api = useApiStructure("/wax-consultation");
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [prescribedMedicine, setPrescribedMedicine] = useState(false);
  const [medicineDetails, setDetails] = useState("");
  const [waxTreatment, setWaxTreatment] = useState(false);

  // Form initial values
  const [formData, setFormData] = useState({
    doctorName: "",
    doctorAddress: "",
    client: clients.length > 0 ? clients[0].value : "",
    technicianName: staff.length > 0 ? staff[0].value : "",
    disease: [],
    containProducts: [],
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: Yup.object({}),
    onSubmit: (values, helpers) => {
      const payload = {
        ...values,
        date: dayjs(formDate).format(),
        containProducts:
          values.containProducts.length !== 0 ? values.containProducts : null,
        disease: values.disease.length !== 0 ? values.disease : null,
        clientSign: imgUrl,
        waxTreatment,
        prescribedMedicine: prescribedMedicine ? medicineDetails : null,
      };

      api
        .update(router.query.id, payload)
        .then(() => {
          router.push("/forms/waxing");
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
      label: `${client.firstName} ${client.lastName} ${
        client.dateOfBirth
          ? `(${dayjs(client.dateOfBirth).format("DD/MM/YYYY")})`
          : ""
      }`,
      value: client.id,
    }));
  };

  const parseStaff = (data) => {
    return data.map((client) => ({
      label: client.firstName + " " + client.lastName,
      value: client.firstName + " " + client.lastName,
    }));
  };

  useEffect(() => {
    api
      .getById(router.query.id)
      .then((res) => {
        clientApi.getAll(0, 1000).then((response) => {
          staffApi.getAll(0, 1000).then((staffRes) => {
            const formData = res.data;
            const client = response.data.data.filter(
              (client) => client.id === formData.client
            )[0];
            const technician = staffRes.data.data.filter((item) => {
              return (
                item.firstName + " " + item.lastName === formData.technicianName
              );
            })[0];
            setClients(parseClients(response.data.data));
            setStaff(parseStaff(staffRes.data.data));
            setFormData({
              doctorName: formData.doctorName || "",
              doctorAddress: formData.doctorAddress || "",
              client: client.id,
              disease: formData.disease || [],
              containProducts: formData.containProducts || [],
              technicianName: technician.firstName + " " + technician.lastName,
            });
            setImgUrl(formData.clientSign);
            setFormDate(formData.date);
            setWaxTreatment(formData.waxTreatment);

            if (formData.prescribedMedicine) {
              setPrescribedMedicine(true);
              setDetails(formData.prescribedMedicine);
            }
          });
        });
      })
      .catch(() => {});
  }, [router.query.id]);

  const breadcrumbItems = [
    { label: "All Forms", isActive: false, link: "/forms" },
    {
      label: "Waxing",
      isActive: false,
      link: "/forms/waxing",
    },
    { label: "Edit", isActive: true, link: "" },
  ];

  const onCheckboxChange = (e, type = "disease") => {
    const isChecked = !e.target.checked;
    let filtered;
    if (!isChecked) {
      filtered = [...formik.values[type], e.target.name];
    } else {
      filtered = formik.values[type].filter((name) => name !== e.target.name);
    }
    formik.setFieldValue(type, filtered);
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
            <Typography variant="h6">Edit Waxing Consultation Card</Typography>
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
                      <TextField
                        error={
                          !!(
                            formik.touched.technicianName &&
                            formik.errors.technicianName
                          )
                        }
                        fullWidth
                        label="Technician Name"
                        name="technicianName"
                        onChange={formik.handleChange}
                        required
                        select
                        SelectProps={{ native: true }}
                        value={formik.values.technicianName}
                      >
                        {staff.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </TextField>
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
                                name="diabetes"
                                checked={formik.values.disease.includes(
                                  "diabetes"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Diabetes
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
                                name="epilepsy"
                                checked={formik.values.disease.includes(
                                  "epilepsy"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Epilepsy
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
                                name="moles"
                                checked={formik.values.disease.includes(
                                  "moles"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Moles
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
                                onChange={(e) => onCheckboxChange(e, "disease")}
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
                                onChange={(e) => onCheckboxChange(e, "disease")}
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
                                name="phlebitis"
                                checked={formik.values.disease.includes(
                                  "phlebitis"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Phlebitis
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
                                name="pregnancy"
                                checked={formik.values.disease.includes(
                                  "pregnancy"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Pregnancy
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
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                New Scar Tissue (under 3 months old)
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
                                onChange={(e) => onCheckboxChange(e, "disease")}
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
                                name="poorCirculation"
                                checked={formik.values.disease.includes(
                                  "poorCirculation"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Poor Circulation
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
                                onChange={(e) => onCheckboxChange(e, "disease")}
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
                                name="undiagnosedLumpsAndBumps"
                                checked={formik.values.disease.includes(
                                  "undiagnosedLumpsAndBumps"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Undiagnosed Lumps and Bumps
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
                                name="sunburn"
                                checked={formik.values.disease.includes(
                                  "sunburn"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Sunburn
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
                                name="varicoseVeins"
                                checked={formik.values.disease.includes(
                                  "varicoseVeins"
                                )}
                                onChange={(e) => onCheckboxChange(e, "disease")}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Varicose Veins
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid xs={12} pt={0}>
                      <Box
                        sx={{ display: "flex", ml: 2, alignItems: "center" }}
                      >
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="prescribedMedicine"
                                checked={prescribedMedicine}
                                onChange={() =>
                                  setPrescribedMedicine((prev) => !prev)
                                }
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Prescribed medicine (give details)
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                        {prescribedMedicine && (
                          <TextField
                            sx={{ width: "400px" }}
                            variant="standard"
                            label="Details"
                            name="prescribedMedicineDetails"
                            onChange={(e) => setDetails(e.target.value)}
                            type="text"
                            value={medicineDetails}
                            required
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid xs={12}>
                      <Typography
                        sx={{ mt: 1, ml: 2, fontWeight: "bold" }}
                        variant="body2"
                      >
                        Do you use any of these products?
                      </Typography>
                    </Grid>
                    <Grid xs={12} ml={2} container>
                      <Grid xs={12} sm={6} md={3} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="retinA"
                                checked={formik.values.containProducts.includes(
                                  "retinA"
                                )}
                                onChange={(e) =>
                                  onCheckboxChange(e, "containProducts")
                                }
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Retin A
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={3} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="accutane"
                                checked={formik.values.containProducts.includes(
                                  "accutane"
                                )}
                                onChange={(e) =>
                                  onCheckboxChange(e, "containProducts")
                                }
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Accutane
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={3} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="glycolicAcid"
                                checked={formik.values.containProducts.includes(
                                  "glycolicAcid"
                                )}
                                onChange={(e) =>
                                  onCheckboxChange(e, "containProducts")
                                }
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                Glycolic Acid
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                      <Grid xs={12} sm={6} md={3} p={0}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="AHASkinCare"
                                checked={formik.values.containProducts.includes(
                                  "AHASkinCare"
                                )}
                                onChange={(e) =>
                                  onCheckboxChange(e, "containProducts")
                                }
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: "14px" }}>
                                AHA Skin Care
                              </Typography>
                            }
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid xs={12}>
                      <FormControl sx={{ ml: 2 }}>
                        <FormLabel
                          id="demo-row-radio-buttons-group-label"
                          sx={{ color: "red" }}
                        >
                          Have you had waxing treatment before
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="waxTreatment"
                          onChange={(e) => {
                            if (e.target.value === "true") {
                              setWaxTreatment(true);
                            } else {
                              setWaxTreatment(false);
                            }
                          }}
                        >
                          <FormControlLabel
                            value="true"
                            control={
                              <Radio
                                checked={waxTreatment}
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
                                checked={!waxTreatment}
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
                          should change before treatment. All medical data is
                          correct to the best of my knowledge. I hereby
                          indemnify the therapist against any adverse reaction
                          sustained as a result of the treatment.
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
                  onClick={() => router.push("/forms/waxing")}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={imgUrl === ""}
                >
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
