import { useState } from "react";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoles, setModules } from "../../Data/userSlice";
import axios from "../../api/axios";

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

  const handleButtonClick = async () => {
    const storedprocedureUrl = "/common-utils/call-stored-procedure";
    const token = sessionStorage.getItem("token");
    console.log(token);
    try {
      const response = await axios.post(
        storedprocedureUrl,
        {
          "procedure": "set_product_params",
          "param1":"user5"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
    }
    onCloseSelectModule();
    navigate("./dashboard");
  };

  const roleOptions = selectedModule ? selectedModule.roles.map(role => ({
    value: role.role,
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
      />

      <div className="mt-8">
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          options={roleOptions}
          placeholder="Select Role"
          isClearable
          isSearchable
        />
      </div>

      <button
        onClick={handleButtonClick}
        className="mt-8 bg-black text-gray-100 w-full py-2 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      > Submit
      </button>
    </>
  );
};

export default SelectModule;
