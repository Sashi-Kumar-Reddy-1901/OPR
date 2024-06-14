import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { styled } from "@mui/material/styles";
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
import { useSelector } from "react-redux";

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
  const [langMenuDesc, setlangMenuDesc] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [languageSelected, setLanguageSelected] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSelected, setIsSelected] = useState(false);

  const modulesRoles = useSelector((state) => state.user.modulesRoles);
  console.log(modulesRoles);

  const isSingleObjectFormat = modulesRoles.length > 0 && modulesRoles[0].moduleLabel && modulesRoles[0].roleLabel;
  const moduleDescription = isSingleObjectFormat ? modulesRoles[0].moduleLabel : modulesRoles[0]?.moduleDescription || "Loading...";
  const role = isSingleObjectFormat ? modulesRoles[0].roleLabel : modulesRoles[0]?.roles[0]?.role || "Loading...";

  const handleOpenModule = () => {
    setOpenSelectModule(true);
  };

  const handleCloseSelectModule = () => {
    setIsSelected(true)
    setOpenSelectModule(false);
  };

  useEffect(() => {
    const fetchToken_Modules_Roles = async () => {
      const getTokenDetailsUrl = `/users/get_token_details`;
      const isChange = true;
      const getUserModuleUrl = `/users/get_user_modules_and_roles?isChange=${isChange}`;
      try {
        const response = await axiosInstance.get(getUserModuleUrl, {});
        const moduleData = response.data?.data?.data || [];
        console.log(moduleData);
        setModuleData(moduleData);

        const tokenDetailsResponse = await axiosInstance.get(
          getTokenDetailsUrl
        );
        console.log(tokenDetailsResponse?.data?.data?.data);
        const { langName, loginTime, displayName } =
          tokenDetailsResponse?.data?.data?.data;
        setLanguage(langName);
        setDisplayName(displayName);
        // Convert and format loginTime
        const date = new Date(loginTime);
        // Format the date
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        // Format the time
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
        setLoginTime(formattedDate);
      } catch (error) {
        console.error("Failed to fetch token details:", error);
      }
    };
    fetchToken_Modules_Roles();
  }, []);

  useEffect(() => {
    const fetch_Menu_Languages_Entitlements = async () => {
      const getMenuUrl = `/users/get_menu`;
      const getLanguagesUrl = `/users/get_languages`;
      const getEntitlementsUrl = `/users/get_entitlements`;
      try {
        // Fetch menu
        const menuResponse = await axiosInstance.post(getMenuUrl, {});
        setMenuData(menuResponse.data?.data?.data?.menuTree || []);
        console.log(menuResponse.data?.data?.data?.menuTree);

        // Fetch languages
        const languagesResponse = await axiosInstance.get(getLanguagesUrl);
        console.log("langugae", languagesResponse?.data?.data?.data);
        const langArray = languagesResponse?.data?.data?.data;
        const transformedArray = langArray.map((item) => ({
          value: item.langCode,
          label: item.langDesc,
        }));
        setlangMenuDesc(transformedArray);
        console.log(transformedArray);

        // Fetch Entitlements
        const entitlementsResponse = await axiosInstance.get(
          getEntitlementsUrl
        );
        console.log(entitlementsResponse?.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };
    fetch_Menu_Languages_Entitlements();
  }, [languageSelected , isSelected]);

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
        <Footer variant="body2">
          <p>{displayName}</p>
          <p>{moduleDescription}</p>
          <p>{role}</p>
          <p>{loginTime}</p>
          <Tooltip title="Change Language" arrow TransitionComponent={Zoom}>
            <button onClick={handleChangeLanguage}>{language}</button>
          </Tooltip>
          {ModuleData && ModuleData.length > 0 && (
            <IconButton color="inherit" onClick={handleOpenModule}>
              <PersonIcon />
            </IconButton>
          )}
        </Footer>
      </Box>

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
        {langMenuDesc.map((item, index) => (
          <MenuItem
            key={item.value}
            selected={selectedIndex === index}
            onClick={(event) => handleCloseChangeLanguage(event, index)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
