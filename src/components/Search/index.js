import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  TextField,
  Unstable_Grid2 as Grid,
  CardHeader,
} from "@mui/material";
import { useState } from "react";

const parseColumns = (data) => {
  return data.map((item) => ({
    value: item.key,
    label: item.label,
  }));
};

const getPlaceholder = (data, key) => {
  return data.filter((item) => item.value === key)[0].label;
};

const Search = ({ headers, onChange }) => {
  const allColumns = parseColumns(headers);
  const [column, setColumn] = useState(allColumns[0].value);
  return (
    <Card sx={{ px: 2 }}>
      <CardHeader
        title="Search Table"
        subheader="Select column and enter the text to be searched"
        sx={{ px: 0, color: "#4337C9" }}
      />
      <Grid container spacing={3} sx={{ pb: 2, alignItems: "center" }}>
        <Grid xs={12} sm={4}>
          <TextField
            fullWidth
            label="Select Column"
            name="column"
            onChange={(e) => setColumn(e.target.value)}
            required
            select
            SelectProps={{ native: true }}
            value={column}
          >
            {allColumns.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} sm={8}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder={`Search ${getPlaceholder(allColumns, column)}`}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            onChange={(e) => onChange(e.target.value, column)}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default Search;
