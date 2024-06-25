import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import "./EntityDetails.css";

const EntityDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isAdd = queryParams.has("Add");
  const isView = queryParams.has("View");
  const isEdit = queryParams.has("Edit");

  const getTitle = () => {
    if (isAdd) return "Add Entity";
    if (isView) return "View Entity";
    if (isEdit) return "Edit Entity";
    return "Entity Details";
  };

  const { register, handleSubmit, control, reset } = useForm();
  const columnHeader = useSelector((state) => state.method.columnHeader);
  const rowData = useSelector((state) => state.method.rowData);

  console.log(columnHeader);
  console.log(rowData);

  const onSubmit = (data) => {
    console.log("Submit data:", data);
  };

  const onSave = (data) => {
    console.log("Save data:", data);
  };

  const onCancel = () => {
    console.log("Cancelled");
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
  };

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <div className="w-full mt-12">
      <h2 className="text-center text-2xl font-bold">{getTitle()}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="form-label">{columnHeader?.ucode}</label>
            <input
              className="form-input"
              {...register("input3")}
              type="text"
              disabled={isView}
              placeholder="Enter Unit Code"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.ulevel}</label>
            <Controller
              name="ulevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  isDisabled={isView}
                  className="custom-select-dropdown"
                  classNamePrefix="custom"
                  placeholder="Select Unit Level"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.puc}</label>
            <Controller
              name="ulevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  isDisabled={isView}
                  className="custom-select-dropdown"
                  classNamePrefix="custom"
                  placeholder="Select Parent Unit Code"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.unitName}</label>
            <input
              className="form-input"
              {...register("input1")}
              type="text"
              disabled={isView}
              placeholder="Enter Unit Name"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.emailid}</label>
            <input
              className="form-input"
              {...register("input1")}
              type="text"
              disabled={isView}
              placeholder="Enter Email Id"
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.entityType}</label>
            <Controller
              name="ulevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  isDisabled={isView}
                  className="custom-select-dropdown"
                  classNamePrefix="custom"
                  placeholder="Select Unit Type"
                />
              )}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">{columnHeader?.entityStatus}</label>
            <Controller
              name="ulevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  isDisabled={isView}
                  className="custom-select-dropdown"
                  classNamePrefix="custom"
                  placeholder="Select Entity Status"
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <button type="button" className="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="button" onClick={onReset}>
            Reset
          </button>
          <button type="button" className="button" onClick={handleSubmit(onSave)}>
            Save
          </button>
          <button type="submit" className="button">
            Submit
          </button>
          <button type="button" className="button" onClick={onDelete}>
            Delete
          </button>
          <button type="button" className="button" onClick={onReject}>
            Reject
          </button>
          <button type="button" className="button" onClick={onAuthorise}>
           Authorise
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntityDetails;
