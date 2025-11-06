import { useRef } from 'react'
import { useNavigate } from 'react-router';
import { useAuth } from '../../shared/AuthProvider/useAuth';
import api from "../../../api/api";
import Form from '../../shared/Form';
import { Button, Stack, Typography } from '@mui/material';

function LoginForm() {

  const { setAccessToken } = useAuth();

  const usernameRef = useRef();
  const passwordRef = useRef();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await api.post("/auth/login", { username, password });
      setAccessToken(() => res.data.accessToken);
      navigate("/");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Form
      onSubmit={handleLogin}
      elevation={5}
      sx={{
        borderRadius: "0.5rem",
        padding: "2rem 1rem",
        width: "100%",
      }}
    >
      <Stack gap={5}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ textAlign: "center" }}>
          Login
        </Typography>

        <Stack gap={2}>
          <Form.Input id="username" variant="filled" type="text" label="username" inputRef={usernameRef} required />
          <Form.Input id="password" variant="filled" type="password" label="password" inputRef={passwordRef} required />
        </Stack>
        <Button size="large" variant="contained" type="submit">Login</Button>
      </Stack>
    </Form>
  )
}

export default LoginForm