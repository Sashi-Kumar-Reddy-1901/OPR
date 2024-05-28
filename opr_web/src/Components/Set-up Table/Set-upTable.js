import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from "react-toastify";
import { Tooltip, Zoom } from "@mui/material";
import { BounceLoader } from "react-spinners";
import "./Set-upTable.css";

const SetupTable = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoredProcedure = async () => {
      const storedProcedureUrl = "/common-utils/call-stored-procedure";
      const token = sessionStorage.getItem("token");
      try {
        const response = await axios.post(
          storedProcedureUrl,
          {
            procedure: "set_product_params",
            param1: "user5",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data?.data?.data);
        setData(response.data?.data?.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error, {
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

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDone = () => {
    console.log("Done button clicked");
  };

  const handleFileUpload = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.warn("Please upload a valid CSV file.", {
          style: {
            background: "black",
            color: "white",
          },
        });
      } else {
        toast.success("File uploaded successfully.", {
          style: {
            background: "black",
            color: "white",
          },
        });
        console.log("File uploaded:", file);
        fileInput.value = "";
      }
    }
  };

  let columns = [];
  if (data.length > 0) {
    const currentData = data[currentIndex];
    for (let i = 1; i <= currentData.col_count; i++) {
      columns.push({
        field: `Column ${i}`,
        headerName: `Column ${i}`,
        width: 150,
      });
    }
  }

  const csvData = data.map((item) => {
    return {
      ...item,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <BounceLoader color="#000" />
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={data[currentIndex]?.details}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
            <CSVLink data={csvData} filename="data.csv" className="ml-2">
              <Tooltip title="Download File" arrow TransitionComponent={Zoom}>
                <FileDownloadIcon className="cursor-pointer" />
              </Tooltip>
            </CSVLink>
            <label htmlFor="file-upload" className="ml-2 cursor-pointer">
              <Tooltip title="Upload File" arrow TransitionComponent={Zoom}>
                <FileUploadIcon />
              </Tooltip>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <textarea
              placeholder="Paste text here ..."
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ height: "65vh", width: "100%" }}>
            <DataGrid
              rows={[]}
              columns={columns}
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
                disabled={currentIndex === 0}
                className="px-4 py-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === data.length - 1}
                className="px-4 py-2 ml-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
              >
                Next
              </button>
            </div>
            <div>
              {currentIndex === data.length - 1 && (
                <button
                  onClick={handleDone}
                  className="px-4 py-2 text-white bg-black rounded"
                >
                  Done
                </button>
              )}
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
