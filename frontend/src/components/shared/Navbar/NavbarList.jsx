import { Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, Stack, Toolbar } from '@mui/material'
import { useNavbarContext } from './useNavbarContext'
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router';

function NavbarList({ links }) {
  const { open, setOpen } = useNavbarContext();

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  }

  const MenuButton = () => {
    return (
      <IconButton
        color="inherit"
        onClick={toggleDrawer}
        edge="start"
        sx={{
          display: { md: "none" }
        }}
      >
        <MenuIcon />
      </IconButton>
    )
  }

  return (
    <Container>
      {/* menu icon button */}
      <MenuButton />

      {/* Navbar Drawer displays navbar list on small screens */}
      <Drawer
        open={open}
        onClose={() => setOpen(() => false)}
      >
        <Box
          sx={{
            width: "100vw",
            backgroundColor: "primary.main",
            color: "#ffffff",
            height: "100%"
          }}
        >
          <Toolbar>
            <Container>
              <MenuButton />
            </Container>
          </Toolbar>
          <Divider />
          <List>
            {links.map((item, index) => (
              <ListItem key={index}>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                >
                  {item.label}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* displays navbar list on large screens */}
      <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
        <Stack direction="row" gap={1}>
          {links.map((item, index) => (
            <Button
              key={index}
              component={NavLink}
              to={item.to}
              sx={{ color: "#ffffff" }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}

export default NavbarList