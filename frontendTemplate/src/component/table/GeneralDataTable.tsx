import { useMemo, useState } from "react";
import GTableSchema, { FilterType, GColumnSchema, GFilterSchema } from "./GTableSchema";
import {
  Badge,
  Checkbox,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
} from "@mui/material";
import TableUtils from "./utils/TableUtils";
import "./table.css";
import { Filter, Filter1Outlined, FilterAlt } from "@mui/icons-material";

const GeneralDataTable = ({
  tableSchema,
  data = [],
}: {
  tableSchema: GTableSchema;
  data: any[];
}) => {
  const [order, setOrder] = useState<any>("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);

  const [searchText, setSearchText] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [showFilterList, setShowFilterList] = useState(false);

  const [filterListWithValues, setFilterListWithValues] = useState(
    tableSchema.filterList.map((filter) => {
      filter.value = filter.value?filter.value: [];
      return filter;
    })
  );

  const handleSort = (column: GColumnSchema) => {
    const isAsc = orderBy === column.dataSelectorKey && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    if (!isAsc && orderBy === column.dataSelectorKey) {
      setOrderBy("");
    } else {
      setOrderBy(column.dataSelectorKey);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const appliedFilterCount = () => {
    return filterListWithValues.reduce((acc, item) => {
      if ((item.value || [])?.length > 0) {
        acc = acc + 1;
      }
      return acc;
    }, 0);
  };

  const visibleRows = useMemo(() => {
    let sortedData =
      rowsPerPage > 0
        ? TableUtils.sort
            .sortData(data, order, orderBy)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : TableUtils.sort.sortData(data, order, orderBy);

    if (appliedFilterCount() > 0) {
      sortedData = TableUtils.sort
        .sortData(data, order, orderBy)
        .filter((item) => {
          return filterListWithValues.some((filter) =>
            {
              if(filter.type === FilterType.Boolean) {
                return filter.value === item[filter.dataSelectorKey]
              }
              return filter.value?.includes(item[filter.dataSelectorKey])
              }
          );
        });
    }

    return sortedData.filter((item) => {
      return tableSchema.columnList.some((column) =>
        item[column.dataSelectorKey].toString().toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [
    order,
    orderBy,
    data,
    page,
    rowsPerPage,
    searchText,
    filterListWithValues,
  ]);

  const handleFilterChange = (filter: GFilterSchema, val: any) => {
    const selectedFilterIndex = filterListWithValues.findIndex(
      (item) => item.dataSelectorKey === filter.dataSelectorKey
    );
    if (selectedFilterIndex !== -1) {
      filterListWithValues[selectedFilterIndex].value = filter.filterValue
        ? val[filter.filterValue]
        : val;
    }
    setFilterListWithValues([...filterListWithValues]);
  };
  const isFilterChecked = (filter: GFilterSchema, filterItem: any) => {
    const item = filter.filterValue
      ? filterItem[filter.filterValue]
      : filterItem;
    return (filter.value || [])?.indexOf(item) > -1;
  };
  return (
    <div className="generalTable">
      <div className="px-2 d-flex align-items-center">
        <div className="flex-fill">
          <h4>{tableSchema.title}</h4></div>
        <Collapse in={showFilterList} orientation="horizontal">
          <div className="d-flex">
            {filterListWithValues.map((filter) => {
              return (
                <div>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id={filter.label}>{filter.label}</InputLabel>

                    <Select
                      labelId={filter.label}
                      label={filter.label}
                      size="small"
                      value={filter.value}
                      multiple={true}
                      onChange={(event) =>
                        handleFilterChange(filter, event.target.value)
                      }
                      renderValue={(selected) => (
                        <span className="caption">
                          {selected.length === 1
                            ? selected
                            : `${selected[0]}+${selected.length - 1} more`}
                        </span>
                      )}
                    >
                      {filter.filterItemList.map((filterItem) => {
                        return (
                          <MenuItem
                            value={
                              filter.filterValue
                                ? filterItem[filter.filterValue]
                                : filterItem
                            }
                          >
                            <Checkbox
                              checked={isFilterChecked(filter, filterItem)}
                            />
                            {filter.filterName
                              ? filterItem[filter.filterName]
                              : filterItem}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              );
            })}
          </div>
        </Collapse>
        {filterListWithValues.length>0&&<Badge className="mx-3" badgeContent={appliedFilterCount()}  color="primary">
        <FilterAlt
        style={{cursor:"pointer"}}
          onClick={() => {
            setShowFilterList(!showFilterList);
          }}
        />
        </Badge>}

        <div>
          <TextField
            value={searchText}
            onInput={(event: any) => setSearchText(event.target.value)}
            placeholder="Search"
          />
        </div>
      </div>
      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableSchema.columnList.map((column) => {
              return (
                <TableCell
                  sortDirection={order}
                  key={`${column.dataSelectorKey}`}
                >
                  <TableSortLabel
                    active={orderBy === column.dataSelectorKey}
                    // direction="asc"
                    direction={
                      orderBy === column.dataSelectorKey ? order : "asc"
                    }
                    onClick={() => handleSort(column)}
                  >
                    {column.name}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row: any, rowIndex: number) => (
            <TableRow
              key={`row${rowIndex}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {tableSchema.columnList.map((column) => {
                return (
                  <TableCell key={column.dataSelectorKey}>
                    {
                      <column.component
                        value={row}
                        dataSelectorKey={column.dataSelectorKey}
                      />
                    }
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, { value: -1, label: "All" }]}
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default GeneralDataTable;
