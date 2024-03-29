import { IconButton, SvgIcon } from "@mui/material";
import ArrowLongDownIcon from "@heroicons/react/24/solid/ArrowLongDownIcon";
import ArrowLongUpIcon from "@heroicons/react/24/solid/ArrowLongUpIcon";

const Sort = ({ column, sort, onSort }) => {
  const getColor = (type) => {
    if (column === sort.column && type === sort.value) {
      return "primary";
    }
    return "inherit";
  };

  return (
    <>
      <IconButton
        onClick={() => {
          onSort({ column, value: "DESC" });
        }}
        sx={{ padding: 0, ml: "10px" }}
      >
        <SvgIcon fontSize="small" color={getColor("DESC")}>
          <ArrowLongDownIcon />
        </SvgIcon>
      </IconButton>
      <IconButton
        onClick={() => {
          onSort({ column, value: "ASC" });
        }}
        sx={{ padding: 0 }}
      >
        <SvgIcon fontSize="small" color={getColor("ASC")}>
          <ArrowLongUpIcon />
        </SvgIcon>
      </IconButton>
    </>
  );
};

export default Sort;
