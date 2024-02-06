import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import useApiStructure from "src/api/structure";

const StaffDropdown = ({ label, inputKey, formik }) => {
  const api = useApiStructure("/staff-profile");
  const [staff, setStaff] = useState([]);

  const parseStaff = (data) => {
    return data.map((item) => ({
      label: item.firstName + " " + item.lastName,
      value: item.firstName + " " + item.lastName,
    }));
  };

  useEffect(() => {
    api.getAll(0, 10000).then((res) => {
      const parsedStaff = parseStaff(res.data.data);
      setStaff(parsedStaff);
      formik.setFieldValue(inputKey, parsedStaff[0].value);
    });
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
      {staff.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
};

export default StaffDropdown;
