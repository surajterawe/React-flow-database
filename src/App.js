// import React, { useState, useCallback } from "react";
// import {
//   Box,
//   Button,
// } from "@mui/material";
// import { Add as AddIcon } from "@mui/icons-material";

// import {
//   ReactFlow,
//   addEdge,
//   applyEdgeChanges,
//   applyNodeChanges,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import TextUpdaterNode from './TextUpdaterNode';
// import Tabletreenode from "./Tabletreenode";

// const rfStyle = {
//   backgroundColor: '#B8CEFF',
// };

// const initialNodes = [
//   {
//     id: 'node-1',
//     type: 'textUpdater',
//     position: { x: 0, y: 0 },
//     data: { value: 123 },
//   },
//   {
//     id: 'node-2',
//     type: 'output',
//     targetPosition: 'top',
//     position: { x: 0, y: 200 },
//     data: { label: 'node 2' },
//   },
//   {
//     id: 'node-3',
//     type: 'output',
//     targetPosition: 'top',
//     position: { x: 200, y: 200 },
//     data: { label: 'node 3' },
//   },
// ];

// const initialEdges = [
//   { id: 'edge-1', source: 'node-1', target: 'node-2', sourceHandle: 'a' },
//   { id: 'edge-2', source: 'node-1', target: 'node-3', sourceHandle: 'b' },
// ];


// const styles = {
//   container: {
//     height: 'calc(100vh - 5rem)',
//     width: '100%',
//     position: 'relative'
//   },
//   addButton: {
//     padding : '10px',
//     position: "relative",
//     zIndex: 10,
//   },
//   tableNode: {
//     padding: "1rem",
//     minWidth: "200px",
//   },
//   columnContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   columnItem: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "14px",
//   },
//   primaryKey: {
//     color: "#2196f3",
//     fontSize: "12px",
//   },
//   columnForm: {
//     display: "flex",
//     gap: "8px",
//     alignItems: "center",
//     marginBottom: "8px",
//   },
//   typeSelect: {
//     minWidth: "120px",
//   },
//   handle: {
//     width: "8px",
//     height: "8px",
//     background: "#555",
//   },
// };


// // we define the nodeTypes outside of the component to prevent re-renderings
// // you could also use useMemo inside the component
// const nodeTypes = { textUpdater: TextUpdaterNode, tabletreenode  : Tabletreenode };

// function Flow() {
//   const [nodes, setNodes] = useState(initialNodes);
//   const [edges, setEdges] = useState(initialEdges);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [currentTable, setCurrentTable] = useState({
//     tableName: "",
//     columns: [],
//   });

//   const handleAddTable = () => {
//     setCurrentTable({ tableName: "Table Name", columns: [] });
//     const newNode = {
//       id: Date.now().toString(),
//       type: "tabletreenode",
//       position: { x: Math.random() * 500, y: Math.random() * 300 },
//       data: { tableName: "Table Name", columns: [] },
//     };
//       setNodes((prev) => [...prev, newNode]);
//     setIsDialogOpen(true);
//   };


//   const onNodesChange = useCallback(
//     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     [setNodes],
//   );
//   const onEdgesChange = useCallback(
//     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     [setEdges],
//   );
//   const onConnect = useCallback(
//     (connection) => setEdges((eds) => addEdge(connection, eds)),
//     [setEdges],
//   );

//   return (
//     <Box sx={styles.container}>

//     <Box sx={styles.addButton}>
//       <Button
//         variant="text"
//         startIcon={<AddIcon />}
//         onClick={handleAddTable}
//       >
//         Add Table
//       </Button>
//     </Box>
//     <ReactFlow
//       nodes={nodes}
//       edges={edges}
//       onNodesChange={onNodesChange}
//       onEdgesChange={onEdgesChange}
//       onConnect={onConnect}
//       nodeTypes={nodeTypes}
//       fitView
//       style={rfStyle}
//     />
//     </Box>
//   );
// }

// export default Flow;


import React from 'react'
import TableDesigner from './TableDesigner'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Compoanents from './Components'

const App = () => {
  return (
    // Routes
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TableDesigner />} />
        <Route path="/ui-components" element={<Compoanents />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
