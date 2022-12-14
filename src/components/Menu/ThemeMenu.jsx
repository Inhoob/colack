import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  Stack,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import { child, getDatabase, onChildAdded, push, ref, update } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../store/themeReducer";
import { useCallback, useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
function ThemeMenu() {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [mainTheme, setMainTheme] = useState("#FFFFFF");
  const [subTheme, setSubTheme] = useState("#FFFFFF");
  const [userTheme, setUserTheme] = useState([]);
  const handleClickOpen = useCallback(() => setShowThemeModal(true), []);
  const handleClose = useCallback(() => setShowThemeModal(false), []);
  const handleChangeMain = useCallback((color) => setMainTheme(color), []);
  const handleChangeSub = useCallback((color) => setSubTheme(color), []);
  const handleSaveTheme = useCallback(async () => {
    if (!user.currentUser?.uid) return;
    try {
      const db = getDatabase();
      const key = push(child(ref(db), "/users/" + user.currentUser.uid + "/theme")).key;
      const newTheme = { mainTheme, subTheme };
      const updates = {};
      updates["/users/" + user.currentUser.uid + "/theme/" + key] = newTheme;
      await update(ref(db), updates);
      handleClose();
    } catch (error) {
      console.error(error);
      handleClose();
    }
  }, [mainTheme, subTheme, user.currentUser?.uid, handleClose]);

  //내 테마 바꿀때
  useEffect(() => {
    if (!user.currentUser?.uid) return;
    const db = getDatabase();
    const themeRef = ref(db, "users/" + user.currentUser.uid + "/theme");
    const unsubscribe = onChildAdded(themeRef, (snap) => {
      //onChildAdded=>기존의 데이터들도 가져오고 지금 들어가는 데이터도 받아옴
      setUserTheme((themeArr) => [snap.val(), ...themeArr]);
      //[{mainTheme: '#FFFFFF', subTheme: '#b07272'},{mainTheme: '#FFFFFF', subTheme: '#b07272'}] 이런형태로 저장
    });
    return () => {
      setUserTheme([]);
      unsubscribe?.();
    };
  }, [user.currentUser?.uid]);

  return (
    <>
      <List sx={{ overflow: "auto", width: 60, backgroundColor: "#150C16" }}>
        <ListItem button onClick={handleClickOpen}>
          <ListItemIcon sx={{ color: "white", width: "24px", minWidth: "24px" }}>
            <PaletteIcon />
          </ListItemIcon>
        </ListItem>
        {userTheme.map((theme, i) => (
          <ListItem key={i}>
            <div className="theme-box" onClick={() => dispatch(setTheme(theme.mainTheme, theme.subTheme))}>
              <div className="theme-main" style={{ backgroundColor: theme.mainTheme }}></div>
              <div className="theme-sub" style={{ backgroundColor: theme.subTheme }}></div>
            </div>
          </ListItem>
        ))}
      </List>
      <Dialog open={showThemeModal} onClose={handleClose}>
        <DialogTitle>테마 색상 선택</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <div>
              Main
              <HexColorPicker color={mainTheme} onChange={handleChangeMain} />
            </div>
            <div>
              Sub
              <HexColorPicker color={subTheme} onChange={handleChangeSub} />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSaveTheme}>테마 저장</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ThemeMenu;
