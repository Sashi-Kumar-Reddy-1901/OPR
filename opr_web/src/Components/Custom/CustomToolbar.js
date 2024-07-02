import React, { useState, useEffect } from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  IconButton, InputBase, Paper, Tooltip, Zoom, Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GppGoodIcon from "@mui/icons-material/GppGood";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import "./Custom.css";
import { useDispatch, useSelector } from "react-redux";
import { clearRowData, setTriggerEffect } from "../../Redux-Slices/nonPersistedSlice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../api/axios";

const CustomToolbar = ({ onSearchChange, iconsVisible, setIconsVisible }) => {
  const [labels, setLabels] = useState({});
  const [entitlementsList, setEntitlementsList] = useState([]);
  const [deleteEntity , setDeleteEntity] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.nonPersisted.rowData);
  const loginUserId = useSelector((state) => state.method.userId)

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
  const authorRejectEntity = () => {
    navigate("/dashboard/entity-details?AuthorReject");
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

  const openDeleteEntity =() =>{
    setDeleteEntity(true)
  }

  const handleNoDelete = () =>{
    setDeleteEntity(false)
  }

  const handleYesDelete = async () => {
    try {
      const deleteEntityResponse = await axiosInstance.post(`/entity/delete_entity/${rowData?.ucode}`)
      if (deleteEntityResponse?.data?.data?.status) {
        toast.success(deleteEntityResponse?.data?.data?.message, {
          className: "custom-toast",
        });
        setDeleteEntity(false)
        setIconsVisible(false)
        dispatch(setTriggerEffect());
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
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

        {iconsVisible && entitlementsList.includes(11) && rowData && Object.keys(rowData).length !== 0 && (
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

        {iconsVisible && entitlementsList.includes(31) && rowData && Object.keys(rowData).length !== 0 && rowData.statusCode !== 'M' && (
          <IconButton onClick={EditEntity} color="inherit" aria-label="edit">
            <Tooltip title={labels?.LX9} arrow TransitionComponent={Zoom}>
              <EditNoteIcon />
            </Tooltip>
          </IconButton>
        )}

        {iconsVisible && entitlementsList.includes(41) && rowData && (rowData.statusCode === 'U' || rowData.statusCode === 'M') && loginUserId !== rowData?.maker && (
          <IconButton onClick={authorRejectEntity} color="inherit" aria-label="authorise">
            <Tooltip title={labels?.LX8} arrow TransitionComponent={Zoom}>
              <GppGoodIcon />
            </Tooltip>
          </IconButton>
        )}

        {iconsVisible && entitlementsList.includes(51) && rowData && rowData.statusCode === 'R' &&(
          <IconButton color="inherit" aria-label="delete" onClick={openDeleteEntity}>
            <Tooltip title={labels?.LX7} arrow TransitionComponent={Zoom}>
              <DeleteIcon />
            </Tooltip>
          </IconButton>
        )}

        {iconsVisible && entitlementsList.includes(61) && rowData && Object.keys(rowData).length !== 0 && (
          <IconButton color="inherit" aria-label="upload">
            <Tooltip title={labels?.LX11} arrow TransitionComponent={Zoom}>
              <FileUploadIcon />
            </Tooltip>
          </IconButton>
        )}

      </div>
    </GridToolbarContainer>

    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    {/* Delete Entity */}
      <Dialog
        open={deleteEntity}
        PaperProps={{
          sx: {
            maxWidth: "300px",
            width: "100%",
            maxHeight: "170px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: "36px" }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "14px" }}>
            <span className="text-black">Are you sure you want to delete?</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-evenly", mb: 1 }}>
          <button
            type="button"
            onClick={handleYesDelete}
            className="custom-button"
             >
            Yes
          </button>
          <button
            type="button"
            onClick={handleNoDelete}
            className="custom-button"
          >
            No
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomToolbar;
