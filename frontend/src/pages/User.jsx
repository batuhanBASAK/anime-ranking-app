import { useAuth } from '../components/shared/AuthProvider/useAuth'
import UserNavbar from '../components/shared/UserNavbar';
import { Box, Container, Typography } from '@mui/material';

function User() {
  const { user } = useAuth();
  return (
    <Box>
      <UserNavbar />

      <Container>
        <Typography component="h1" variant="h4" >Hi {user.username}!</Typography>
        <Typography component="h2" variant="h5" >User Page</Typography>
      </Container>
    </Box >
  )
}

export default User