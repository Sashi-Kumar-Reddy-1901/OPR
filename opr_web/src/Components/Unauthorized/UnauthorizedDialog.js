import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const UnauthorizedDialog = ({ isOpen, errorMessage, onClose }) => {
  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: {
          maxWidth: "350px",
          width: "100%",
          maxHeight: "165px",
          height: "100%",
          borderRadius: "10px",
        },
      }}
    >
      <DialogTitle sx={{textAlign:"center"}}>
        <span className="text-red-500 text-xl">Warning !</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center", fontSize: "14px"}}>
          <span className="text-black">{errorMessage}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", mb: 1 }}>
        <button
          type="button"
          onClick={onClose}
          className="bg-black text-gray-100 text-xs rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
        >
          Ok
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default UnauthorizedDialog;
