import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import { BounceLoader } from "react-spinners";
import "./Set-upTable.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const SetupTable = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);

  useEffect(() => {
    const fetchStoredProcedure = async () => {
      const storedProcedureUrl = "/common-utils/call-stored-procedure";
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.post(
          storedProcedureUrl,
          {
            procedure: "set_product_params",
            data: {
              le_code: 77,
              seq: 1,
              get_put: 0,
              data: {},
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response.data?.data?.data;
        console.log(responseData);

        if (responseData && responseData.length > 1 && responseData[1].data2) {
          const data2 = responseData[1].data2;

          // Prepare columns
          const cols = Object.keys(data2[0]).map((key) => ({
            field: key,
            headerName: key,
            width: 150,
            editable: true, // Enable editing
          }));

          // Prepare rows
          const rowsData = data2.map((item, index) => ({
            id: index,
            ...item,
          }));

          setColumns(cols);
          setRows(rowsData);
          setUpdatedRows(rowsData); // Initialize updated rows
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.response?.data?.message, {
          style: {
            background: "black",
            color: "white",
          },
        });
        console.error("Error:", error);
      }
    };
    fetchStoredProcedure();
  }, []);

  // Function to add empty row
  const addEmptyRow = () => {
    const newRow = {
      id: rows.length,
    };
    setRows([...rows, newRow]);
    setUpdatedRows([...updatedRows, newRow]);
  };

  const handleProcessRowUpdate = (newRow) => {
    setUpdatedRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  };

  const handleNext = () => {};

  const handleBack = () => {};

  const handleDone = async () => {
    const storedProcedureUrl = "/common-utils/call-stored-procedure";
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        storedProcedureUrl,
        {
          procedure: "set_product_params",
          data: {
            le_code: 77,
            seq: 1,
            get_put: 1, // Assuming 1 is for put/update operation
            data: updatedRows,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Data saved successfully 👍", {
        style: {
          background: "black",
          color: "white",
        },
      });
      console.log("Response:", response.data);
    } catch (error) {
      toast.error("Failed to save data", {
        style: {
          background: "black",
          color: "white",
        },
      });
      console.error("Error:", error);
    }
  };

  const handleFileUpload = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.warn("Please upload a valid CSV file.", {
          className: "custom-toast",
        });
      } else {
        toast.success("File uploaded successfully.", {
          className: "custom-toast",
        });
        console.log("File uploaded:", file);
        fileInput.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl">Hello 👋 Welcome To Product Set-up</h1>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <BounceLoader color="#000" />
        </div>
      ) : (
        <div className="w-full max-w-6xl mt-2">
          <div className="flex items-center mb-2">
            <input
              type="text"
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
            <Tooltip title="Add" arrow TransitionComponent={Zoom}>
              <IconButton onClick={addEmptyRow}>
                <AddCircleOutlineIcon style={{ color: "#000" }} />
              </IconButton>
            </Tooltip>
            
            <label htmlFor="file-upload">
              <Tooltip title="Upload File" arrow TransitionComponent={Zoom}>
                <IconButton>
                  <FileUploadIcon style={{ color: "#000" }} />
                </IconButton>
              </Tooltip>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            <Tooltip title="Download File" arrow TransitionComponent={Zoom}>
              <IconButton>
                <FileDownloadIcon style={{ color: "#000" }} />
              </IconButton>
            </Tooltip>
          </div>

          <div style={{ height: "68vh", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              processRowUpdate={handleProcessRowUpdate}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </div>

          <div className="flex justify-between mt-4">
            <div>
              <button
                onClick={handleBack}
                className="px-4 py-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 ml-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
              >
                Next
              </button>
            </div>
            <div>
              <button
                onClick={handleDone}
                className="px-4 py-2 text-white bg-black rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SetupTable;
