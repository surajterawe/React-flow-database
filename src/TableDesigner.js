import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

import Tabletreenode from "./Tabletreenode";

// Custom styles
const styles = {
  container: {
    height: "calc(100vh - 5rem)",
    width: "100%",
    position: "relative",
  },
  addButton: {
    padding: "10px",
    position: "relative",
    zIndex: 10,
  },
  tableNode: {
    padding: "1rem",
    minWidth: "200px",
  },
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  columnItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  primaryKey: {
    color: "#2196f3",
    fontSize: "12px",
  },
  handle: {
    width: "8px",
    height: "8px",
    background: "#555",
  },
  edgeMenu: {
    position: "absolute",
    backgroundColor: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    padding: "8px",
    borderRadius: "4px",
  },
};

const initColumns = [
  { field: "id", hide: true, width: 70, editable: true },
  {
    field: "newcolumn",
    headerName: "New Column",
    width: 130,
    editable: true,
    type: "text",
    format: "default",
    required: false,
  },
];

const initRows = [{ id: uuidv4(), newcolumn: "New Data" }];

// Custom Node Component
const TableNode = ({ data }) => {
  const { tableName, columns = [] } = data;

  return (
    <Paper sx={styles.tableNode}>
      <Handle type="target" position={Position.Left} style={styles.handle} />
      <Handle type="source" position={Position.Right} style={styles.handle} />

      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        {tableName}
      </Typography>

      <Box sx={styles.columnContainer}>
        {columns.map((column, index) => (
          <Box key={index} sx={styles.columnItem}>
            <span>{column.name}</span>
            <Typography color="text.secondary" component="span">
              ({column.type})
            </Typography>
            {column.isPrimary && (
              <Typography sx={styles.primaryKey} component="span">
                PK
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Main Table Designer Component
const TableDesigner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [edgeMenuPosition, setEdgeMenuPosition] = useState(null);
  const [currentTable, setCurrentTable] = useState({
    tableName: "",
    columns: [],
    row: [],
  });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tempConnection, setTempConnection] = useState(null);
  const [formData, setFormData] = useState({
    relationType: "oneToMany",
    displayName: "",
    schemaName: "",
    relationship: "",
  });

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const handleAddTable = () => {
    const id = uuidv4();
    const samelengthName = nodes.filter((items) =>
      items.data.tableName.includes("Table Name")
    ).length;
    const newTabledata = {
      id,
      tableName: `Table Name ${
        samelengthName > 0 ? `${samelengthName + 1}` : ""
      }`,
      columns: [...initColumns],
      rows: [...initRows],
    };

    setCurrentTable({ ...newTabledata });
    const newNode = {
      id,
      type: "tabletreenode",
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        ...newTabledata,
        currentTable,
        setCurrentTable,
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const nodeTypes = useMemo(
    () => ({
      tabletreenode: Tabletreenode,
      table: TableNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params) => {
      const isPresent = nodes
        .some((node) =>
          node.data.columns.some(
            (value) =>
              value?.lookuptableid === params.source ||
              value?.lookuptableid === params.target
          )
        );
  
      if (!isPresent) {
        setTempConnection(params); // Temporary storage for handling dialogs or further actions
        setIsDialogOpen(true);    // Open a confirmation dialog or handle as needed
      } else {
        // If the connection is invalid, do nothing (React Flow won't add the edge)
        return false; 
      }
    },
    [nodes]
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { relationType, displayName, schemaName, relationship } = formData;
    let newColumn = {
      field: schemaName,
      headerName: displayName,
      type: "lookup",
      format: "default",
      required: false,
      width: 130,
      sortable: true,
      editable: true,
      lookuptableid: relationType === "manyToOne"
        ? tempConnection.source
        : tempConnection.target,
      lookupdata: nodes
        .find(
          (item) =>
            item.id ===
            (relationType === "manyToOne"
              ? tempConnection.source
              : tempConnection.target)
        )
        .data.rows.map((item) => ({
          value: item.id,
        })),
    };
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === (relationType === "manyToOne"
          ? tempConnection.target
          : tempConnection.source)
          ? { ...node, data: { ...node.data, columns: [...node.data.columns , newColumn] } }
          : node
      )
    );
    const newEdge = {
      ...tempConnection,
      data: { relationType, displayName, schemaName, relationship },
    };

    setEdges((eds) => addEdge(newEdge, eds));
    setIsDialogOpen(false);
    setTempConnection(null);
    setFormData({
      relationType: "oneToMany",
      displayName: "",
      schemaName: "",
      relationship: "",
    });
  };



  const handleClose = () => {
    setIsDialogOpen(false);
    setTempConnection(null);
  };

  const handleEdgeClick = (event, edge) => {
    event.stopPropagation(); // Prevent ReactFlow from interpreting this as a click on the flow
    setEdgeMenuPosition({ x: event.clientX, y: event.clientY, edge });
  };

  const handleEditEdge = () => {
    const { edge } = edgeMenuPosition;
    const edgeData = edges.find((e) => e.id === edge.id)?.data || {};
    setFormData({
      relationType: edgeData.relationType || "oneToMany",
      displayName: edgeData.displayName || "",
      schemaName: edgeData.schemaName || "",
      relationship: edgeData.relationship || "",
    });
    setTempConnection(edge);
    setIsDialogOpen(true);
    setEdgeMenuPosition(null); // Close the edge menu
  };

  const handleDeleteEdge = () => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeMenuPosition.edge.id));
    setEdgeMenuPosition(null); // Close the edge menu
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.addButton}>
        <Button variant="text" startIcon={<AddIcon />} onClick={handleAddTable}>
          Add Table
        </Button>
      </Box>

      <ReactFlow
        style={{
          background: "#F5F5F5",
        }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={handleEdgeClick} // Add edge click handler
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {edgeMenuPosition && (
        <Box
          sx={{
            ...styles.edgeMenu,
            left: edgeMenuPosition.x,
            top: edgeMenuPosition.y,
          }}
        >
          <Button onClick={handleEditEdge}>Edit</Button>
          <Button onClick={handleDeleteEdge}>Delete</Button>
        </Box>
      )}

      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Connect Tables</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            name="relationType"
            value={formData.relationType}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="oneToMany">One to Many</MenuItem>
            <MenuItem value="manyToOne">Many to One</MenuItem>
          </Select>
          <Divider orientation="horizontal" variant="middle" flexItem />
          <TextField
            fullWidth
            label="Display Name"
            name="displayName"
            value={formData.displayName}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Schema Name"
            name="schemaName"
            readonly
            value={formData.displayName.replaceAll(" ", "").toLowerCase()}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableDesigner;
