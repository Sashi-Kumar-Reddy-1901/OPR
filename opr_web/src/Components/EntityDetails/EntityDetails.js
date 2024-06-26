import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import "./EntityDetails.css";
import axiosInstance from "../../api/axios";
import { resetMethodCall } from "../../Redux-Slices/getEntitySlice";

const EntityDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAdd = queryParams.has("Add");
  const isView = queryParams.has("View");
  const isEdit = queryParams.has("Edit");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [unitLevels, setUnitLevels] = useState([]);
  const [parentUnit, setParentUnit] = useState([]);
  const [unitType, setUnitType] = useState([]);
  const parentUnitRef = useRef(null);

  const getTitle = () => {
    if (isAdd) return "Add Entity";
    if (isView) return "View Entity";
    if (isEdit) return "Edit Entity";
    return "Entity Details";
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const columnHeader = useSelector((state) => state.method.columnHeader);
  const shouldCallMethod = useSelector(
    (state) => state.method.shouldCallMethod
  );
  const unitCode = useSelector((state) => state.method.unitCode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (shouldCallMethod) {
          dispatch(resetMethodCall());
        }
        // Fetch levels data
        const levelsResponse = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_visible_entities_levels",
            incSelf: true,
            incParent: false,
          }
        );
        const levelsData = levelsResponse.data?.data?.data || [];
        const unitLevels = levelsData.slice(1).map((level) => ({
          value: level.Unit_Level,
          label: level.Level_Desc,
        }));
        setUnitLevels(unitLevels);

        // Fetch entity types data
        const entityTypeResponse = await axiosInstance.post(
          "/common-utils/call-stored-procedure",
          {
            procedure: "get_entity_types",
          }
        );
        const entityTypeData = entityTypeResponse.data?.data?.data || [];
        const unitType = entityTypeData.map((eType) => ({
          value: eType.eTypeCode,
          label: eType.eTypeDesc,
        }));
        setUnitType(unitType);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [shouldCallMethod, dispatch]);

  const onSubmit = (data) => {
    const transformedData = {
      ...data,
      ulevel: data.ulevel?.value,
      puc: data.puc?.value,
      entityType: data.entityType?.value,
      entityStatus: data.entityStatus?.value,
    };
    console.log("Submit data:", transformedData);
    onReset();
  };

  const onSave = (data) => {
    const transformedData = {
      ...data,
      ulevel: data.ulevel?.value,
      puc: data.puc?.value,
      entityType: data.entityType?.value,
      entityStatus: data.entityStatus?.value,
    };
    console.log("Save data:", transformedData);
  };

  const onCancel = () => {
    navigate("/dashboard/entity");
  };

  const onDelete = () => {
    console.log("Deleted");
  };

  const onAuthorise = () => {
    console.log("Authorise");
  };

  const onReject = () => {
    console.log("Reject");
  };

  const onReset = () => {
    reset();
    setValue("ulevel", null);
    setValue("puc", null);
    setValue("entityType", null);
    setValue("entityStatus", null);
    setParentUnit([]);
  };

  const handleUnitLevelChange = async (selectedOption, field) => {
    field.onChange(selectedOption);
    console.log("Selected value:", selectedOption);
    if (parentUnitRef.current) {
      parentUnitRef.current.clearValue();
    }
    try {
      const response = await axiosInstance.post(
        "/common-utils/call-stored-procedure",
        {
          procedure: "get_visible_entities",
          unitCode: unitCode,
          level: selectedOption.value - 1,
          incSelf: true,
        }
      );
      console.log(response?.data?.data?.data);
      const parentUnitData = response?.data?.data?.data;
      const parentLevels = parentUnitData.map((data) => ({
        value: data.unitCode,
        label: data.unitName,
      }));
      setParentUnit(parentLevels);
      if (parentLevels.length === 1) {
        setValue("puc", parentLevels[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div className="w-full mt-12">
      <h2 className="text-center text-2xl font-bold">{getTitle()}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="mb-4">
            <label className="form-label">{columnHeader?.ucode}</label>
            <input
              className="form-input"
              {...register("ucode", { required: true })}
              type="text"
              disabled={isView}
              placeholder="Enter"
            />
            {errors.ucode && (
              <p className="text-red-500 text-xs">
                {columnHeader?.ucode} is required
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.ulevel}</label>
            <Controller
              name="ulevel"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    options={unitLevels}
                    isDisabled={isView}
                    className="custom-select-dropdown"
                    classNamePrefix="custom"
                    placeholder="Select"
                    onChange={(selectedOption) =>
                      handleUnitLevelChange(selectedOption, field)
                    }
                  />
                  {errors.ulevel && (
                    <p className="text-red-500 text-xs">
                      {columnHeader?.ulevel} is required
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.puc}</label>
            <Controller
              name="puc"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    ref={parentUnitRef}
                    options={parentUnit}
                    isDisabled={isView}
                    className="custom-select-dropdown"
                    classNamePrefix="custom"
                    placeholder="Select"
                  />
                  {errors.puc && (
                    <p className="text-red-500 text-xs">
                      {columnHeader?.puc} is required
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.entityType}</label>
            <Controller
              name="entityType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    options={unitType}
                    isDisabled={isView}
                    className="custom-select-dropdown"
                    classNamePrefix="custom"
                    placeholder="Select"
                  />
                  {errors.entityType && (
                    <p className="text-red-500 text-xs">
                      {columnHeader?.entityType} is required
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.unitName}</label>
            <input
              className="form-input"
              {...register("unitName", { required: true })}
              type="text"
              disabled={isView}
              placeholder="Enter"
            />
            {errors.unitName && (
              <p className="text-red-500 text-xs">
                {columnHeader?.unitName} is required
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.emailid}</label>
            <input
              type="email"
              className="form-input"
              {...register("emailId", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                required: true,
              })}
              disabled={isView}
              placeholder="Enter"
            />
            {errors.emailId && (
              <p className="text-red-500 text-xs">
                {errors.emailId.message ||
                  `${columnHeader?.emailid} is required`}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.entityStatus}</label>
            <Controller
              name="entityStatus"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    options={options}
                    isDisabled={isView}
                    className="custom-select-dropdown"
                    classNamePrefix="custom"
                    placeholder="Select"
                  />
                  {errors.entityStatus && (
                    <p className="text-red-500 text-xs">
                      {columnHeader?.entityStatus} is required
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>
        {(isAdd || isEdit) && (
          <div className="flex flex-wrap justify-end gap-4 mt-4">
            <button className="custom-button" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button className="custom-button" type="button" onClick={onReset}>
              Reset
            </button>
            <button
              className="custom-button"
              type="button"
              onClick={handleSubmit(onSave)}
            >
              Save
            </button>
            <button className="custom-button" type="submit">
              Submit
            </button>
          </div>
        )}
        {/* <div className="flex flex-wrap justify-end gap-4 mt-4">
          <button className="custom-button" type="button" onClick={onDelete}>
            Delete
          </button>
          <button className="custom-button" type="button"  onClick={onReject}>
            Reject
          </button>
          <button className="custom-button" type="button" onClick={onAuthorise}>
            Authorise
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default EntityDetails;
