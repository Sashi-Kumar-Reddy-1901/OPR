import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import "./EntityDetails.css";

const EntityDetails = () => {
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
      <h2 className="text-center text-2xl font-bold">Add Entity</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="form-label">{columnHeader?.unitName}</label>
          <input className="form-input" {...register("input1")} type="text" />
        </div>
        <div className="mb-4">
          <label className="form-label">{columnHeader?.puc}</label>
          <input className="form-input" {...register("input2")} type="text" />
        </div>
      </form>
    </div>
  );
};

export default EntityDetails;
