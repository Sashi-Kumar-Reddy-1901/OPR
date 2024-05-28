import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoles, setModules } from "../../Data/userSlice";
import "./SelectModule.css";

const SelectModule = ({ ModuleData, onCloseSelectModule }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  console.log(ModuleData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const moduleOptions = Array.isArray(ModuleData) ? ModuleData.map(module => ({
    value: module.moduleDescription,
    label: module.moduleDescription,
    roles: module.roles
  })) : [];

  const handleModuleChange = (selectedOption) => {
    setSelectedModule(selectedOption);
    dispatch(setModules(selectedOption));
    dispatch(setRoles(null));
    setSelectedRole(null);
    console.log(selectedOption);
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    dispatch(setRoles(selectedOption));
  };

  const handleButtonClick = () => {
    onCloseSelectModule();
    if (selectedRole && selectedRole.value === 99) {
      navigate("./setup-table")
    } else {
      navigate("./dashboard");
    }
  };

  const roleOptions = selectedModule ? selectedModule.roles.map(role => ({
    value: role.roleCode,
    label: role.role
  })) : [];

  return (
    <>
      <Select
        value={selectedModule}
        onChange={handleModuleChange}
        options={moduleOptions}
        placeholder="Select Module"
        isClearable
        isSearchable
        className="custom-select-container"
        classNamePrefix="custom-select"
        noOptionsMessage={() => "No modules available"}
      />

      <div className="mt-8">
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          options={roleOptions}
          placeholder="Select Role"
          isClearable
          isSearchable
          className="custom-select-container"
          classNamePrefix="custom-select"
          noOptionsMessage={() => "No roles available"}
        />
      </div>

      <button
        onClick={handleButtonClick}
        className="mt-8 bg-black text-gray-100 w-full py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
        disabled = {!selectedRole}
      > Submit
      </button>
    </>
  );
};

export default SelectModule;