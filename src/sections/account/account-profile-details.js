import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useAuthContext } from "src/auth/authContext";
import useApiStructure from "src/api/lib/structure";
import { getUserProfile } from "src/api/lib/auth";
import { useAuth } from "src/auth/useAuth";

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

export const AccountProfileDetails = () => {
  const auth = useAuth();
  const api = useApiStructure("/staff-profile");
  const { user } = useAuthContext();
  const profileData = user.Staff ? user.Staff : user;
  const [values, setValues] = useState({
    firstName: profileData.firstName || "",
    lastName: profileData.lastName || "",
    preferredName: profileData.preferredName || "",
    email: profileData.email || "",
    gender: profileData.gender || "",
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const submitDetails = () => {
    api.update(profileData.id, values).then(() => {
      getUserProfile(window.localStorage.getItem("auth-token")).then((res) => {
        auth.setUserProfile(res.data);
      });
    });
  };

  return (
    <Card>
      <CardHeader subheader="The details can be edited" title="Profile" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Preferred Name"
                name="preferredName"
                onChange={handleChange}
                required
                value={values.preferredName}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Select Gender"
                name="gender"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
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
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={submitDetails}>
          Save details
        </Button>
      </CardActions>
    </Card>
  );
};
