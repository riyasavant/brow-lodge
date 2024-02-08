import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuthContext } from "src/auth/authContext";
import { useEffect } from "react";

export default function StaffDropdown({
  formik,
  isEdit = false,
  label,
  inputKey,
}) {
  const { staff, isStaffLoading } = useAuthContext();

  useEffect(() => {
    if (!isStaffLoading && !isEdit) {
      formik.setFieldValue(inputKey, staff[0]);
    }
  }, [isStaffLoading, isEdit]);

  return (
    <Autocomplete
      disablePortal
      id="staff-dropdown"
      options={isStaffLoading ? [] : staff}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={isStaffLoading ? "Loading..." : label}
          required
          error={!!(formik.touched[inputKey] && formik.errors[inputKey])}
          fullWidth
          helperText={formik.touched[inputKey] && formik.errors[inputKey]}
        />
      )}
      onChange={(_, newVal) => formik.setFieldValue(inputKey, newVal)}
      disableClearable
      value={formik.values[inputKey]}
    />
  );
}
