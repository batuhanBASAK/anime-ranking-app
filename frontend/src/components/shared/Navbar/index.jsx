import { AppBar, Toolbar } from "@mui/material";
import NavbarProvider from "./NavbarProvider";
import NavbarList from "./NavbarList";

function Navbar(props) {
  return (
    <NavbarProvider>
      <AppBar {...props}>
        <Toolbar>
          {props.children}
        </Toolbar>
      </AppBar>
    </NavbarProvider>
  )
}

Navbar.List = NavbarList;

export default Navbar;