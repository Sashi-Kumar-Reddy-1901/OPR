import { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoles, setModules } from "../../Data/userSlice";
import "./SelectModule.css";
import axiosInstance from "../../api/axios"; 
import { useLocation } from 'react-router-dom'

const SelectModule = ({ ModuleData, onCloseSelectModule }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // If there's only one module available, automatically select it
    if (Array.isArray(ModuleData) && ModuleData.length === 1) {
      setSelectedModule({
        value: ModuleData[0].moduleDescription,
        label: ModuleData[0].moduleDescription,
        moduleCode: ModuleData[0].moduleCode,
        roles: ModuleData[0].roles,
      });
      dispatch(setModules(ModuleData[0]));
    }
  }, [ModuleData, dispatch]);

  useEffect(() => {
    // If there's only one role for the selected module, automatically select it
    if (selectedModule && selectedModule.roles.length === 1) {
      setSelectedRole({
        value: selectedModule.roles[0].roleCode,
        label: selectedModule.roles[0].role,
      });
      dispatch(setRoles(selectedModule.roles[0]));
    }
  }, [selectedModule, dispatch]);

  const handleModuleChange = (selectedOption) => {
    setSelectedModule(selectedOption);
    dispatch(setModules(selectedOption));
    setSelectedRole(null);
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    dispatch(setRoles(selectedOption));
  };

  const handleButtonClick = async () => {
  
    try {
      const moduleCode = selectedModule?.moduleCode;
      const roleCode = selectedRole?.value;
      const select_module_role_Url = `/users/select_module_role?moduleCode=${moduleCode}&roleCode=${roleCode}`;
      const module_role_response = await axiosInstance.post(select_module_role_Url,{});
      const settoken = module_role_response.data?.data?.data;
      sessionStorage.setItem("token", settoken);
      console.log("location",location.pathname);
     if(location.pathname.includes('/dashboard')){
      navigate("/");
     }
      onCloseSelectModule();
      if (selectedModule?.moduleCode === -1 && selectedRole?.value === -1) {
        navigate("./setup-table");
      } else {
        navigate("./dashboard");
      }
    } catch (error) {
      console.error("Error selecting module and role:", error);
    }
  };

  useEffect(() => {
    // Update role options when selectedModule changes
    if (selectedModule) {
      const updatedRoleOptions = selectedModule.roles.map((role) => ({
        value: role.roleCode,
        label: role.role,
      }));
      setRoleOptions(updatedRoleOptions);
    } else {
      setRoleOptions([]);
    }
  }, [selectedModule]);

  return (
    <>
      <Select
        value={selectedModule}
        onChange={handleModuleChange}
        options={ModuleData.map((module) => ({
          value: module.moduleDescription,
          label: module.moduleDescription,
          moduleCode: module.moduleCode,
          roles: module.roles,
        }))}
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
        disabled={!selectedRole}
      >
        Submit
      </button>
    </>
  );
};

export default SelectModule;