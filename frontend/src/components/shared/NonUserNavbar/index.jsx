import { Box, Toolbar } from '@mui/material';
import Navbar from '../../shared/Navbar';
import { links as navbarLinks } from "../../../links";

function NonUserNavbar() {
  return (
    <Box>
      <Navbar>
        <Navbar.List links={navbarLinks["null"]} />
      </Navbar>
      <Toolbar />
    </Box>
  )
}

export default NonUserNavbar