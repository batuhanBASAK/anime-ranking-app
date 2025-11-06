import React from "react";
import { useAuth } from "../AuthProvider/useAuth";
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";

function UserMenu() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ marginLeft: "auto", marginRight: "0" }}>
      <Tooltip title={user.username}>
        <IconButton
          onClick={handleClick}
          size="small"
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "secondary.main"
            }}>
            {user.username[0]}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={logout}>Log out</MenuItem>
      </Menu>
    </Box>
  );
}

export default UserMenu;
