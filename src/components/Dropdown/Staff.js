import { TextField } from "@mui/material";
import { useAuthContext } from "src/auth/authContext";
import { useEffect } from "react";

const StaffDropdown = ({ label, inputKey, formik }) => {
  const { staff: STAFF } = useAuthContext();

  const getLabel = (item) => {
    return item.firstName + " " + item.lastName;
  };

  useEffect(() => {
    formik.setFieldValue(inputKey, getLabel(STAFF[0]));
  }, []);

  return (
    <TextField
      error={!!(formik.touched[inputKey] && formik.errors[inputKey])}
      fullWidth
      label={label}
      name={inputKey}
      onChange={formik.handleChange}
      required
      select
      SelectProps={{ native: true }}
      value={formik.values[inputKey]}
    >
      {STAFF?.map((option) => (
        <option key={getLabel(option)} value={getLabel(option)}>
          {getLabel(option)}
        </option>
      ))}
    </TextField>
  );
};

export default StaffDropdown;
