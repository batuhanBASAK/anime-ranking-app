import { Box, Toolbar } from '@mui/material';
import Navbar from '../Navbar';
import { links as navbarLinks } from "../../../links";
import { useAuth } from '../AuthProvider/useAuth';
import UserMenu from "../UserMenu";
function UserNavbar() {
  const { user } = useAuth();
  return (
    <Box>
      <Navbar>
        <Navbar.List links={navbarLinks[user.role]} />
        <UserMenu />
      </Navbar>
      <Toolbar />
    </Box>
  )
}

export default UserNavbar