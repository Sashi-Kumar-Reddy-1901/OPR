import React,  { useState, useEffect } from "react";
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
import "./Custom.css";

const CustomToolbar = ({ onSearchChange }) => {
  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
  };
  const navigate = useNavigate();
  const AddEntity = () => {
    navigate("/dashboard/entity-details?Add");
  };
  const ViewEntity = () => {
    navigate("/dashboard/entity-details?View");
  };
  const EditEntity = () => {
    navigate("/dashboard/entity-details?Edit");
  };

  const [labels, setLabel] = useState();

  useEffect(()=>{
    const label = JSON.parse(sessionStorage.getItem("Labels"));
    console.log(label);
    setLabel(label);
  },[]);

  return (
    <GridToolbarContainer
      sx={{
        color: "black",
        "& .MuiButtonBase-root": { color: "black" },
        display: "flex",
        alignItems: "center",
        width: "100%"
      }}
    >
      <GridToolbarColumnsButton />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: "Export data" },
        }}
      />

      <h1
        style={{
          flex: 1,
          textAlign: "center",
          margin: "0 auto",
          fontSize: "22px",
          fontWeight: "900",
        }}
      >
        {labels?.LX1}
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
            height: "25px",
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
        <IconButton onClick={AddEntity} color="inherit" aria-label="add">
          <Tooltip title={labels?.LX5} arrow TransitionComponent={Zoom}>
            <PersonAddAlt1Icon />
          </Tooltip>
        </IconButton>
        <IconButton onClick={ViewEntity} color="inherit" aria-label="view">
          <Tooltip title={labels?.LX6} arrow TransitionComponent={Zoom}>
            <VisibilityIcon />
          </Tooltip>
        </IconButton>
        <IconButton onClick={EditEntity} color="inherit" aria-label="edit">
          <Tooltip title={labels?.LX9} arrow TransitionComponent={Zoom}>
            <EditNoteIcon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" aria-label="authorise">
          <Tooltip title={labels?.LX8} arrow TransitionComponent={Zoom}>
            <GppGoodIcon />
          </Tooltip>
        </IconButton>
        <IconButton color="inherit" aria-label="delete">
          <Tooltip title={labels?.LX7} arrow TransitionComponent={Zoom}>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </div>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
