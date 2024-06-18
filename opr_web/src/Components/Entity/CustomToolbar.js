import React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { IconButton, InputBase, Paper, Tooltip, Zoom } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GppGoodIcon from "@mui/icons-material/GppGood";
import { useNavigate } from "react-router-dom";

const CustomToolbar = ({ onSearchChange }) => {
  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
  };
  const navigate = useNavigate();
const AddEntity = () =>{
  navigate("/dashboard/entity-details");
}

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <GridToolbarContainer
        sx={{ color: "black", "& .MuiButtonBase-root": { color: "black" } }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
          }}
        />
      </GridToolbarContainer>

      <h1
        style={{
          flex: 1,
          textAlign: "center",
          margin: "0 auto",
          fontSize: "22px",
          fontWeight: "900",
        }}
      >
        Legal Entity
      </h1>

      <div
        style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
      >
        <Paper
          component="form"
          sx={{
            p: "0px 4px",
            display: "flex",
            alignItems: "center",
            width: 180,
            border: "1px solid grey",
            height:"30px"
          }}
        >
          <SearchIcon />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search..."
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchChange}
          />
        </Paper>
        <IconButton  onClick={AddEntity} color="inherit" aria-label="add">
          <Tooltip title="Add Entity" arrow TransitionComponent={Zoom}>
            <PersonAddAlt1Icon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" aria-label="view">
          <Tooltip title="View Entity" arrow TransitionComponent={Zoom}>
            <VisibilityIcon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" aria-label="edit">
          <Tooltip title="Edit Entity" arrow TransitionComponent={Zoom}>
            <EditNoteIcon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" aria-label="authorise">
          <Tooltip title="Authorise Entity" arrow TransitionComponent={Zoom}>
            <GppGoodIcon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" aria-label="delete">
          <Tooltip title="Delete Entity" arrow TransitionComponent={Zoom}>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

export default CustomToolbar;