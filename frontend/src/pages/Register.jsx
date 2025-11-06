import { Box, Container } from '@mui/material'

import RegisterForm from '../components/pages/Register/RegisterForm';
import NonUserNavbar from '../components/shared/NonUserNavbar';

function Register() {


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
        <RegisterForm />
      </Container>
    </Box >
  );
}

export default Register