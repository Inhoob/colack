import TagIcon from "@mui/icons-material/Tag";
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import "../firebase";
import { getAuth, signOut } from "firebase/auth";
const Header = () => {
  const { user } = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await signOut(getAuth());
  };

  return (
    <>
      <AppBar
        position="fixed"
        //TODO : backgroundcolor theme 적용
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#9a939b",
          backgroundColor: "4c3c4c",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <TagIcon />
            <Typography variant="h6" component="div">
              SLACK
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleOpenMenu}>
              <Typography variant="h6" component="div" sx={{ color: "#9a939b" }}>
                {user.currentUser?.displayName}
              </Typography>
              <Avatar sx={{ marginLeft: "10px" }} alt="profileImage" src={user.currentUser?.photoURL} />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem>
                <Typography textAlign="center">프로필 이미지</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">LogOut</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};
export default Header;