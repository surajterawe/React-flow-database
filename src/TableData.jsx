import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Switch,
  Typography,
  styled,
} from "@mui/material";
import { Add, ChevronLeft, Delete, Remove } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { addEdge, applyEdgeChanges } from "@xyflow/react";

const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: "4xl",
  border: "1px solid #e2e8f0",
  boxShadow: "none",
  borderRadius: "0.5rem",
  backgroundColor: "#fff",
});

const Header = styled(Box)({
  padding: "1rem",
  borderBottom: "1px solid #e2e8f0",
  "& .MuiTypography-h2": {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.025em",
  },
});

const StyledButton = styled(Button)({
  textTransform: "none",
  padding: "0.5rem",
  minWidth: 0,
  "&.MuiButton-outlined": {
    borderColor: "#e2e8f0",
    color: "#1f2937",
  },
});

const ITEM_HEIGHT = 28;
const ITEM_PADDING_TOP = 4;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function TableData({
  data = { tableName: "Table" },
  setNodes,
  getNode,
  getNodes,
  setEdges,
  toggleDrawer,
}) {
  const [columns, setColumns] = React.useState(getNode(data.id)?.data?.columns);
  const [rows, setRows] = React.useState(getNode(data.id)?.data?.rows);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorPosition, setAnchorPosition] = React.useState(null);
  const [currentChoice, setCurrentChoice] = React.useState([]);
  const [showChoice, setShowChoice] = React.useState(false);
  const [choiceError, setChoiceError] = React.useState("");
  const [columnData, setColumnData] = React.useState({
    columnName: "",
    columnType: "",
    columnFormat: "",
    isRequired: false,
    editingField: null,
    choice: [],
    lookuptableid: "",
    lookupList: [],
  });
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [isLookup, setIsLookup] = React.useState(false);
  const handleColumnChange = (name, value) => {
    /**
     * show table dropdown
     * select the table
     */
    if (name === "columnType" && value === "lookup") {
      setIsLookup(true);
    } else if (name === "columnType" && value !== "lookup") {
      setIsLookup(false);
    }

    /**
     * here i have selected the table i want to use For lookup
     * save the primary values of each row in column data
     * save the table id
     *
     */
    if (name === "lookupTable") {
      setColumnData({
        ...columnData,
        lookuptableid: value,
        lookupdata: data.rows.map((item) => ({
          value: item.id,
        })),
      });
    }

    if (name === "columnType" && value === "choice") {
      /**
       * Step 1 : Selected type is Choice
       * step 2 : check if we have choice in column data
       * setp 3 : if not add array in column with object of display name and value
       *    a) create same array of object in current choice
       * setp 4 : if present use the column.choice in the crrent choice
       */

      if (columnData?.choice?.length > 0) {
        setCurrentChoice([...columnData.choice]);
      } else {
        setCurrentChoice([
          {
            id: uuidv4(),
            display: "",
            value: "",
          },
        ]);
      }
      setShowChoice(true);
    }
    setColumnData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === data.id
          ? { ...node, data: { ...node.data, columns, rows } }
          : node
      )
    );
  }, [columns, rows]);

  const handleOpenPopover = (event, column = null, fromHeader = false) => {
    event.preventDefault();
    event.stopPropagation();

    const headerElement = fromHeader ? event.currentTarget : null;
    if (column) {
      setCurrentChoice(column.choice);
      setColumnData({
        columnName: column.headerName || "",
        columnType: column.type || "",
        columnFormat: column.format || "",
        isRequired: column.required || false,
        editingField: column.field,
        choice: column.choice || [],
        lookuptableid: column.lookuptableid || "",
        lookupdata: column.lookupdata || [],
      });
      if (column.type === "lookup") {
        setIsLookup(true);
      }
    } else {
      setColumnData({
        columnName: "",
        columnType: "",
        columnFormat: "",
        isRequired: false,
        editingField: null,
        choice: [],
      });
    }

    if (headerElement) {
      const rect = headerElement.getBoundingClientRect();
      setAnchorPosition({
        top: rect.bottom,
        left: rect.left,
      });
      setAnchorEl(null);
    } else {
      setAnchorPosition(null);

      setAnchorEl(event.currentTarget);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorPosition(null);
    setCurrentChoice([]);
    setColumnData({
      columnName: "",
      columnType: "",
      columnFormat: "",
      isRequired: false,
      choice: [],
      editingField: null,
    });
  };

  const saveColumn = () => {
    if (!columnData.columnName) return;
    if (columnData.type === "lookup" && columnData.lookuptableid) {
      return;
    }

    if (columnData.type === "choice") {
      if (
        currentChoice.length < 1 ||
        !currentChoice.some((item) => item.display && item.value)
      ) {
        return;
      }
    }

    let newColumn = {
      field:
        columnData.editingField ||
        columnData.columnName.replaceAll(" ", "").toLowerCase(),
      headerName: columnData.columnName.trim(),
      type: columnData.columnType,
      format: columnData.columnFormat,
      required: columnData.isRequired,
      width: 130,
      sortable: true,
      editable: true,
    };

    if (columnData.columnType === "choice") {
      newColumn = {
        ...newColumn,
        choice: [...currentChoice.filter((item) => item.display && item.value)],
      };
    }

    if (columnData.columnType === "lookup") {
       const relationshipid = uuidv4()
      const newEdge = {
        source: data.id,
        target: columnData.lookuptableid,
        data: {
          displayName: newColumn.headerName,
          relationType: "oneToMany",
          relationship: "", 
          relationshipid,     
          schemaName: newColumn.field,
        },
      };

      setEdges((eds) =>  addEdge(newEdge, eds));

      newColumn = {
        ...newColumn,
        relationshipid,
        lookuptableid: columnData.lookuptableid,
        lookupdata: columnData.lookupdata,
      };
    }

    setColumns((prev) => {
      if (columnData.editingField) {
        return prev.map((col) =>
          col.field === columnData.editingField ? { ...col, ...newColumn } : col
        );
      }
      return [...prev, newColumn];
    });

    handleClosePopover();
  };

  const CustomHeader = (params) => {
    const handleHeaderClick = (event) => {
      if (params.field !== "id") {
        handleOpenPopover(event, params.colDef, true);
      }
    };

    return (
      <Box
        onClick={handleHeaderClick}
        sx={{
          cursor: params.field === "id" ? "default" : "pointer",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          "&:hover": {
            backgroundColor:
              params.field === "id" ? "transparent" : "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {params.colDef.headerName || params.field}
      </Box>
    );
  };

  const CustomRow = (params) => {
    return (
      <Box
        sx={{
          cursor: params.field === "id" ? "default" : "pointer",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          "&:hover": {
            backgroundColor:
              params.field === "id" ? "transparent" : "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {["lookup", "choice"].includes(params.colDef.type) ? (
          <FormControl
            sx={{
              m: 1,
              width: 300,
            }}
          >
            <Select
              displayEmpty
              input={<OutlinedInput />}
              sx={{
                ["& .MuiSelect-select"]: {
                  padding: "10px",
                },
              }}
              MenuProps={MenuProps}
              inputProps={{ "aria-label": "Without label" }}
            >
              {params.colDef.type === "lookup" &&
                params.colDef.lookupdata.map((choice) => (
                  <MenuItem key={choice.value} value={choice.value}>
                    {choice.value}
                  </MenuItem>
                ))}

              {params.colDef.type === "choice" &&
                params.colDef.choice.map((choice) => (
                  <MenuItem key={choice.id} value={choice.value}>
                    {choice.display}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        ) : (
          params.formattedValue || params.field
        )}
      </Box>
    );
  };

  const columnsWithCustomHeaders = columns.map((col) => ({
    ...col,
    renderHeader: (params) => <CustomHeader {...params} />,
    renderCell: (params) => <CustomRow {...params} />,
    disableColumnMenu: true,
  }));

  const addNewRow = () => {
    const newRow = { id: uuidv4() };
    setRows((prev) => [...prev, newRow]);
  };

  const processRowUpdate = (newRow, oldRow) => {
    const updatedRows = rows.map((row) =>
      row.id === oldRow.id ? { ...newRow } : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const handleProcessRowUpdateError = (error) => {
    console.error("Error updating row:", error);
  };

  const deleteSelectedRows = () => {
    const updatedRows = rows.filter((row) => !selectionModel.includes(row.id));
    if (updatedRows.length < 1) {
      updatedRows.push({
        id: uuidv4(),
      });
    }
    setRows(updatedRows);
    setSelectionModel([]);
  };

  const AddChoice = () => {
    setCurrentChoice((prev) => [
      ...prev,
      {
        display: "",
        value: "",
        id: uuidv4(),
      },
    ]);
  };
  const removeChoice = (id) => {
    setCurrentChoice(
      currentChoice.filter((item) => item.id !== id),
      currentChoice,
      id
    );
  };

  /**
   * 1. get current choice from the list
   * 2. find the object with same id
   * 3. update the object
   * 4. place the object at that place
   */

  const handleChoiceChange = (name, id, value) => {
    if (currentChoice.some((item) => item[name] === value)) {
      setChoiceError("Same Choice Already Exist");
      return;
    } else {
      setChoiceError("");
    }
    let local_currentChoiceValue = [...currentChoice];
    const index = local_currentChoiceValue.findIndex((item) => item.id === id);

    local_currentChoiceValue[index] = {
      ...local_currentChoiceValue[index],
      [name]: value,
    };
    setCurrentChoice([...local_currentChoiceValue]);
  };

  return (
    <StyledCard>
      <Header>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h2">{data.tableName}</Typography>
          <Box display="flex" gap={2}>
            <StyledButton
              variant="outlined"
              onClick={(e) => handleOpenPopover(e)}
              sx={{ gap: "0.5rem" }}
            >
              <Add sx={{ width: 16, height: 16 }} />
              New Column
            </StyledButton>

            <Popover
              open={Boolean(anchorEl) || Boolean(anchorPosition)}
              anchorEl={anchorEl}
              anchorReference={anchorPosition ? "anchorPosition" : "anchorEl"}
              anchorPosition={anchorPosition}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box
                p={2}
                sx={{ backgroundColor: "#fff", color: "#000", width: "40rem" }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {columnData.editingField ? "Edit Column" : "Add New Column"}
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <FormControl>
                    <Input
                      placeholder="Column Name"
                      value={columnData.columnName}
                      onChange={(e) =>
                        handleColumnChange("columnName", e.target.value)
                      }
                      fullWidth
                      sx={{ p: "0.5rem" }}
                    />
                  </FormControl>

                  <FormControl>
                    <Select
                      value={columnData.columnType}
                      onChange={(e) =>
                        handleColumnChange("columnType", e.target.value)
                      }
                      displayEmpty
                      input={<Input sx={{ p: "0.5rem" }} />}
                    >
                      <MenuItem value="" disabled>
                        Column Type
                      </MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="date">Date</MenuItem>
                      <MenuItem value="lookup">Look up</MenuItem>
                      <MenuItem value="choice">Choice</MenuItem>
                    </Select>
                    <FormHelperText id="component-error-text">
                      <Typography fontSize={"10px"} color="error">
                        {choiceError}
                      </Typography>
                    </FormHelperText>
                  </FormControl>
                  {showChoice && (
                    <FormControl>
                      {currentChoice.map((item) => {
                        return (
                          <Box key={item.id} display={"flex"} gap={"10px"}>
                            <OutlinedInput
                              key={item.id}
                              value={item.display}
                              name="display"
                              onChange={(e) => {
                                handleChoiceChange(
                                  e.target.name,
                                  item.id,
                                  e.target.value
                                );
                              }}
                              placeholder="Display Name"
                              sx={{
                                marginTop: "10px",
                                width: "45%",
                                border: "none",
                                height: "27px",
                                ["& .MuiInputBase-input"]: {
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                },
                              }}
                            />
                            <OutlinedInput
                              key={item.id}
                              value={item.value}
                              placeholder="Value"
                              name="value"
                              onChange={(e) => {
                                handleChoiceChange(
                                  e.target.name,
                                  item.id,
                                  e.target.value
                                );
                              }}
                              sx={{
                                marginTop: "10px",
                                width: "60%",
                                border: "none",
                                height: "27px",
                                ["& .MuiInputBase-input"]: {
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                  border: "1px solid black",
                                  borderRadius: "5px",
                                },
                              }}
                              renderSuffix={() => (
                                <Box display={"flex"}>
                                  <IconButton onClick={() => AddChoice()}>
                                    <Add />
                                  </IconButton>
                                  <IconButton
                                    disabled={!(currentChoice.length > 1)}
                                    onClick={() => removeChoice(item.id)}
                                  >
                                    <Remove />
                                  </IconButton>
                                </Box>
                              )}
                            />
                          </Box>
                        );
                      })}
                    </FormControl>
                  )}
                  {isLookup && (
                    <Select
                      value={columnData.lookuptableid}
                      onChange={(e) =>
                        handleColumnChange("lookupTable", e.target.value)
                      }
                      displayEmpty
                      input={<Input sx={{ p: "0.5rem" }} />}
                    >
                      {getNodes()
                        .filter((value) => value.data.id !== data.id)
                        ?.map((item) => {
                          return (
                            <MenuItem value={item.data.id}>
                              {item.data.tableName}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  )}
                  <FormControl>
                    <Select
                      value={columnData.columnFormat}
                      onChange={(e) =>
                        handleColumnChange("columnFormat", e.target.value)
                      }
                      displayEmpty
                      input={<Input sx={{ p: "0.5rem" }} />}
                    >
                      <MenuItem value="" disabled>
                        Format
                      </MenuItem>
                      <MenuItem value="default">Default</MenuItem>
                      <MenuItem value="currency">Currency</MenuItem>
                      <MenuItem value="percentage">Percentage</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={columnData.isRequired}
                        onChange={(e) =>
                          handleColumnChange("isRequired", e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Required</Typography>}
                  />

                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <StyledButton
                      variant="outlined"
                      onClick={handleClosePopover}
                    >
                      Cancel
                    </StyledButton>
                    <Button
                      variant="contained"
                      onClick={saveColumn}
                      sx={{
                        textTransform: "none",
                        bgcolor: "#2563eb",
                        "&:hover": {
                          bgcolor: "#1d4ed8",
                        },
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Popover>

            <StyledButton
              variant="outlined"
              onClick={addNewRow}
              sx={{ gap: "0.5rem" }}
            >
              <Add sx={{ width: 16, height: 16 }} />
              New Row
            </StyledButton>

            {selectionModel.length > 0 && (
              <StyledButton
                variant="outlined"
                onClick={deleteSelectedRows}
                sx={{ gap: "0.5rem" }}
              >
                <Delete sx={{ width: 16, height: 16 }} />
                Delete
              </StyledButton>
            )}

            <StyledButton variant="text" onClick={() => toggleDrawer(false)}>
              <ChevronLeft sx={{ width: 16, height: 16 }} />
            </StyledButton>
          </Box>
        </Box>
      </Header>

      <CardContent>
        <Paper
          sx={{
            height: 400,
            width: "100%",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columnsWithCustomHeaders}
            checkboxSelection={rows.length > 1}
            hideFooterPagination
            selectionModel={selectionModel}
            onRowSelectionModelChange={(newSelection) => {
              setSelectionModel(newSelection);
            }}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
          />
        </Paper>
      </CardContent>
    </StyledCard>
  );
}
