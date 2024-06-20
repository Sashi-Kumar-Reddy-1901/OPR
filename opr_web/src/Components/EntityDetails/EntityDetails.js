import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import "./EntityDetails.css";
import { useLocation } from "react-router-dom";

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

  const { register, handleSubmit } = useForm();
  const columnHeader = useSelector((state) => state.method.columnHeader);
  const rowData = useSelector((state) => state.method.rowData);

  console.log(columnHeader);
  console.log(rowData);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div style={{ width: "100%", marginTop: "50px" }}>
      <h2 className="text-center text-2xl font-bold">{getTitle()}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="form-label">{columnHeader?.unitName}</label>
          <input
            className="form-input"
            {...register("input1")}
            type="text"
            disabled={isView}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">{columnHeader?.puc}</label>
          <input
            className="form-input"
            {...register("input2")}
            type="text"
            disabled={isView}
          />
        </div>
          <div className="text-center">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
      </form>
    </div>
  );
};

export default EntityDetails;
