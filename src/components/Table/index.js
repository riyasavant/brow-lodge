import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  SvgIcon,
} from "@mui/material";
import { Scrollbar } from "src/components/Scrollbar";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import DeleteModal from "src/components/DeleteModal";
import { useState } from "react";

const CustomTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    onDelete = () => {},
    onEdit = () => {},
    headers = [],
    hasActionsColumn = true,
  } = props;
  const [modalData, setModalData] = useState({ show: false, id: "" });

  const onDeleteEntry = () => {
    onDelete(modalData.id);
    setModalData({ show: false, id: "" });
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header.key}>{header.label}</TableCell>
                ))}
                {hasActionsColumn && (
                  <TableCell align="right">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                return (
                  <TableRow hover key={customer.id}>
                    {headers.map((header) => {
                      if (header.key === "preferredName") {
                        return (
                          <TableCell key={header.key}>
                            <Typography variant="subtitle2">
                              {customer.preferredName}
                            </Typography>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={header.key}>
                          {customer[header.key]}
                        </TableCell>
                      );
                    })}
                    {hasActionsColumn && (
                      <TableCell align="right">
                        <IconButton
                          onClick={() => onEdit(customer.id)}
                          size="medium"
                        >
                          <SvgIcon fontSize="small">
                            <PencilIcon />
                          </SvgIcon>
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            setModalData({ show: true, id: customer.id })
                          }
                          size="medium"
                        >
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <DeleteModal
        open={modalData.show}
        onClose={() => setModalData({ show: false, id: "" })}
        onDelete={onDeleteEntry}
      />
    </Card>
  );
};

CustomTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default CustomTable;
