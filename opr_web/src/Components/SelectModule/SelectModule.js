import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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

  const moduleDescriptions = Array.isArray(ModuleData) ? ModuleData : [];

  const handleChange = (event, value) => {
    setSelectedModule(value);
    dispatch(setModules(value));
    dispatch(setRoles(null));
    setSelectedRole(null);
    console.log(selectedModule);
  };

  const handleRoleChange = (event, value) => {
    setSelectedRole(value);
    dispatch(setRoles(value));
  };

  const handleButtonClick = async () => {
    const storedprocedureUrl = "/common-utils/call-stored-procedure";
    const token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        storedprocedureUrl,
        {
          procedure: "GetUserById",
          param1: "user5",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
    } catch {}
    onCloseSelectModule();
    navigate("./dashboard");
  };

  //const moduleData = ModuleData.map(item => item.moduleDescription);
  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={moduleDescriptions}
        getOptionLabel={(option) => option.moduleDescription}
        sx={{ width: 300}}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label="Modules" />}
      />

      {selectedModule && (
        <Autocomplete
          disablePortal
          id="role-combo-box"
          options={selectedModule.roles}
          getOptionLabel={(option) => option.role}
          sx={{ width: 300, marginTop: 6, marginBottom: 2 }}
          onChange={handleRoleChange}
          renderInput={(params) => <TextField {...params} label="Roles" />}
        />
      )}

      <Button onClick={handleButtonClick} variant="contained">Submit</Button>
    </>
  );
};

export default SelectModule;