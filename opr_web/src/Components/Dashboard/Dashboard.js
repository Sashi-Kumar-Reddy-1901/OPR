import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SelectModule from "../SelectModule/SelectModule";
import { useDispatch } from 'react-redux';
import { callMethod, setUnitCode } from "../../Redux-Slices/getEntitySlice";
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
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Outlet } from "react-router-dom";
import "./Dashboard.css";
import TranslateIcon from "@mui/icons-material/Translate";
import WorkspacesIcon from "@mui/icons-material/Workspaces";

const drawerWidth = 150;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(1),
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
  padding: "0 10px",
  boxSizing: "border-box",
  justifyContent: "space-between",
});

export default function Dashboard() {
  const [ModuleData, setModuleData] = useState("");
  const [openSelectModule, setOpenSelectModule] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [langMenuDesc, setLangMenuDesc] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [languageSelected, setLanguageSelected] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userId, setUserId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const dispatch = useDispatch();

  const handleOpenModule = () => {
    setOpenSelectModule(true);
  };

  const handleCloseSelectModule = () => {
    setIsSelected((prevState) => !prevState);
    setOpenSelectModule(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          tokenDetailsResponse,
          moduleResponse,
          menuResponse,
          languagesResponse,
          entitlementsResponse,
        ] = await Promise.all([
          axiosInstance.get("/users/get_token_details"),
          axiosInstance.get("/users/get_user_modules_and_roles?isChange=true"),
          axiosInstance.post("/users/get_menu"),
          axiosInstance.get("/users/get_languages"),
          axiosInstance.get("/users/get_entitlements"),
        ]);

        const {
          langName,
          loginTime,
          displayName,
          userId,
          roleName,
          moduleName,
          unitCode
        } = tokenDetailsResponse?.data?.data?.data;
        setLanguage(langName);
        setDisplayName(displayName);
        setUserId(userId);
        setRoleName(roleName);
        setModuleName(moduleName);
        dispatch(setUnitCode(unitCode))

        const date = new Date(loginTime);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
        setLoginTime(formattedDate);

        const moduleData = moduleResponse.data?.data?.data || [];
        setModuleData(moduleData);

        setMenuData(menuResponse.data?.data?.data?.menuTree || []);

        const langArray = languagesResponse?.data?.data?.data;
        const transformedArray = langArray.map((item) => ({
          value: item.langCode,
          label: item.langDesc,
        }));
        setLangMenuDesc(transformedArray);

        console.log(entitlementsResponse?.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };

    fetchInitialData();
  }, [isSelected, languageSelected]);

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

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
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
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

  const handleChangeLanguage = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseChangeLanguage = async (event, index) => {
    if (index !== undefined) {
      setSelectedIndex(index);
      const langCode = langMenuDesc[index]?.value;
      console.log(langCode);
      const getSelectLanguageUrl = `/users/select_language?langCode=${langCode}`;
      try {
        if (langCode !== null) {
          const response = await axiosInstance.post(getSelectLanguageUrl, {});
          console.log(response);
        }
      } catch (error) {
        console.error("Failed to select language:", error);
      }

 
      setLanguage(langMenuDesc[index]?.label);
      setLanguageSelected(langMenuDesc[index]?.label);
      dispatch(callMethod());
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={4}
          sx={{ backgroundColor: "white", height: 50 }}
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
              aria-label="open drawer"
              onClick={() => {
                setOpen(!open);
              }}
              edge="start"
            >
              <MenuIcon style={{color:"black"}}/>
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Logout" arrow TransitionComponent={Zoom}>
              <IconButton onClick={handleLogout}>
                <LogoutIcon style={{color:"black"}}/>
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
              boxSizing: "border-box",
              overflowY: "auto",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <div className="mt-14">
            <SimpleTreeView>
              {menuData.map((node) => (
                <TreeItem
                  key={node.labelCode}
                  itemId={node.labelCode}
                  label={node.label}
                  className="parent-node"
                >
                  {node.nodes.map((subNode) => (
                    <Tooltip
                      key={subNode.labelCode}
                      title={subNode.label}
                      arrow
                      TransitionComponent={Zoom}
                      placement="right"
                    >
                      <div>
                        <TreeItem
                          key={subNode.labelCode}
                          itemId={subNode.labelCode}
                          label={subNode.label}
                          className="child-node"
                          onClick={() => handleNavigateClick(subNode)}
                        />
                      </div>
                    </Tooltip>
                  ))}
                </TreeItem>
              ))}
            </SimpleTreeView>
          </div>
        </Drawer>
        <Main open={open}>
          <Outlet />
        </Main>
        <Footer variant="body2">
          <div className="info-container">
            <PersonIcon />
            <span>{userId}</span>
          </div>
          <p>{displayName}</p>
          <p>{moduleName}</p>
          <p>{roleName}</p>
          <p>{loginTime}</p>
          <Tooltip title="Change Language" arrow TransitionComponent={Zoom}>
            <span
              onClick={handleChangeLanguage}
              className="language-button-container"
            >
              <TranslateIcon style={{ cursor: "pointer" }} />
              <button>{language}</button>
            </span>
          </Tooltip>
          {ModuleData && ModuleData.length > 0 && (
            <IconButton color="inherit" onClick={handleOpenModule}>
              <Tooltip
                title="Change Module and Role"
                arrow
                TransitionComponent={Zoom}
              >
                <WorkspacesIcon />
              </Tooltip>
            </IconButton>
          )}
        </Footer>
      </Box>

      {/* Logout  */}
      <Dialog
        open={openLogout}
        PaperProps={{
          sx: {
            maxWidth: "350px",
            width: "100%",
            maxHeight: "200px",
            height: "100%",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: "3rem" }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "1rem" }}>
            <span className="text-black">Are you sure you want to Logout?</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-evenly", mb: 2 }}>
          <button
            type="button"
            onClick={handleCloseNoLogout}
            className="bg-black text-gray-100 text-sm rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            NO
          </button>
          <button
            type="button"
            onClick={handleCloseYesLogout}
            className="bg-black text-gray-100 text-sm rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none px-4 py-2"
          >
            YES
          </button>
        </DialogActions>
      </Dialog>

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

      {/* Change Language */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {langMenuDesc.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={selectedIndex === index}
            onClick={(event) => handleCloseChangeLanguage(event, index)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
