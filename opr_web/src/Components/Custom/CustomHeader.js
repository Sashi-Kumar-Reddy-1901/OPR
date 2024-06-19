import React, { useState , useEffect } from "react";
import Select from "react-select";
import "./Custom.css";
import axiosInstance from "../../api/axios";

const CustomHeader = () => {
  const [selectValue1, setSelectValue1] = useState(null);
  const [selectValue2, setSelectValue2] = useState(null);
  const [selectValue3, setSelectValue3] = useState(null);
  const [selectValue4, setSelectValue4] = useState(null);

  const options1 = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];

  useEffect(() => {
    const fetchVisibleEntities = async () => {
      try {
        const response = await axiosInstance.post("/common-utils/call-stored-procedure",{
          "procedure": "get_visible_entities",
          "level": 0,
          "incSelf": true
        });
        console.log(response.data?.data);
      } catch (error) {
        console.log("Error fetching config:", error);
      }
    };
    fetchVisibleEntities();
  }, []);
  

  return (

      <div className="select-container">
        <div className="select-wrapper">
          <label className="select-label">Head Office</label>
          <Select
            value={selectValue1}
            onChange={setSelectValue1}
            options={options1}
            placeholder="Select option 1"
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
        <div className="select-wrapper">
          <label className="select-label">Regional Office</label>
          <Select
            value={selectValue2}
            onChange={setSelectValue2}
            options={options1}
            placeholder="Select option 2"
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
        <div className="select-wrapper">
          <label className="select-label">Banks</label>
          <Select
            value={selectValue3}
            onChange={setSelectValue3}
            options={options1}
            placeholder="Select option 3"
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
        <div className="select-wrapper">
          <label className="select-label">Branches</label>
          <Select
            value={selectValue4}
            onChange={setSelectValue4}
            options={options1}
            placeholder="Select option 4"
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
      </div>

  );
};

export default CustomHeader;
