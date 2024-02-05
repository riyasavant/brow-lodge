import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import ArrowUTurnLeftIcon from "@heroicons/react/24/solid/ArrowUturnLeftIcon";
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  TextField,
  Unstable_Grid2 as Grid,
  CardHeader,
  Button,
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DATE_PICKER_COLUMNS = ["date", "dateOfBirth", "Client.dateOfBirth"];

const Search = ({ headers, onChange, onResetSearch }) => {
  const [column, setColumn] = useState(headers[0].value);
  const [dateVal, setDateVal] = useState(null);
  const [val, setVal] = useState("");

  const debouncedResults = useMemo(() => {
    return debounce((value, column) => onChange({ column, value }), 500);
  }, [onChange]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const onDateSearch = (value) => {
    setDateVal(value);
    if (dayjs(value).format() !== "Invalid Date") {
      onChange({ column, value });
    }
  };

  const onValueSearch = (value) => {
    setVal(value);
  };

  const reset = () => {
    setDateVal(null);
    setVal("");
    onResetSearch();
  };

  useEffect(() => {
    if (val !== "") {
      debouncedResults(val, column);
    } else {
      onResetSearch();
    }
  }, [val]);

  const isClearDisabled = () => {
    if (DATE_PICKER_COLUMNS.includes(column)) {
      return !dateVal;
    } else {
      return !val;
    }
  };

  const handleColumnChange = (colVal) => {
    setColumn(colVal);
    onResetSearch();
    setVal("");
    setDateVal(null);
  };

  return (
    <Card sx={{ px: 2 }}>
      <CardHeader
        title="Search Table"
        subheader="Select column and enter the text to be searched"
        sx={{ px: 0, color: "#4337C9" }}
      />
      <Grid container spacing={3} sx={{ pb: 2, alignItems: "center" }}>
        <Grid xs={12} sm={3}>
          <TextField
            fullWidth
            label="Select Column"
            name="column"
            onChange={(e) => handleColumnChange(e.target.value)}
            required
            select
            SelectProps={{ native: true }}
            value={column}
          >
            {headers.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid xs={12} sm={6}>
          {DATE_PICKER_COLUMNS.includes(column) && (
            <DatePicker
              value={dateVal}
              sx={{ width: "100%" }}
              fullWidth
              format="DD/MM/YYYY"
              label="Search Date"
              onChange={onDateSearch}
              timezone="UTC"
            />
          )}
          {!DATE_PICKER_COLUMNS.includes(column) && (
            <OutlinedInput
              value={val}
              fullWidth
              placeholder={`Search`}
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon color="action" fontSize="small">
                    <MagnifyingGlassIcon />
                  </SvgIcon>
                </InputAdornment>
              }
              onChange={(e) => onValueSearch(e.target.value)}
            />
          )}
        </Grid>
        <Grid xs={12} sm={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={reset}
            disabled={isClearDisabled()}
          >
            <SvgIcon fontSize="small" sx={{ mr: 1 }}>
              <ArrowUTurnLeftIcon />
            </SvgIcon>
            Remove Filter
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Search;
