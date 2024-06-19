import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Custom.css";
import axiosInstance from "../../api/axios";

const CustomHeader = () => {
  const [selectHo, setSelectHo] = useState(null);
  const [selectRo, setSelectRo] = useState(null);
  const [selectBank, setSelectBank] = useState(null);
  const [selectBranch, setSelectBranch] = useState(null);
  
  const [hoOption, setHoOption] = useState([]);
  const [roOptions, setRoOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  useEffect(() => {
    const fetchVisibleEntities = async () => {
      try {
        const response = await axiosInstance.post("/common-utils/call-stored-procedure", {
          "procedure": "get_visible_entities",
          "level": 0,
          "incSelf": true
        });
        const data = response.data?.data?.data;
        if (data) {
          const grouped = data.reduce((acc, unit) => {
            const { unitLevel } = unit;
            if (!acc[unitLevel]) {
              acc[unitLevel] = [];
            }
            acc[unitLevel].push({ value: unit.unitCode, label: unit.unitName });
            return acc;
          }, {});
          setHoOption(grouped[1] || []);
          setRoOptions(grouped[2] || []);
          setBankOptions(grouped[3] || []);
          setBranchOptions(grouped[4] || []);
        }
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
          value={selectHo}
          onChange={setSelectHo}
          options={hoOption}
          placeholder="Select HO"
          className="custom-select-container"
          classNamePrefix="custom-select"
        />
      </div>
      <div className="select-wrapper">
        <label className="select-label">Regional Office</label>
        <Select
          value={selectRo}
          onChange={setSelectRo}
          options={roOptions}
          placeholder="Select RO"
          className="custom-select-container"
          classNamePrefix="custom-select"
        />
      </div>
      <div className="select-wrapper">
        <label className="select-label">Banks</label>
        <Select
          value={selectBank}
          onChange={setSelectBank}
          options={bankOptions}
          placeholder="Select Bank"
          className="custom-select-container"
          classNamePrefix="custom-select"
        />
      </div>
      <div className="select-wrapper">
        <label className="select-label">Branches</label>
        <Select
          value={selectBranch}
          onChange={setSelectBranch}
          options={branchOptions}
          placeholder="Select Branch"
          className="custom-select-container"
          classNamePrefix="custom-select"
        />
      </div>
    </div>
  );
};

export default CustomHeader;
