import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuthContext } from "src/auth/authContext";
import { useEffect } from "react";

export default function ClientDropdown({ formik, isEdit = false }) {
  const { clients, isClientsLoading } = useAuthContext();

  useEffect(() => {
    if (!isClientsLoading && !isEdit) {
      formik.setFieldValue("client", clients[0]);
    }
  }, [isClientsLoading, isEdit]);

  return (
    <Autocomplete
      disablePortal
      id="client-dropdown"
      options={isClientsLoading ? [] : clients}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={isClientsLoading ? "Loading Clients..." : "Select client"}
          required
          error={!!(formik.touched.client && formik.errors.client)}
          fullWidth
          helperText={formik.touched.client && formik.errors.client}
        />
      )}
      onChange={(_, newVal) => formik.setFieldValue("client", newVal)}
      disableClearable
      value={formik.values.client}
    />
  );
}
