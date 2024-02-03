import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AccountBoxRounded, BookOutlined, ExpandMore, MasksOutlined } from "@mui/icons-material";
import GMenu from "./GMenu";
import { Accordion, AccordionDetails, AccordionSummary, MenuItem } from "@mui/material";
import { RouterConstant } from "src/router/genRouter";
import { useLocation, useNavigate } from "react-router-dom";

import './index.css'

interface Sidebar {
  name: string;
  icon: any,
  route?: string,
  children: {
    name: string;
    icon: any,
    route?: string,
  }[]
}

export default function GSidebarWrapper(props: { children?: any }) {

  const navigate = useNavigate();
  const location = useLocation();
  const [sideBarItems, setSideBarItems] = React.useState<Sidebar[]>([
    // {
    //   name: "Works",
    //   icon: BookOutlined,
    //   // route: RouterConstant.Root.Home.Work.WorkList,
    //   children: [
    //     {
    //       icon: BookOutlined,
    //       name: "Works",
    //       route: RouterConstant.Root.Home.Work.WorkList,
    //     },
    //     {
    //       icon: MasksOutlined,
    //       name: "Genre",
    //       route: RouterConstant.Root.Home.Work.GenreList,
    //     }
    //   ]
    // },
    // {
    //   name: "User Management",
    //   icon: AccountBoxRounded,
    //   children: [],
    //   route: RouterConstant.Root.Home.User.User
      
    // },
    
  ])
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSideBarItemClick = (sideBarItem: any) => {
    if(sideBarItem.route) {
    navigate(sideBarItem.route);
    }
  }

  const isActive = (sideBarItem: any) => {
    return (sideBarItem.route === location.pathname) ||
    sideBarItem.children?.some((item: any) => item.route === location.pathname)
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar color="default" position="fixed" sx={{zIndex:10}} open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography className="flex-fill" variant="h6" noWrap component="div">
            Thaaliyola
            {location.pathname}
          </Typography>
          <GMenu isIcon={true} icon={AccountBoxRounded}>
            <MenuItem>
            Logout
            </MenuItem>
          </GMenu>
        </Toolbar>
      </AppBar>
      <Drawer sx={{zIndex: 9}} variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        {sideBarItems.map((sidebarItem, index) => (
             <Accordion variant="outlined">
             <AccordionSummary
               expandIcon={open&&<ExpandMore />}
               aria-controls="panel1a-content"
               id="panel1a-header"
               sx={{border:"none",padding:"0",my: "0px",minHeight:30}}
             >
               <ListItemButton
                sx={{
                  minHeight: 30,
                  justifyContent:  "initial",
                  px: 2.5,
                  my:0
                }}
                onClick={() => handleSideBarItemClick(sidebarItem)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:isActive(sidebarItem)?"#0e387a":"default"
                  }}
                 
                >
                  <sidebarItem.icon />
                </ListItemIcon>
                {open &&<ListItemText primary={sidebarItem.name} sx={{ opacity: open ? 1 : 0 }} />}
              </ListItemButton>
             </AccordionSummary>
             {sidebarItem.children.length>0&&<AccordionDetails>
               {
                sidebarItem.children.map(item => {
                  return (
                    <ListItemButton
                    sx={{
                      minHeight: 30,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      my:0
                    }}
                    onClick={() => handleSideBarItemClick(item)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:isActive(item)?"#0e387a":"default"
                      }}
                    >
                      {item?.icon&&<item.icon />}
                    </ListItemIcon>
                    {open &&<ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />}
                  </ListItemButton>
                  )
                })
               }
             </AccordionDetails>}
           </Accordion>
            
          ))}
          {/* {sideBarItems.map((sidebarItem, index) => (
            <ListItem onClick={() => handleSideBarItemClick(sidebarItem)} key={sidebarItem.name} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <sidebarItem.icon />
                </ListItemIcon>
                <ListItemText primary={sidebarItem.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            
          ))} */}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {props.children}
      </Box>
    </Box>
  );
}


const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
