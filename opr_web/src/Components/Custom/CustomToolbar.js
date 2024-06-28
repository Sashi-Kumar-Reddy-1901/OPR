import React, { useState, useEffect } from "react";
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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import "./Custom.css";
import { useDispatch, useSelector } from "react-redux";
import { clearRowData } from "../../Redux-Slices/nonPersistedSlice";

const CustomToolbar = ({ onSearchChange }) => {
  const [labels, setLabels] = useState({});
  const [entitlementsList, setEntitlementsList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.nonPersisted.rowData);

  const handleSearchChange = (event) => {
    onSearchChange(event.target.value);
  };

  const AddEntity = () => {
    navigate("/dashboard/entity-details?Add");
  };
  const ViewEntity = () => {
    navigate("/dashboard/entity-details?View");
  };
  const EditEntity = () => {
    navigate("/dashboard/entity-details?Edit");
  };

  useEffect(() => {
    const labels = JSON.parse(sessionStorage.getItem("Labels")) || {};
    setLabels(labels);

    const labelCode = sessionStorage.getItem("labelCode");
    const entitlements = JSON.parse(sessionStorage.getItem("Entitlements"));
    if (entitlements) {
      const selectedEntitlement = entitlements.find(
        (item) => item.labelCode === labelCode
      );

      if (selectedEntitlement) {
        const functionIds = selectedEntitlement?.entitlementsList.map(
          (value) => value.functionId
        );
        setEntitlementsList(functionIds);
      }
    }
    dispatch(clearRowData())
  }, [dispatch]);

  return (
    <GridToolbarContainer
      sx={{
        color: "black",
        "& .MuiButtonBase-root": { color: "black" },
        display: "flex",
        alignItems: "center",
        width: "100%",
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

        {entitlementsList.includes(11) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton onClick={ViewEntity} color="inherit" aria-label="view">
            <Tooltip title={labels?.LX6} arrow TransitionComponent={Zoom}>
              <VisibilityIcon />
            </Tooltip>
          </IconButton>
        )}

        {entitlementsList.includes(21) && (
          <IconButton onClick={AddEntity} color="inherit" aria-label="add">
            <Tooltip title={labels?.LX5} arrow TransitionComponent={Zoom}>
              <PersonAddAlt1Icon />
            </Tooltip>
          </IconButton>
        )}

        {entitlementsList.includes(31) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton onClick={EditEntity} color="inherit" aria-label="edit">
            <Tooltip title={labels?.LX9} arrow TransitionComponent={Zoom}>
              <EditNoteIcon />
            </Tooltip>
          </IconButton>
        )}

        {entitlementsList.includes(41) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton color="inherit" aria-label="authorise">
            <Tooltip title={labels?.LX8} arrow TransitionComponent={Zoom}>
              <GppGoodIcon />
            </Tooltip>
          </IconButton>
        )}

        {entitlementsList.includes(51) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton color="inherit" aria-label="delete">
            <Tooltip title={labels?.LX7} arrow TransitionComponent={Zoom}>
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        )}

        {entitlementsList.includes(61) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton color="inherit" aria-label="upload">
            <Tooltip title={labels?.LX11} arrow TransitionComponent={Zoom}>
              <FileUploadIcon />
            </Tooltip>
          </IconButton>
        )}

        {entitlementsList.includes(71) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton color="inherit" aria-label="download">
            <Tooltip title={labels?.LX10} arrow TransitionComponent={Zoom}>
              <FileDownloadIcon />
            </Tooltip>
          </IconButton>
        )}
      </div>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
