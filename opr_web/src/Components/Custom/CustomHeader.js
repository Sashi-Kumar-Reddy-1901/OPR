import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Custom.css";
import axiosInstance from "../../api/axios";
import { resetMethodCall } from "../../Redux-Slices/getEntitySlice";
import { useSelector, useDispatch } from "react-redux";
import CustomOption from "./CustomOption";

const CustomHeader = ({ selectedLevel }) => {
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
        if (data && data.length > 0) {
          const grouped = data.reduce((acc, unit) => {
            const { unitLevel } = unit;
            if (!acc[unitLevel]) {
              acc[unitLevel] = [];
            }
            acc[unitLevel].push({ value: unit.unitCode, label: unit.unitName });
            return acc;
          }, {});
          setOptions(grouped);

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
          setLevelLabels(levelsData || []);
        } else {
          setOptions({});
          setLevelLabels([]);
        }
      } catch (error) {
        console.log("Error fetching config:", error);
      }
    };
    fetchVisibleEntities();
  }, [shouldCallMethod, dispatch]);

  const handleSelectChange = (unitLevel) => async (selectedOption) => {
    try {
      setSelects((prevState) => {
        const newSelects = { ...prevState, [unitLevel]: selectedOption };
        console.log('Selected Option:', selectedOption);
        console.log('New Selects State:', newSelects);
        const selectedLevelData = { level: unitLevel, ucode: selectedOption.value };
        selectedLevel(selectedLevelData);
        console.log('Selected Level:', selectedLevelData);
        return newSelects;
      });
      const childEntities = await axiosInstance.post(`/entity/get_child_entities/${unitLevel}/${selectedOption.value}`);
      console.log(childEntities.data?.data?.data);        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '25px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 6px'
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '25px'
    })
  };

  return (
    <div className="select-container">
      {levelLabels.length === 0 ? (
        <div style={{ color: "white", textAlign: "center" }}>Loading ...</div>
      ) : (
        levelLabels.map((level) => {
          const isHeadOffice = level.Unit_Level === 1;
          const levelOptions = options[level.Unit_Level] ? [...options[level.Unit_Level]] : [];

          if (!isHeadOffice && levelOptions.length > 1 && !levelOptions.some((option) => option.value === "--all--")) {
            levelOptions.unshift({ value: "--all--", label: "-- All --" });
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
                components={{ Option: CustomOption}}
                styles={customStyles}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default CustomHeader;
