import React, { useState, useRef } from "react";
import axiosInstance from "../../api/axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import { BounceLoader } from "react-spinners";
import "./Set-upTable.css";
import { CSVLink } from "react-csv";

const SetupTable = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [updatedRows, setUpdatedRows] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [getLeCode, setLeCode] = useState(null);
  const [getSeq, setSeq] = useState(1);
  const leCodeRef = useRef(null);
  const [showCheckboxGrid, setShowCheckboxGrid] = useState(false);

  const handleSubmit = async () => {
    const leCode = leCodeRef.current.value;
    if (!leCode) {
      toast.error("Please enter LE Code.", {
        className: "custom-toast",
      });
      return;
    }

    setLoading(true);
    const storedProcedureUrl = "/common-utils/call-stored-procedure";
    try {
      const response = await axiosInstance.post(storedProcedureUrl, {
        procedure: "set_product_params",
        data: {
          data1: {
            le_code: leCode,
            seq: 1,
            get_put: 0,
          },
          data2: {},
        },
      });
      const responseData = response.data?.data?.data;
      setLeCode(response?.data?.data?.data[0]?.data1[0]?.le_code);
      setSeq(response?.data?.data?.data[0]?.data1[0]?.seq + 1);
      console.log(response?.data?.data?.data[0]?.data1[0]?.seq + 1);

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
      }
      setLoading(false);
      setShowForm(false); // Hide the input and submit button
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message, {
        className: "custom-toast",
      });
    }
    leCodeRef.current.value = "";
  };

  const handleProcessRowUpdate = (newRow) => {
    setUpdatedRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  };

  const handleBack = () => {};

  const handleNext = async () => {
    const isValid = updatedRows.every((row) =>
      Object.values(row).every((value) => value !== null && value !== "")
    );
    if (!isValid) {
      toast.error("Please fill out all fields before submitting.", {
        className: "custom-toast",
      });
      return;
    }
    const storedProcedureUrl = "/common-utils/call-stored-procedure";
    try {
      const response = await axiosInstance.post(storedProcedureUrl, {
        procedure: "set_product_params",
        data: {
          data1: {
            le_code: getLeCode,
            seq: getSeq,
            get_put: 0,
          },
          data2: updatedRows,
        },
      });
      const responseData = response.data?.data?.data;
      if (responseData && responseData.length > 1 && responseData[1].data2) {
        const data2 = responseData[1].data2;
        const data1 = responseData[0].data1[0]?.usechkbox;

        if (data1 === 1) {
          const cols = [
            {
              field: "Lang_Desc",
              headerName: "Language",
              width: 150,
              editable: true,
            },
          ];
          setColumns(cols);
          setShowCheckboxGrid(true)
        } else {
          setShowCheckboxGrid(false)
          const cols = Object.keys(data2[0]).map((key) => ({
            field: key,
            headerName: key,
            width: 150,
            editable: true,
          }));
          setColumns(cols);
        }
        // Prepare rows
        const rowsData = data2.map((item, index) => ({
          id: index,
          ...item,
        }));

        setRows(rowsData);
        setUpdatedRows(rows)
        setSeq(getSeq + 1);
      }
      console.log("Response:", responseData[1].data2);
    } catch (error) {
      toast.error("Failed to save data", {
        className: "custom-toast",
      });
      console.error("Error:", error);
    }
  };
  
  const handleDone = () => {};

  const handleSave = () => {};

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

  const csvData = updatedRows.map(({ id, ...rest }) => {
    return {
      ...rest,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-4xl">Hello 👋 Welcome To Product Set-up</h1>

      {showForm && (
        <div className="flex flex-col items-center space-y-4 mt-8 w-full max-w-xs">
          <input
            type="text"
            ref={leCodeRef}
            placeholder="Enter LE Code"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-500"
            required
          />
          <button
            className="px-4 py-2 text-white bg-black rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}

      {!showForm && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <BounceLoader color="#000" />
            </div>
          ) : (
            <div className="w-full max-w-7xl mt-2">
              <div className="flex items-center mb-2">
                <textarea
                  placeholder="Paste text here ..."
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <label
                  htmlFor="file-upload"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Tooltip title="Upload File" arrow TransitionComponent={Zoom}>
                    <IconButton component="span">
                      <FileUploadIcon style={{ color: "#000" }} />
                    </IconButton>
                  </Tooltip>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>

                <CSVLink data={csvData} filename="data.csv">
                  <Tooltip
                    title="Download File"
                    arrow
                    TransitionComponent={Zoom}
                  >
                    <IconButton>
                      <FileDownloadIcon style={{ color: "#000" }} />
                    </IconButton>
                  </Tooltip>
                </CSVLink>
              </div>

              <div style={{ height: "64vh", width: "100%" }}>
                {showCheckboxGrid ? (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    density="compact"
                    checkboxSelection
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                  />
                ) : (
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    density="compact"
                    processRowUpdate={handleProcessRowUpdate}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                  />
                )}
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
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 ml-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
                  >
                    Save
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
        </>
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