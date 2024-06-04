import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { styled } from "@mui/material/styles";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import SelectModule from "../SelectModule/SelectModule";
import { useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { Link, Outlet } from "react-router-dom";
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
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const fetchMenu_Languages = async () => {
      const getMenuUrl = `/users/get_menu`;
      const getLanguagesUrl = `/users/get_languages`;
      const token = sessionStorage.getItem("token");
      try {
        // Fetch menu
        const menuResponse = await axios.post(
          getMenuUrl,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMenuData(menuResponse.data?.data?.data?.menuTree);
        console.log(menuResponse.data?.data?.data?.menuTree);

        // Fetch languages
        const languagesResponse = await axios.get(getLanguagesUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(languagesResponse?.data);
      } catch (error) {
        console.log(error?.response?.data?.message);
      }
    };
    fetchMenu_Languages();
  }, []);

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const roles = useSelector((state) => state.user.roles);
  console.log(roles);

  const location = useLocation();
  const ModuleData = location.state?.ModuleData;
  console.log(ModuleData);
  const showModuleIcon =
    ModuleData &&
    (ModuleData.length > 1 ||
      (ModuleData.length === 1 && ModuleData[0].roles.length > 1));

  const [openSelectModule, setOpenSelectModule] = useState(false);
  const handleCloseSelectModule = () => {
    setOpenSelectModule(false);
  };
  const handleOpenSelectModule = () => {
    setOpenSelectModule(true);
  };

  const [openLogout, setOpenLogout] = useState(false);
  const handleLogout = () => {
    setOpenLogout(true);
  };
  const handleCloseNoLogout = () => {
    setOpenLogout(false);
  };
  const handleCloseYesLogout = () => {
    setOpenLogout(false);
    sessionStorage.clear();
    navigate("/");
  };

  const handleNavigateClick = (subNode) => {
    const navigateLabelcode = subNode.labelCode;
    if (navigateLabelcode === "MENU101_2") {
      navigate("/entity");
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
              backgroundColor: "#000",
              color: "white",
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
            {showModuleIcon && (
              <IconButton onClick={handleOpenSelectModule} color="inherit">
                <PersonIcon />
              </IconButton>
            )}
          </Typography>
        </Footer>
      </Box>

      {/*Select Module and Roles */}
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
    </>
  );
}
