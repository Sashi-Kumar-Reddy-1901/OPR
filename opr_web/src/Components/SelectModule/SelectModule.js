import {useState} from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SelectModule = ({ModuleData}) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    console.log(ModuleData);

    const moduleDescriptions = Array.isArray(ModuleData) ? ModuleData : [];

   const handleChange = (event, value) => {
    setSelectedModule(value);
    setSelectedRole(null);
    console.log(selectedModule);
  };

  
  const handleRoleChange = (event, value) => {
    setSelectedRole(value);
  };
  
  //const moduleData = ModuleData.map(item => item.moduleDescription);
  return (
   <>
       <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={moduleDescriptions}
      getOptionLabel={(option) => option.moduleDescription}
      sx={{ width: 300 }}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label="Modules" />}
    />

{selectedModule && (
        <Autocomplete
          disablePortal
          id="role-combo-box"
          options={selectedModule.roles}
          getOptionLabel={(option) => option.role}
          sx={{ width: 300,marginTop:6, marginBottom: 2 }}
          onChange={handleRoleChange}
          renderInput={(params) => <TextField {...params} label="Roles" />}
        />
      )}

<Button variant="contained">Submit</Button>
   </>
  )
}

export default SelectModule