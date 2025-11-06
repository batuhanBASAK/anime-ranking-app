import { Box, Container } from '@mui/material'
import LoginForm from '../components/pages/Login/LoginForm';
import NonUserNavbar from '../components/shared/NonUserNavbar';


function Login() {


  return (
    <Box>
      <NonUserNavbar />

      <Container
        maxWidth="sm"
        sx={{
          height: "100vh",
          display: "grid",
          placeItems: "center"
        }}
      >
        <LoginForm />
      </Container>

    </Box >
  );
}

export default Login