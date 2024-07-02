import React from "react";
import { useForm } from "react-hook-form";

const UserDetails = () => {
  const { register: userDetails, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  const onSave = (data) => {
    console.log(data);
  };
  const onCancel = () => {
    console.log("Cancel");
  };
  const onReset = () => {
    reset();
  };
  return (
    <>
      <div className="w-full mt-12">
        <h2 className="text-center text-2xl font-bold">User Maintenace</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="mb-4">
              <label className="form-label"></label>
              <input
                className="form-input"
                {...userDetails("userid", { required: true })}
                type="text"
                placeholder="Enter"
              />
            </div>
          </div>

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
        </form>
      </div>
    </>
  );
};

export default UserDetails;
