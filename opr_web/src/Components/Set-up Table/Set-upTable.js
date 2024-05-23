import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import { ToastContainer, toast } from 'react-toastify';

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const SetupTable = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      } catch (error) {
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

  const csvData = rows.map((row) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    age: row.age,
  }));

  const handleFileUpload = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.warn("Please upload a valid CSV file.");
      } else {
        toast.success("File uploaded successfully.");
        console.log("File uploaded:", file);
        fileInput.value = "";
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {data.length > 0 ? (
        <div className="w-full max-w-4xl">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={data[currentIndex].details}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
            <CSVLink data={csvData} filename="data.csv" className="ml-2">
              <FileDownloadIcon className="cursor-pointer" />
            </CSVLink>
            <label htmlFor="file-upload" className="ml-2 cursor-pointer">
              <FileUploadIcon />
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <ToastContainer />
          </div>
          <div style={{ height: "60vh", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
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
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default SetupTable;
