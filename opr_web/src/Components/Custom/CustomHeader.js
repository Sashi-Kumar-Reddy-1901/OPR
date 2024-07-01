import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Custom.css";
import axiosInstance from "../../api/axios";
import { resetMethodCall } from "../../Redux-Slices/getEntitySlice";
import { useSelector, useDispatch } from "react-redux";
import CustomOption from "./CustomOption";
import { setTriggerEffect } from "../../Redux-Slices/nonPersistedSlice";

const CustomHeader = ({ selectedLevel }) => {
  const [selects, setSelects] = useState({});
  const [options, setOptions] = useState({});
  const [levelLabels, setLevelLabels] = useState([]);
  const dispatch = useDispatch();
  const shouldCallMethod = useSelector(
    (state) => state.method.shouldCallMethod
  );
  const unitCode = useSelector((state) => state.method.unitCode);
  const triggerEffect = useSelector((state) => state.nonPersisted.triggerEffect);

  useEffect(() => {
    if (shouldCallMethod) {
      dispatch(resetMethodCall());
    }
    if (triggerEffect) {
      dispatch(setTriggerEffect());
    }
    const fetchVisibleEntities = async () => {
      try {
        // Fetch levels data first
        const LevelsResponse = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities_levels",
            incSelf: true,
            incParent: false,
          }
        );
        const levelsData = LevelsResponse.data?.data?.data;
        console.log(levelsData);
        setLevelLabels(levelsData || []);
        // Fetch visible entities data next
        const response = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities",
            unitCode: unitCode,
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
            acc[unitLevel].push({
              value: unit.unitCode,
              label: unit.unitName,
              level: unit.unitLevel,
            });
            return acc;
          }, {});
          setOptions(grouped);
        } else {
          setOptions({});
        }
      } catch (error) {
        console.log("Error fetching config:", error);
      }
    };
    fetchVisibleEntities();
  }, [shouldCallMethod, triggerEffect,dispatch]);

  const handleSelectChange =
    (unitLevel, parentUnitCode) => async (selectedOption) => {
      try {
        setSelects((prevState) => {
          const newSelects = { ...prevState, [unitLevel]: selectedOption };
          // Reset child levels' selected options
          for (
            let level = unitLevel + 1;
            level <= Math.max(...Object.keys(prevState).map(Number));
            level++
          ) {
            delete newSelects[level];
          }
          console.log("Selected Option:", selectedOption);
          console.log("New Selects State:", newSelects);
          console.log("parentunit", parentUnitCode);
          const selectedLevelData = {
            level: unitLevel,
            ucode: selectedOption.value,
            parentucode: parentUnitCode,
          };
          selectedLevel(selectedLevelData);
          console.log("Selected Level:", selectedLevelData);
          return newSelects;
        });

        const unitCode =
          selectedOption.value === "--all--"
            ? parentUnitCode
            : selectedOption.value;

        const response = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities",
            unitCode: unitCode,
            level: 0,
            incSelf: true,
          }
        );

        let childEntities;
        if (response.data?.data?.data.length > 1) {
          childEntities = response.data?.data?.data.slice(1);
        } else {
          childEntities = response.data?.data?.data;
        }

        if (childEntities && childEntities.length > 0) {
          setOptions((prevState) => {
            const newOptions = { ...prevState };

            // Clear existing options for levels present in childEntities
            childEntities.forEach((entity) => {
              const entityLevel = entity.unitLevel;
              console.log("entityLevel", entityLevel);
              if (
                childEntities.length > 1 &&
                (!newOptions[entityLevel] || newOptions[entityLevel].length > 0)
              ) {
                newOptions[entityLevel] = []; // Clear the array for this level
              }
            });

            // Clear options for levels greater than the highest level in childEntities
            const maxChildLevel = Math.max(
              ...childEntities.map((e) => e.unitLevel)
            );
            for (
              let level = maxChildLevel + 1;
              level <= Math.max(...Object.keys(prevState).map(Number));
              level++
            ) {
              if (newOptions[level]) {
                delete newOptions[level];
              }
            }

            // Populate newOptions with childEntities only if childEntities.length > 1
            if (childEntities.length > 1) {
              childEntities.forEach((entity) => {
                const entityLevel = entity.unitLevel;

                if (entityLevel) {
                  newOptions[entityLevel].push({
                    value: entity.unitCode,
                    label: entity.unitName,
                  });
                }
              });
            }

            console.log("Updated options with child entities:", newOptions);
            return newOptions;
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "25px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "25px",
    }),
  };

  return (
    <div className="select-container">
      {levelLabels.length === 0 ? (
        <div style={{ color: "white", textAlign: "center" }}>Loading ...</div>
      ) : (
        levelLabels.map((level) => {
          const isHeadOffice = level.Unit_Level === 1;
          const levelOptions = options[level.Unit_Level]
            ? [...options[level.Unit_Level]]
            : [];

          if (
            !isHeadOffice &&
            // levelOptions.length > 1 &&
            !levelOptions.some((option) => option.value === "--all--")
          ) {
            levelOptions.unshift({ value: "--all--", label: "-- All --" });
          }
          const parentUnitCode =
            selects[level.Unit_Level - 1]?.value || unitCode;
          return (
            <div className="select-wrapper" key={level.Unit_Level}>
              <label className="select-label">{level.Level_Desc}</label>
              <Select
                value={selects[level.Unit_Level] || null}
                onChange={handleSelectChange(level.Unit_Level, parentUnitCode)}
                options={levelOptions}
                placeholder="Select"
                className="custom-select-container"
                classNamePrefix="custom-select"
                components={{ Option: CustomOption }}
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
