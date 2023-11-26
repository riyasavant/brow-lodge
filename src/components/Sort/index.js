import { IconButton, SvgIcon } from "@mui/material";
import ArrowLongDownIcon from "@heroicons/react/24/solid/ArrowLongDownIcon";
import ArrowLongUpIcon from "@heroicons/react/24/solid/ArrowLongUpIcon";

const Sort = ({ column, onSort }) => {
  return (
    <>
      <IconButton
        onClick={() => {
          onSort(column, "DESC");
        }}
        sx={{ padding: 0, ml: "10px" }}
      >
        <SvgIcon fontSize="small">
          <ArrowLongDownIcon />
        </SvgIcon>
      </IconButton>
      <IconButton
        onClick={() => {
          onSort(column, "ASC");
        }}
        sx={{ padding: 0 }}
      >
        <SvgIcon fontSize="small">
          <ArrowLongUpIcon />
        </SvgIcon>
      </IconButton>
    </>
  );
};

export default Sort;
