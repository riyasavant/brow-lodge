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
import Signature from "src/components/Signature";
import Breadcrumb from "src/components/Breadcrumb";
import useApiStructure from "src/api/lib/structure";

const Page = () => {
  const api = useApiStructure("/wax-consultation");
  const [formDate, setFormDate] = useState(new Date());
  const [signature, setSignature] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [prescribedMedicine, setPrescribedMedicine] = useState(false);
  const [medicineDetails, setDetails] = useState("");
  const [diseases, setDiseases] = useState({});
  const [products, setProducts] = useState({});
  const [clients, setClients] = useState([]);
  const [waxTreatment, setWaxTreatment] = useState(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      doctorName: "",
      doctorAddress: "",
      client: clients.length > 0 ? clients[0].value : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      doctorName: Yup.string().required("Doctor's name is required"),
      doctorAddress: Yup.string().required("Doctor's address is required"),
    }),
    onSubmit: (values, helpers) => {
      const payload = {
        ...values,
        date: dayjs(formDate).format(),
        containProducts: Object.keys(products).filter(
          (selected) => products[selected]
        ),
        disease: Object.keys(diseases).filter((selected) => diseases[selected]),
        clientSign: imgUrl,
        waxTreatment,
        prescribedMedicine: prescribedMedicine ? medicineDetails : null,
      };

      api
        .create(payload)
        .then((res) => {
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
      label: "Waxing",
      isActive: false,
      link: "/forms/waxing",
    },
    { label: "Add", isActive: true, link: "/forms/waxing" },
  ];

  const handleDiseaseSelection = (e) => {
    if (e.target.checked) {
      const parsed = {
        ...diseases,
        [e.target.name]: true,
      };
      setDiseases(parsed);
    } else {
      const parsed = {
        ...diseases,
        [e.target.name]: false,
      };
      setDiseases(parsed);
    }
  };

  const handleProductsSelection = (e) => {
    if (e.target.checked) {
      const parsed = {
        ...products,
        [e.target.name]: true,
      };
      setProducts(parsed);
    } else {
      const parsed = {
        ...products,
        [e.target.name]: false,
      };
      setProducts(parsed);
    }
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
            <Typography variant="h6">Add Waxing Consultation Card</Typography>
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                onChange={(e) => handleDiseaseSelection(e)}
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
                                value={prescribedMedicine}
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
                                onChange={handleProductsSelection}
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
                                onChange={handleProductsSelection}
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
                                onChange={handleProductsSelection}
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
                                onChange={handleProductsSelection}
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
