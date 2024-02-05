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
  IconButton,
  SvgIcon,
  Alert,
} from "@mui/material";
import { Scrollbar } from "src/components/Scrollbar/Scrollbar";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import DeleteModal from "src/components/DeleteModal";
import { useState } from "react";
import Search from "../Search";
import Sort from "../Sort";
import dayjs from "dayjs";
import { useAuthContext } from "src/auth/authContext";

const CustomTable = (props) => {
  const { user } = useAuthContext();
  const roles = user.Roles || [];
  const currentEmail = user?.Staff?.email || "";
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
    isRowClickable = false,
    onRowClick = () => {},
    onSearch = () => {},
    search = [],
    sort = {},
    onSort = () => {},
    onResetSearch = () => {},
    isStaff = false,
    permissions = {},
  } = props;
  const [modalData, setModalData] = useState({ show: false, id: "" });
  const { delete: deleteAction, update } = permissions;

  const onDeleteEntry = () => {
    onDelete(modalData.id);
    setModalData({ show: false, id: "" });
  };

  return (
    <>
      <Search
        headers={search}
        onChange={onSearch}
        onResetSearch={onResetSearch}
        tableData={items}
      />
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
                    <TableCell key={header.key} sx={{ minWidth: "200px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {header.label}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {header.sort && (
                            <Sort
                              column={header.key}
                              onSort={onSort}
                              sort={sort}
                            />
                          )}
                        </div>
                      </div>
                    </TableCell>
                  ))}
                  {(deleteAction || update) && (
                    <TableCell align="right" sx={{ minWidth: "120px" }}>
                      Actions
                    </TableCell>
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
                        if (header.key === "clientSign") {
                          return (
                            <TableCell
                              key={header.key}
                              sx={{ minWidth: "200px" }}
                            >
                              <img
                                src={customer.clientSign}
                                height={20}
                                width={100}
                              />
                            </TableCell>
                          );
                        }
                        if (header.key === "dateOfBirth") {
                          return (
                            <TableCell
                              key={header.key}
                              sx={{ minWidth: "200px" }}
                            >
                              {customer[header.key] &&
                                dayjs(customer[header.key]).format(
                                  "DD/MM/YYYY"
                                )}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell
                            key={header.key}
                            sx={{ minWidth: "200px" }}
                          >
                            {customer[header.key]}
                          </TableCell>
                        );
                      })}
                      {(deleteAction || update) && (
                        <TableCell align="right" sx={{ minWidth: "120px" }}>
                          {(!isStaff || currentEmail !== customer.email) &&
                            update && (
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
                            )}
                          {(!isStaff || currentEmail !== customer.email) &&
                            deleteAction && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalData({
                                    show: true,
                                    id: customer.id,
                                  });
                                }}
                                size="medium"
                              >
                                <SvgIcon fontSize="small">
                                  <TrashIcon />
                                </SvgIcon>
                              </IconButton>
                            )}
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
