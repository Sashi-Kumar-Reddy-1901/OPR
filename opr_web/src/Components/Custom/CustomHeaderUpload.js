import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";

const CustomHeaderUpload = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectOption, setselectOption] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const unitCode = useSelector((state) => state.method.unitCode);

  useEffect(() => {
    const fetchVisibleEntities = async () => {
      try {
        const response = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities_levels",
            incSelf: true,
            incParent: false,
          }
        );

        const r = response.data.data.data;
        const formattedUnits = r.map((unit) => ({
          value: unit.Unit_Level,
          label: unit.Level_Desc,
        }));
        console.log("HeaderResponse", response.data.data.data);
        setselectOption(formattedUnits.slice(1, 2));
      } catch {}
    };
    fetchVisibleEntities();
  }, []);

  const handleBankChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedBank(selectedOption);
  };

  const onFileUpload = async () => {
    setLoading(true);
    setOpen(true);
    console.log(selectOption);
    console.log(selectedFile);
   
    const level = selectOption[0].value;
    const formData = new FormData();
    formData.append("inputFile", selectedFile);

    try {
      const response = await axiosInstance.post(
        `/entityfileupload/upload_file/${unitCode}/${level}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        setLoading(false);
        setOpen(false);
        console.log(response.data.data.message);
        toast.success(response.data.data.message,{
          className:"custom-toast"
        })
      }
      console.log("Response:", response.data);
      // <BounceLoader />
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
   
  };

  const handleUpload = () => {
    onFileUpload();
  };
  return (
    <>
      <div className="select-container">
        <div className="flex">
          <label>Select Bank:</label>
          <Select
            value={selectOption}
            defaultValue={selectedBank}
            onChange={handleBankChange}
            options={selectOption}
            placeholder="Select"
            className="w-64 mt-2"
          />
          <br />

          {/* <form class="max-w-sm">
  <label for="file-input" class="sr-only">Choose file</label>
  <input type="file" onChange={handleFileChange} name="file-input" id="file-input" class="ml-10 mt-1 mb-1 block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
    file:bg-gray-50 file:border-0
    file:me-4
    file:py-3 file:px-4
    dark:file:bg-neutral-700 dark:file:text-neutral-400" />
</form> */}

          <div>
            <input
              onChange={handleFileChange}
              class="ml-10 mt-2 relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-white bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
              type="file"
              id="formFile"
            />
          </div>
          <br />

          {/* <button   onClick={handleUpload} className="ml-20 mt-1 mb-1 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
  Upload
</button> */}
          <button onClick={handleUpload} class="button-30">
            Upload
          </button>
        </div>
      </div>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

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
    </>
  );
};

export default CustomHeaderUpload;
