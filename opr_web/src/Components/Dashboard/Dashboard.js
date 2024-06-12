import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { styled } from "@mui/material/styles";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import CloseIcon from "@mui/icons-material/Close";
import SelectModule from "../SelectModule/SelectModule";

import {
  Box,
  CssBaseline,
  Drawer,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogContentText,
  DialogActions,
  Tooltip,
  Zoom,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import TranslateIcon from '@mui/icons-material/Translate';
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Outlet } from "react-router-dom";
import Select from "react-select";
import "./Dashboard.css";

const drawerWidth = 150;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    overflowY: "auto",
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Footer = styled("footer")({
  width: "100%",
  height: "40px",
  backgroundColor: "black",
  position: "fixed",
  bottom: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  color: "white",
});

export default function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [langMenu, setlangMenu] = useState(false);
  const [langMenuDesc, setlangMenuDesc] = useState(null || []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [languageLabelSelected, setLanguageLabelSelected] = useState("English");
  const [ModuleData, setModuleData] = useState("");
  const [openSelectModule, setOpenSelectModule] = useState(false);
  const options = [
    { value: "profile", label: "Profile" },
    { value: "account", label: "My account" },
    { value: "logout", label: "Logout" },
  ];

  const handleClick = async(event) => {
    const isChange = true;
    const getUserModuleUrl = `/users/get_user_modules_and_roles?isChange=${isChange}`;
    try {
      const response = await axiosInstance.get(getUserModuleUrl,{});
      console.log(response);
      setModuleData(response.data?.data?.data);
    } catch (error) {}
    setOpenSelectModule(true);
    // setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenu = (event) => {
    setlangMenu(event.currentTarget);
    console.log(langMenu);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseSelectModule = () => {
    setOpenSelectModule(false);
  };

  const handleListItemClick = async(event, index) => {
    setSelectedIndex(index);
    const langCode = langMenuDesc[index].value;
    const getSelectLanguageUrl = `/users/select_language?langCode=${langCode}`;
    try {
      if(langCode){
        const response = await axiosInstance.post(getSelectLanguageUrl,{});
      console.log(response);
      }
    } catch (error) {}
    console.log("index",index);
    console.log(langMenuDesc[index]);
    setlangMenu(false);
   setLanguageLabelSelected(langMenuDesc[index].label)
    setLanguageSelected(prev => !prev); 
  };

  const closeLanguagePopup = () =>{
    setlangMenu(false);
  }
  const handleSelectChange = (selectedOption) => {
    console.log(`Selected: ${selectedOption.label}`);
  };
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const module = JSON.parse(sessionStorage.getItem("moduleData"));
    console.log(module);
    setModuleData(module);
    const fetch_Token_Menu_Languages_Entitlements = async () => {
      const getMenuUrl = `/users/get_menu`;
      const getLanguagesUrl = `/users/get_languages`;
      const getEntitlementsUrl = `/users/get_entitlements`;
      const getTokenDetailsUrl = `/users/get_token_details`;
      try {
        // Fetch Token Details
        const tokenDetailsResponse = await axiosInstance.get(
          getTokenDetailsUrl
        );
        console.log(tokenDetailsResponse?.data);

        // Fetch menu
        const menuResponse = await axiosInstance.post(getMenuUrl, {});
        setMenuData(menuResponse.data?.data?.data?.menuTree || []);
        console.log(menuResponse.data?.data?.data?.menuTree);

        // Fetch languages
        const languagesResponse = await axiosInstance.get(getLanguagesUrl);
        console.log("langugae",languagesResponse?.data?.data?.data);
        const langArray = languagesResponse?.data?.data?.data
        const transformedArray = langArray.map(item => ({
          value: item.langCode,
          label: item.langDesc
        }));
        setlangMenuDesc(transformedArray);
        console.log(transformedArray);
        console.log(langMenuDesc);

        // Fetch Entitlements
        const entitlementsResponse = await axiosInstance.get(
          getEntitlementsUrl
        );
        console.log(entitlementsResponse?.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };
    fetch_Token_Menu_Languages_Entitlements();
   
  }, [languageSelected]);

  
  const langOptions = langMenuDesc;


  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const roles = useSelector((state) => state.user.roles);
  console.log(roles);

  const [openLogout, setOpenLogout] = useState(false);
  const handleLogout = () => {
    setOpenLogout(true);
  };
  const handleCloseNoLogout = () => {
    setOpenLogout(false);
  };
  const handleCloseYesLogout = async () => {
    try {
      setOpenLogout(false);
  
      const getLogout = `/users/logout`;
      await axiosInstance.post(getLogout);
  
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle the error accordingly (e.g., show an error message to the user)
    }
  };

  const handleNavigateClick = (subNode) => {
    const navigateLabelcode = subNode.labelCode;
    if (navigateLabelcode === "MENU101_2") {
      navigate("/dashboard/entity");
    } else if (navigateLabelcode === "MENU102_2") {
      navigate("");
    } else if (navigateLabelcode === "MENU201_2") {
      navigate("");
    } else if (navigateLabelcode === "MENU202_2") {
      navigate("");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={4}
          sx={{ backgroundColor: "black", height: 50 }}
        >
          <Toolbar
            sx={{
              alignItems: "center",
              "@media (min-width: 600px)": {
                minHeight: 48,
              },
              "@media (min-width: 0px) and (orientation: landscape)": {
                minHeight: 48,
              },
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setOpen(!open);
              }}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Logout" arrow TransitionComponent={Zoom}>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              marginTop: "44px",
              boxSizing: "border-box",
              overflowY: "auto",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <SimpleTreeView>
            {menuData.map((node) => (
              <TreeItem
                key={node.labelCode}
                itemId={node.labelCode}
                label={node.label}
                className="parent-node"
              >
                {node.nodes.map((subNode) => (
                  <TreeItem
                    key={subNode.labelCode}
                    itemId={subNode.labelCode}
                    label={subNode.label}
                    className="child-node"
                    onClick={() => handleNavigateClick(subNode)}
                  />
                ))}
              </TreeItem>
            ))}
          </SimpleTreeView>
        </Drawer>
        <Main open={open}>
          <Outlet />
        </Main>
        <Footer>
          <Typography variant="body2">
            <div className="flex-footer">
              <IconButton  color="inherit" onClick={handleClick}>
                <PersonIcon />
              </IconButton>
              <Tooltip title="Change Language" arrow TransitionComponent={Zoom}>
              <p className="footer-text" onClick={handleLanguageMenu}> {languageLabelSelected}</p> 
              </Tooltip>
              {/* <IconButton className="footer-icon" color="inherit" onClick={handleLanguageMenu}>
             English
              </IconButton> */}
            </div>
          </Typography>
        </Footer>
      </Box>

      {/* Select Role */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ width: 200, padding: 16 }}>
          <Select
            options={options}
            onChange={handleSelectChange}
            placeholder="Select Role"
            isClearable
            isSearchable
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
        <button className="px-4 py-2 text-white bg-black rounded">
          Submit
        </button>
      </Menu>


         {/* Select Language */}
         {/* <Menu
        anchorEl={langMenu}
        open={Boolean(langMenu)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ width: 200, padding: 16 }}>
          <Select
            options={langOptions}
            onChange={handleSelectChange}
            placeholder="Select Language"
            isClearable
            isSearchable
            className="custom-select-container"
            classNamePrefix="custom-select"
          />
        </div>
        <button className="px-4 py-2 text-white bg-black rounded">
          Submit
        </button>
      </Menu> */}

      {/* Logout  */}
      <Dialog open={openLogout}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: "3rem" }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "1rem" }}>
            <p className="text-black">Are you sure you want to Logout?</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-evenly" }}>
          <button
            type="button"
            onClick={handleCloseNoLogout}
            className="bg-black text-gray-100 text-sm rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            NO
          </button>
          <button
            type="button"
            onClick={handleCloseYesLogout}
            className="bg-black text-gray-100 text-sm rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            YES
          </button>
        </DialogActions>
      </Dialog>

      {/* Language slide */}
      <Menu
        anchorEl={langMenu}
        open={Boolean(langMenu)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ width: 250, padding: 16 }}>
          <button className="button-lang" onClick={closeLanguagePopup}>X</button>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        {langMenuDesc.map((item, index) => (
          <ListItemButton
            key={item.value}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
          >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <DraftsIcon />} {/* Example icons, customize as needed */}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      </Box>
      </div>
      </Menu>

      {/* Select Module */}
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={openSelectModule}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px",
            width: "100%",
            maxHeight: "300px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
          Select Module and Role
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSelectModule}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography gutterBottom component="div">
            <SelectModule
              ModuleData={ModuleData}
              onCloseSelectModule={handleCloseSelectModule}
            />
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
