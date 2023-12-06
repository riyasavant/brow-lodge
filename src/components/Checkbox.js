import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const CustomCheckbox = ({ name, label, handleChange }) => {
  <FormGroup>
    <FormControlLabel
      control={<Checkbox name={name} onChange={(e) => handleChange(e)} />}
      label={<Typography sx={{ fontSize: "14px" }}>{label}</Typography>}
      labelPlacement="end"
    />
  </FormGroup>;
};

export default CustomCheckbox;
