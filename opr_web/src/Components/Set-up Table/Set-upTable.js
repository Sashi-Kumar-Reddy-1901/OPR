// import React, { useState, useRef } from "react";
// import axiosInstance from "../../api/axios";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
// import { DataGrid } from "@mui/x-data-grid";
// import { ToastContainer, toast } from "react-toastify";
// import { IconButton, Tooltip, Zoom } from "@mui/material";
// import { BounceLoader } from "react-spinners";
// import "./Set-upTable.css";
// import { CSVLink } from "react-csv";

// const SetupTable = () => {
//   const [loading, setLoading] = useState(false);
//   const [rows, setRows] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [updatedRows, setUpdatedRows] = useState([]);
//   const [showForm, setShowForm] = useState(true);
//   const [getLeCode, setLeCode] = useState(null);
//   const [getSeq, setSeq] = useState(1);
//   const leCodeRef = useRef(null);
//   const [langRows, setLangRows] = useState([]);
//   const [langColumns, setLangColumns] = useState([]);
//   const [showLangGrid, setShowLangGrid] = useState(false);
//   // const [selectedRows, setSelectedRows] = useState([]);

//   const handleSubmit = async () => {
//     const leCode = leCodeRef.current.value;
//     if (!leCode) {
//       toast.error("Please enter LE Code.", {
//         className: "custom-toast",
//       });
//       return;
//     }
//     setLoading(true);
//     const storedProcedureUrl = "/common-utils/call-stored-procedure";
//     try {
//       const response = await axiosInstance.post(storedProcedureUrl, {
//         procedure: "set_product_params",
//         data: {
//           data1: {
//             le_code: leCode,
//             seq: 1,
//             get_put: 0,
//           },
//           data2: {},
//         },
//       });
//       const responseData = response.data?.data?.data;
//       setLeCode(responseData[0]?.data1[0]?.le_code);
//       setSeq(responseData[0]?.data1[0]?.seq);

//       if (responseData && responseData.length > 1 && responseData[1].data2) {
//         const data2 = responseData[1].data2;
//         // Prepare columns
//         const cols = Object.keys(data2[0]).map((key) => ({
//           field: key,
//           headerName: key,
//           width: 150,
//           editable: true, // Enable editing
//         }));

//         // Prepare rows
//         const rowsData = data2.map((item, index) => ({
//           id: index,
//           ...item,
//         }));

//         setColumns(cols);
//         setRows(rowsData);
//         setUpdatedRows(rowsData);
//       }
//       setLoading(false);
//       setShowForm(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//       toast.error(error?.message, {
//         className: "custom-toast",
//       });
//     }
//     leCodeRef.current.value = "";
//   };

//   const handleProcessRowUpdate = (newRow) => {
//     setUpdatedRows((prevRows) =>
//       prevRows.map((row) => (row.id === newRow.id ? newRow : row))
//     );
//     return newRow;
//   };

//   const handleNext = async () => {
//     setLoading(true);
//     const storedProcedureUrl = "/common-utils/call-stored-procedure";
//     try {
//       const nextSeq = getSeq + 1;
//       const response = await axiosInstance.post(storedProcedureUrl, {
//         procedure: "set_product_params",
//         data: {
//           data1: {
//             le_code: getLeCode,
//             seq: nextSeq,
//             get_put: 0,
//           },
//           data2: {},
//         },
//       });
//       const responseData = response.data?.data?.data;
// if (responseData && responseData.length > 1 && responseData[1].data2) {
//   const data1 = responseData[0].data1[0]?.usechkbox;
//   const data2 = responseData[1].data2;
//   if (data1 === 1) {
//     const filteredData = data2.map((item) => ({
//       Lang_Desc: item.Lang_Desc,
//       Lang_Code: item.Lang_Code,
//       chk_unchk: item.chk_unchk,
//     }));
//     if (filteredData) {
//       const langColsData = [
//         { field: "Lang_Desc", headerName: "Language" },
//       ];
//       const langRowsData = filteredData.map((item, index) => ({
//         id: index,
//         ...item,
//       }));
//       setLangColumns(langColsData);
//       setLangRows(langRowsData);
//     } else {
//       const langColsData = Object.keys(data2[0]).map((key) => ({
//         field: key,
//         headerName: key,
//         width: 150,
//         editable: true,
//       }));
//       const langRowsData = data2.map((item, index) => ({
//         id: index,
//         ...item,
//       }));
//       setLangColumns(langColsData);
//       setLangRows(langRowsData);
//     }
//     setShowLangGrid(true);
//   } else {
//     setShowLangGrid(false);
//     // Prepare columns
//     const cols = Object.keys(data2[0]).map((key) => ({
//       field: key,
//       headerName: key,
//       width: 150,
//       editable: true,
//     }));
//     // Prepare rows
//     const rowsData = data2.map((item, index) => ({
//       id: index,
//       ...item,
//     }));

//     setColumns(cols);
//     setRows(rowsData);
//   }
// }
//       setSeq(nextSeq);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       toast.error("An error occurred while saving data.", {
//         className: "custom-toast",
//       });
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     const storedProcedureUrl = "/common-utils/call-stored-procedure";
//     try {
//       const response = await axiosInstance.post(storedProcedureUrl, {
//         procedure: "set_product_params",
//         data: {
//           data1: {
//             le_code: getLeCode,
//             seq: getSeq,
//             get_put: 1,
//           },
//           data2: updatedRows,
//         },
//       });
//       const responseData = response.data?.data?.data;
//       if (responseData && responseData.length > 1 && responseData[1].data2) {
//         const data2 = responseData[1].data2;
//         console.log(data2);
//         // Prepare columns
//         const cols = Object.keys(data2[0]).map((key) => ({
//           field: key,
//           headerName: key,
//           width: 150,
//           editable: true, // Enable editing
//         }));
//         // Prepare rows
//         const rowsData = data2.map((item, index) => ({
//           id: index,
//           ...item,
//         }));
//         setShowLangGrid(false);
//         setColumns(cols);
//         setRows(rowsData);
//         setUpdatedRows(rowsData);
//         toast.success("Data saved successfully 👍", {
//           className: "custom-toast",
//         });
//       }
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       toast.error("An error occurred while saving data.", {
//         className: "custom-toast",
//       });
//     }
//   };

//   const handleDone = () => {};

//   const handleBack = async () => {
//     setLoading(true);
//     try {
//       const prevSeq = seq - 1;
//       await axiosInstance.post("/common-utils/call-stored-procedure", {
//         procedure: "set_product_params",
//         data: {
//           data1: { le_code: leCode, seq: prevSeq, get_put: 0 },
//           data2: updatedRows,
//         },
//       });
//       setSeq(prevSeq);
//     } catch (error) {
//       toast.error("An error occurred while going back.", {
//         className: "custom-toast",
//       });
//     }
//     setLoading(false);
//   };

//   const handleFileUpload = (event) => {
//     const fileInput = event.target;
//     const file = fileInput.files[0];
//     if (file) {
//       if (file.type !== "text/csv") {
//         toast.warn("Please upload a valid CSV file.", {
//           className: "custom-toast",
//         });
//       } else {
//         toast.success("File uploaded successfully.", {
//           className: "custom-toast",
//         });
//         console.log("File uploaded:", file);
//         fileInput.value = "";
//       }
//     }
//   };

//   const csvData = updatedRows.map(({ id, ...rest }) => {
//     return {
//       ...rest,
//     };
//   });

//   const handleCellClick = (cellData) => {
//     const rowIndex = cellData.row;
//     const isSelected = updatedRows.includes(rowIndex);
//     if (isSelected) {
//       setUpdatedRows(updatedRows.filter((row) => row !== rowIndex));
//     } else {
//       setUpdatedRows([...updatedRows, rowIndex]);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
//       <h1 className="text-4xl">Hello 👋 Welcome To Product Set-up</h1>

//       {showForm && (
//         <div className="flex flex-col items-center space-y-4 mt-8 w-full max-w-xs">
//           <input
//             type="text"
//             ref={leCodeRef}
//             placeholder="Enter LE Code"
//             className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white placeholder-gray-500"
//             required
//           />
//           <button
//             className="px-4 py-2 text-white bg-black rounded"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </div>
//       )}

//       {!showForm && (
//         <>
//           {loading ? (
//             <div className="flex items-center justify-center h-full">
//               <BounceLoader color="#000" />
//             </div>
//           ) : (
//             <div className="w-full max-w-7xl mt-2">
//               <div className="flex items-center mb-2">
//                 <textarea
//                   placeholder="Paste text here ..."
//                   className="w-full p-2 border border-gray-300 rounded"
//                 />

//                 <label
//                   htmlFor="file-upload"
//                   style={{ display: "flex", alignItems: "center" }}
//                 >
//                   <Tooltip title="Upload File" arrow TransitionComponent={Zoom}>
//                     <IconButton component="span">
//                       <FileUploadIcon style={{ color: "#000" }} />
//                     </IconButton>
//                   </Tooltip>
//                   <input
//                     id="file-upload"
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileUpload}
//                     style={{ display: "none" }}
//                   />
//                 </label>

//                 <CSVLink data={csvData} filename="data.csv">
//                   <Tooltip
//                     title="Download File"
//                     arrow
//                     TransitionComponent={Zoom}
//                   >
//                     <IconButton>
//                       <FileDownloadIcon style={{ color: "#000" }} />
//                     </IconButton>
//                   </Tooltip>
//                 </CSVLink>
//               </div>

//               <div style={{ height: "64vh", width: "100%" }}>
//                 {showLangGrid ? (
//                   <DataGrid
//                     rows={langRows}
//                     columns={langColumns}
//                     density="compact"
//                     checkboxSelection
//                     onCellClick={(params) => handleCellClick(params)}
//                     // onColumnHeaderClick={handleHeaderClick}
//                     initialState={{
//                       pagination: {
//                         paginationModel: { page: 0, pageSize: 10 },
//                       },
//                     }}
//                     pageSizeOptions={[10, 25, 50, 100]}
//                   />
//                 ) : (
//                   <DataGrid
//                     rows={rows}
//                     columns={columns}
//                     density="compact"
//                     processRowUpdate={handleProcessRowUpdate}
//                     initialState={{
//                       pagination: {
//                         paginationModel: { page: 0, pageSize: 10 },
//                       },
//                     }}
//                     pageSizeOptions={[10, 25, 50, 100]}
//                   />
//                 )}
//               </div>

//               <div className="flex justify-between mt-4">
//                 <div>
//                   <button
//                     onClick={handleBack}
//                     className="px-4 py-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handleNext}
//                     className="px-4 py-2 ml-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
//                   >
//                     Next
//                   </button>
//                   <button
//                     onClick={handleSave}
//                     className="px-4 py-2 ml-2 text-black bg-white border border-black rounded disabled:bg-gray-200"
//                   >
//                     Save
//                   </button>
//                 </div>
//                 <div>
//                   <button
//                     onClick={handleDone}
//                     className="px-4 py-2 text-white bg-black rounded"
//                   >
//                     Done
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         closeButton
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// };

// export default SetupTable;

import React, { useState, useRef, useEffect } from "react";
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
  const [leCode, setLeCode] = useState(null);
  const [seq, setSeq] = useState(1);
  const leCodeRef = useRef(null);
  const [langRows, setLangRows] = useState([]);
  const [langColumns, setLangColumns] = useState([]);
  const [showLangGrid, setShowLangGrid] = useState(false);
  const [getPut, setGetPut] = useState(0);

  useEffect(() => {
    if (rows.length > 0) {
      setUpdatedRows([]);
    }
  }, [rows]);

  const fetchData = async (leCodeValue, seqValue, getPutValue) => {
    const storedProcedureUrl = "/common-utils/call-stored-procedure";
    try {
      const response = await axiosInstance.post(storedProcedureUrl, {
        procedure: "set_product_params",
        data: {
          data1: {
            le_code: leCodeValue,
            seq: seqValue,
            get_put: getPutValue,
          },
          data2: getPutValue === 1 ? updatedRows : {},
        },
      });
      const responseData = response.data?.data?.data;
      setLeCode(responseData[0]?.data1[0]?.le_code);
      setSeq(responseData[0]?.data1[0]?.seq);
      if (responseData && responseData.length > 1 && responseData[1].data2) {
        const data1 = responseData[0].data1[0]?.usechkbox;
        const data2 = responseData[1].data2;
        if (data1 === 1) {
          const filteredData = data2.map((item) => ({
            Lang_Desc: item.Lang_Desc,
            Lang_Code: item.Lang_Code,
            chk_unchk: item.chk_unchk,
          }));
          if (filteredData) {
            const langColsData = [
              { field: "Lang_Desc", headerName: "Language" },
            ];
            const langRowsData = filteredData.map((item, index) => ({
              id: index,
              ...item,
            }));
            setLangColumns(langColsData);
            setLangRows(langRowsData);
          } else {
            const langColsData = Object.keys(data2[0]).map((key) => ({
              field: key,
              headerName: key,
              width: 150,
              editable: true,
            }));
            const langRowsData = data2.map((item, index) => ({
              id: index,
              ...item,
            }));
            setLangColumns(langColsData);
            setLangRows(langRowsData);
          }
          setShowLangGrid(true);
        } else {
          setShowLangGrid(false);
          // Prepare columns
          const cols = Object.keys(data2[0]).map((key) => ({
            field: key,
            headerName: key,
            width: 150,
            editable: true,
          }));
          // Prepare rows
          const rowsData = data2.map((item, index) => ({
            id: index,
            ...item,
          }));

          setColumns(cols);
          setRows(rowsData);
        }
      }
      setLoading(false);
      setShowForm(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "An error occurred.", {
        className: "custom-toast",
      });
    }
  };

  const handleSubmit = () => {
    const leCodeValue = leCodeRef.current.value;
    if (!leCodeValue) {
      toast.error("Please enter LE Code.", { className: "custom-toast" });
      return;
    }
    setLoading(true);
    fetchData(leCodeValue, 1, 0);
    leCodeRef.current.value = "";
  };

  const handleProcessRowUpdate = (newRow) => {
    setUpdatedRows((prevRows) =>
      prevRows.some((row) => row.id === newRow.id)
        ? prevRows.map((row) => (row.id === newRow.id ? newRow : row))
        : [...prevRows, newRow]
    );
    return newRow;
  };

  const handleSave = async () => {
    setGetPut((prevGetput) => prevGetput + 1);
    setLoading(true);
    await fetchData(leCode, seq, 1);
    setUpdatedRows([]); // Reset updatedRows after saving
  };

  const handleNext = () => {
    setLoading(true);
    fetchData(leCode, seq + 1, 0);
  };

  const handleBack = () => {
    setLoading(true);
    // fetchData(leCode, seq - 1, 0);
    if (getPut === 1) {
      fetchData(leCode, seq, 0);
    setGetPut((prevGetput) => prevGetput - 1);
    } else {
      fetchData(leCode, seq - 1, 0);
    }
  };

  const handleDone = () => {};

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

  const handleCellClick = (cellData) => {
    console.log(cellData);
    const rowIndex = cellData.row;
    const isSelected = updatedRows.includes(rowIndex);
    if (isSelected) {
      setUpdatedRows(updatedRows.filter((row) => row !== rowIndex));
    } else {
      setUpdatedRows([...updatedRows, rowIndex]);
    }
  };

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
                {showLangGrid ? (
                  <DataGrid
                    rows={langRows}
                    columns={langColumns}
                    density="compact"
                    checkboxSelection
                    onCellClick={(params) => handleCellClick(params)}
                    // onColumnHeaderClick={handleHeaderClick}
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