import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Custom.css";
import axiosInstance from "../../api/axios";
import { resetMethodCall } from "../../Redux-Slices/getEntitySlice";
import { useSelector, useDispatch } from "react-redux";

const CustomHeader = () => {
  const [selects, setSelects] = useState({});
  const [options, setOptions] = useState({});
  const [levelLabels, setLevelLabels] = useState([]);
  const dispatch = useDispatch();
  const shouldCallMethod = useSelector(
    (state) => state.method.shouldCallMethod
  );

  useEffect(() => {
    if (shouldCallMethod) {
      dispatch(resetMethodCall());
    }
    const fetchVisibleEntities = async () => {
      try {
        const response = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities",
            level: 0,
            incSelf: true,
          }
        );
        const data = response.data?.data?.data;
        console.log(data);
        if (data) {
          const grouped = data.reduce((acc, unit) => {
            const { unitLevel } = unit;
            if (!acc[unitLevel]) {
              acc[unitLevel] = [];
            }
            acc[unitLevel].push({ value: unit.unitCode, label: unit.unitName });
            return acc;
          }, {});
          setOptions(grouped);
        }

        const LevelsResponse = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities_levels",
            incSelf: true,
            incParent: true,
          }
        );
        const levelsData = LevelsResponse.data?.data?.data;
        console.log(levelsData);
        setLevelLabels(levelsData);
      } catch (error) {
        console.log("Error fetching config:", error);
      }
    };
    fetchVisibleEntities();
  }, [shouldCallMethod]);

  const handleSelectChange = (unitLevel) => (selectedOption) => {
    setSelects((prevState) => ({ ...prevState, [unitLevel]: selectedOption }));
  };

  return (
    <div className="select-container">
    {levelLabels.map((level) => {
      const isHeadOffice = level.Unit_Level === 1;
      const levelOptions = options[level.Unit_Level] || [];

      if (!isHeadOffice && levelOptions.length > 1) {
        levelOptions.unshift({ value: "all", label: "-- All --" });
      }

      return (
        <div className="select-wrapper" key={level.Unit_Level}>
          <label className="select-label">{level.Level_Desc}</label>
          <Select
            value={selects[level.Unit_Level] || null}
            onChange={handleSelectChange(level.Unit_Level)}
            options={levelOptions}
            placeholder="Select"
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
      );
    })}
  </div>
  );
};

export default CustomHeader;
