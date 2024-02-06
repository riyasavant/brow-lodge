import { TextField } from "@mui/material";

const data = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const BooleanDropdown = ({ label, inputKey, formik }) => {
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
      {data.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
};

export default BooleanDropdown;
