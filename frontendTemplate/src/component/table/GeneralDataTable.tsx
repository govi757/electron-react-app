import { useImperativeHandle, useMemo, useState } from "react";
import GTableSchema, {
  ActionType,
  FilterType,
  GActionSchema,
  GColumnSchema,
  GFilterSchema,
} from "./GTableSchema";
import {
  Badge,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  InputLabel,
  Menu,
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
import {
  AddOutlined,
  EditOutlined,
  Filter,
  Filter1Outlined,
  FilterAlt,
} from "@mui/icons-material";
import GSelectField from "../form/fields/GSelectField";
import GMenu from "../general/GMenu";
import { selectValue } from "src/common/dataSelector";

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
  const [selectedRowList, setSelectedRowList] = useState<any>([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showFilterList, setShowFilterList] = useState(false);
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  

  const [filterListWithValues, setFilterListWithValues] = useState(
    tableSchema.filterList.map((filter) => {
      filter.value = filter.value ? filter.value : [];
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
          return filterListWithValues.some((filter) => {
            if (filter.type === FilterType.Boolean) {
              return filter.value === item[filter.dataSelectorKey];
            }
            return filter.value?.includes(item[filter.dataSelectorKey]);
          });
        });
    }

    return sortedData.filter((item) => {
      return tableSchema.columnList.some((column) =>
        (selectValue(item, column.dataSelectorKey) || "")
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
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

  const handleSelectRow = (row: any, val: any) => {
    const newSelectedRowList = selectedRowList;
    if(tableSchema.itemKey) {
      const selectedRowIndex = newSelectedRowList.indexOf(row[tableSchema.itemKey]);
      if(selectedRowIndex===-1) {
        newSelectedRowList.push(row[tableSchema.itemKey]);
      } else {
        newSelectedRowList.splice(selectedRowIndex, 1);
      }
      
    }
    
    setSelectedRowList([...newSelectedRowList])
  }

  const handleOtherMenuClick = (item: GActionSchema) => {
      item.onClick(selectedRowList);
    
  }

  const addActionList = () => {
    return tableSchema.actionList.filter(
      (item) => item.type === ActionType.Add
    );
  };

  const editActionList = () => {
    return tableSchema.actionList.filter(
      (item) => item.type === ActionType.Edit
    );
  };

  const otherActionList = () => {
    return tableSchema.actionList.filter(
      (item) => item.type === ActionType.Others
    );
  };

  const resetTable = ()=> {
    setSelectedRowList([]);
    // if(tableSchema.ref) {
    //   tableSchema.ref.current();
    // }
    
  }

  useImperativeHandle(tableSchema.ref, () => ({
    resetTable,
  }));

  const nonBooleanFilter = () => {
    return filterListWithValues.filter(item => item.type!==FilterType.Boolean);
  }
  return (
    <div className="generalTable">
      <div className="px-2 d-flex align-items-center">
        <div className="flex-fill">
          <h4>{tableSchema.title}</h4>
        </div>
        {otherActionList().length>0&&
          <div className="mx-2">
            <GMenu label="Actions">
              {otherActionList().map((item, index) => {
                return <MenuItem
                disabled={(item.singleSelect&&selectedRowList.length!==1)||selectedRowList.length<1}
                key={item.label + index} onClick={() => handleOtherMenuClick(item)}>{item.label}</MenuItem>
              })}
              
            </GMenu>
          </div>
        }
        {addActionList().map((action, index) => (
          <Button
            size="small"
            key={action.label + index}
            onClick={action.onClick}
            className="mx-1"
            variant="outlined"
          >
            <AddOutlined />
            {action.label}
          </Button>
        ))}
        
        <Collapse in={showFilterList} orientation="horizontal">
          <div className="d-flex">
            {nonBooleanFilter().map((filter) => {
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
        {filterListWithValues.length > 0 && (
          <Badge
            className="mx-3"
            badgeContent={appliedFilterCount()}
            color="primary"
          >
            <FilterAlt
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowFilterList(!showFilterList);
              }}
            />
          </Badge>
        )}

        <div>
          <TextField
            size="small"
            value={searchText}
            onInput={(event: any) => setSearchText(event?.target?.value)}
            placeholder="Search"
          />
        </div>
      </div>
      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {otherActionList().length > 0 && <TableCell></TableCell>}
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
            {editActionList().map((item) => (
              <TableCell sortDirection={order} key={`${item.label}`}>
                Action
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((row: any, rowIndex: number) => (
            <TableRow
              key={`row${rowIndex}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {otherActionList().length > 0 && (
                <TableCell width={15}>
                  {tableSchema.itemKey&&
                  <Checkbox size="small" checked={selectedRowList.includes(row[tableSchema.itemKey])}
                  onChange={(val) => {handleSelectRow(row,val)}}
                  />
                  }
                </TableCell>
              )}
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
              {editActionList().map((item) => (
                <TableCell sortDirection={order} key={`${item.label}`}>
                  <span role="button" onClick={() => item.onClick(row)}>
                    <EditOutlined fontSize="small" />
                  </span>
                </TableCell>
              ))}
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
