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
  Alert,
} from "@mui/material";
import { Scrollbar } from "src/components/Scrollbar";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import ArrowLongDownIcon from "@heroicons/react/24/solid/ArrowLongDownIcon";
import ArrowLongUpIcon from "@heroicons/react/24/solid/ArrowLongUpIcon";
import DeleteModal from "src/components/DeleteModal";
import { useState } from "react";
import Search from "../Search";

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
    isRowClickable = false,
    onRowClick = () => {},
    onSearch = () => {},
  } = props;
  const [modalData, setModalData] = useState({ show: false, id: "" });

  const onDeleteEntry = () => {
    onDelete(modalData.id);
    setModalData({ show: false, id: "" });
  };

  return (
    <>
      <Search headers={headers} onChange={onSearch} />
      <Card>
        {items.length === 0 && (
          <Alert
            color="primary"
            severity="info"
            sx={{ mt: 1, fontSize: "15px" }}
          >
            There is no data available.
          </Alert>
        )}
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell key={header.key}>
                      {header.label}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(customer.id);
                        }}
                        sx={{ padding: 0, ml: "10px" }}
                      >
                        <SvgIcon fontSize="small">
                          <ArrowLongDownIcon />
                        </SvgIcon>
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(customer.id);
                        }}
                        sx={{ padding: 0 }}
                      >
                        <SvgIcon fontSize="small">
                          <ArrowLongUpIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  ))}
                  {hasActionsColumn && (
                    <TableCell align="right">Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((customer) => {
                  return (
                    <TableRow
                      hover
                      key={customer.id}
                      sx={{ cursor: isRowClickable ? "pointer" : "auto" }}
                      onClick={() => {
                        isRowClickable
                          ? onRowClick(customer.id, customer.name)
                          : onRowClick(customer.id);
                      }}
                    >
                      {headers.map((header) => {
                        if (header.key === "preferredName") {
                          return (
                            <TableCell key={header.key} minWidth={120}>
                              <Typography variant="subtitle2">
                                {customer.preferredName}
                              </Typography>
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={header.key} minWidth={120}>
                            {customer[header.key]}
                          </TableCell>
                        );
                      })}
                      {hasActionsColumn && (
                        <TableCell align="right" minWidth={120}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(customer.id);
                            }}
                            size="medium"
                          >
                            <SvgIcon fontSize="small">
                              <PencilIcon />
                            </SvgIcon>
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalData({ show: true, id: customer.id });
                            }}
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
    </>
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
