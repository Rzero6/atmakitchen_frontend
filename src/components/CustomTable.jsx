import React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const CustomTable = ({
  tableHeader,
  handleRowClick,
  data,
  readOnly = false,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Paper
      sx={{ width: "100vh", overflow: "hidden", overflowX: "auto" }}
      className="p-3"
    >
      <div className="mt-3">
        <TextField
          label="Search"
          variant="outlined"
          color="primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "20px", width: "100%" }}
        />
      </div>
      <TableContainer sx={{ height: 330 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {tableHeader.map((header) => (
                <TableCell
                  key={header.id}
                  align={header.align}
                  style={{
                    backgroundColor: "lightgrey",
                    minWidth: header.minWidth,
                    fontSize: "large",
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={readOnly ? undefined : () => handleRowClick(row)}
                    style={{ cursor: readOnly ? "" : "pointer" }}
                  >
                    {tableHeader.map((header) => {
                      const value = row[header.id];
                      return (
                        <TableCell key={header.id} align={header.align}>
                          {header.format ? header.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel":
            {
              margin: 0,
            },
        }}
      />
    </Paper>
  );
};

export default CustomTable;
