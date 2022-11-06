import TagIcon from "@mui/icons-material/Tag";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Box, Container, Grid, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import md5 from "md5";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../firebase";
import { setUser } from "../store/userReducer";
const Join = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const postUserData = useCallback(
    async (name, email, password) => {
      setLoading(true);
      try {
        const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
        await updateProfile(user, {
          displayName: name,
          photoURL: `https://www.gravatar.com/avatar/${md5(email)}?d=retro`,
        });
        await set(ref(getDatabase(), "users/" + user.uid), {
          name: user.displayName,
          avatar: user.photoURL,
        });
        dispatch(setUser(user));
      } catch (e) {
        setLoading(false);
      }
    },
    [dispatch]
  );
  const handleSubmitForm = useCallback(
    (data) => {
      postUserData(data.name, data.email, data.password);
    },
    [postUserData]
  );
  const [loading, setLoading] = useState(false);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <TagIcon></TagIcon>
        </Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(handleSubmitForm)} sx={{ mt: 3 }}>
          <Grid container spasing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                label="닉네임"
                autoFocus
                sx={{ mb: 2 }}
                {...register("name", {
                  required: "닉네임을 입력하세요",
                  pattern: {
                    value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{2,10}$/,
                    message: "닉네임은 영문,한글,숫자이고 2글자 이상 10글자 미만입니다",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="이메일"
                autoComplete="off"
                sx={{ mb: 2 }}
                {...register("email", {
                  required: "이메일을 입력해주세요",
                  pattern: {
                    value: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "이메일 형식이 아닙니다",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="비밀번호"
                type="password"
                sx={{ mb: 2 }}
                {...register("password", {
                  required: "password를 입력해주세요",
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                    message: "비밀번호는 영문자,숫자,특수문자 포함 8글자이상으로 해주세요",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                required
                fullWidth
                label="비밀번호 확인"
                type="password"
                sx={{ mb: 2 }}
                {...register("confirmPassword", {
                  validate: {
                    matchesPreviousPassword: (value) => {
                      const { password } = getValues();
                      return password === value || "Passwords should match!";
                    },
                  },
                })}
              />
            </Grid>
          </Grid>

          {Object.keys(errors).length ? (
            <Alert sx={{ mt: 3 }} severity="error">
              {errors[Object.keys(errors)[0]]?.message}
            </Alert>
          ) : null}

          <LoadingButton type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2 }} loading={loading}>
            회원가입
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
                이미 계정이 있나요? 로그인으로 이동
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Join;
