import { Box } from "@mui/material";
import Header from "../components/Header";
const Main = () => {
  return (
    /** backgroundColor는 테마적용 */
    <Box sx={{ display: "flex", backgroundColor: "white" }}>
      <Header></Header>
    </Box>
  );
};
export default Main;
