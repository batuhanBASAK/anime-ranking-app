import { useAuth } from '../components/shared/AuthProvider/useAuth'
import UserNavbar from '../components/shared/UserNavbar';
import { Box, Container, Typography } from '@mui/material';
import AddAnimeForm from "../components/pages/Admin/AddAnimeForm";

function AdminPanel() {
  const { user } = useAuth();
  return (
    <Box>
      <UserNavbar />

      <Container>
        <Typography component="h1" variant="h4" >Hi {user.username}!</Typography>
        <Typography component="h2" variant="h5" >Admin Panel</Typography>
        <AddAnimeForm />
      </Container>

    </Box >
  )
}

export default AdminPanel