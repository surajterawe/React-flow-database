import React, { memo, useState } from "react";
import { Handle, Position,  useReactFlow } from "@xyflow/react";
import {
  Box,
  Button,
  ClickAwayListener,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  ListItemIcon,
  ListItemText,
  styled,
  TextField,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import TableViewIcon from "@mui/icons-material/TableView";
import {
  MoreVert,
  Check,
  Close,
  Settings,
  OpenInBrowser,
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TableData from "./TableData";

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .MuiTooltip-arrow`]: {
    color: theme.palette.common.white,
  },
  [`& .MuiTooltip-arrow::before`]: {
    boxShadow: theme.shadows[1],
  },
}));

const NodeContainer = styled(Box)(({ selected }) => ({
  border: `1px solid ${selected ? "#1976d2" : "#eee"}`,
  padding: "10px",
  borderRadius: "5px",
  minWidth: "200px",
  background: "white",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#1976d2",
  },
}));

const Tabletreenode = ({ data, isConnectable, selected, id }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [tableName, setTableName] = useState(data.tableName);

  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipOpen, setToolTipOpen] = useState(false);
  const [isNewTablevalid, setisNewTablevalid] = useState(true);
  const [SnackbarMessage, setSnackbarMessage] = useState("");
  const { getNode, getNodes, setNodes } = useReactFlow();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTooltipClose = () => {
    setToolTipOpen(false);
  };

  const handleTooltipOpen = () => {
    setToolTipOpen(true);
    handleClose();
  };

  const handleCancel = (event) => {
    event.stopPropagation();
    setIsEditing(false);
    handleTooltipClose();
    setTableName(data.tableName);
  };

  const handleSave = (event) => {
    event.stopPropagation();
    setIsEditing(false);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, tableName: tableName } }
          : node
      )
    );
    handleTooltipClose();
  };

  const handleNameChange = (event) => {
    event.stopPropagation();
    const nodes = getNodes();
    if(!event.target.value.trim()){
      setisNewTablevalid(false);
      setSnackbarMessage("Please enter valid Table Name"); 
    }
    else if (
      nodes.some(
        (item) =>
          item.data.id !== id &&
          item.data.tableName.trim() === event.target.value.trim()
      )
    ) {
      setisNewTablevalid(false);
      setSnackbarMessage("Table Name Already Exist");
    } else {
      setisNewTablevalid(true);
      setSnackbarMessage("");
    }
    setTableName(event.target.value);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
    handleClose();
  };

  return (
    <>
      <LightTooltip
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={tooltipOpen}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Box padding={"10px"}>
              <Typography variant="subtitle2">Edit Table</Typography>
              <FormControl error={!isNewTablevalid} variant="standard">
                <Input
                  value={tableName}
                  placeholder="Table Name"
                  sx={{
                    padding: "5px 10px",
                    fontSize: "12px",
                  }}
                  onChange={handleNameChange}
                  inputProps={{ "aria-label": "description" }}
                />
                <FormHelperText id="component-error-text">
                  <Typography fontSize={"10px"} color="error">
                    {SnackbarMessage}
                  </Typography>
                </FormHelperText>
              </FormControl>

              <Input
                placeholder="Description"
                sx={{
                  padding: "5px 10px",
                  fontSize: "12px",
                }}
                rows={3}
                inputProps={{ "aria-label": "description" }}
              />
              <Box
                marginTop={"20px"}
                marginLeft={"auto"}
                display={"flex"}
                justifyContent={"flex-end"}
              >
                <Button
                  sx={{
                    fontSize: "10px",
                  }}
                  disabled={!isNewTablevalid}
                  onClick={handleSave}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  sx={{
                    fontSize: "10px",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </ClickAwayListener>
        }
        arrow
      >
        <NodeContainer selected={selected}>
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
          />
          <Box display="flex" alignItems="center" gap="10px">
            <TableViewIcon />
            {!isEditing ? (
              <Typography
                fontSize="12px"
                // onClick={handleEditToggle}
                sx={{ cursor: "pointer" }}
              >
                {tableName}
              </Typography>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                gap="10px"
                onClick={(e) => e.stopPropagation()}
              >
                <TextField
                  size="small"
                  helperText={
                    <Typography fontSize={"10px"} color="error">
                      {SnackbarMessage}
                    </Typography>
                  }
                  value={tableName}
                  onChange={handleNameChange}
                  autoFocus
                />
                <IconButton disabled={!isNewTablevalid} onClick={handleSave}>
                  <Check />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <Close />
                </IconButton>
              </Box>
            )}
            <IconButton
              onClick={handleClick}
              sx={{
                width: "20px",
                height: "20px",
                marginLeft: "auto",
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem onClick={handleTooltipOpen}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                <ListItemText>Properties</ListItemText>
              </MenuItem>
              <MenuItem onClick={toggleDrawer(true)}>
                <ListItemIcon>
                  <OpenInBrowser fontSize="small" />
                </ListItemIcon>
                <ListItemText>View Data</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
          />
          <Drawer
            sx={{
              "& .MuiDrawer-paper": {
                height: "80vh",
                boxSizing: "border-box",
              },
            }}
            anchor="bottom"
            open={openDrawer}
            onClose={toggleDrawer(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <TableData
              data={data}
              getNode={getNode}
              setNodes={setNodes}
              getNodes={getNodes}
              toggleDrawer={setOpenDrawer}
            />
          </Drawer>
        </NodeContainer>
      </LightTooltip>
    </>
  );
};

export default memo(Tabletreenode);
