import { Box, Drawer, Toolbar } from "@mui/material";
import ChannelMenu from "../components/Menu/ChannelMenu";
import Chat from "../components/Chat/Chat";
import Header from "../components/Header";
import ThemeMenu from "../components/Menu/ThemeMenu";
const Main = () => {
  return (
    /** backgroundColor는 테마적용 */
    <Box sx={{ display: "flex", backgroundColor: "white" }}>
      <Header />
      <Drawer variant="permanent" sx={{ width: 300 }} className="no-scroll">
        <Toolbar />
        <Box sx={{ display: "flex", minHeight: "calc(100vh-64px" }}>
          <ThemeMenu></ThemeMenu>
          <ChannelMenu />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Chat />
      </Box>
    </Box>
  );
};
export default Main;
