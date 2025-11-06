import { Box } from '@mui/material'
import React from 'react'
import { useAuth } from '../components/shared/AuthProvider/useAuth'
import NonUserNavbar from '../components/shared/NonUserNavbar';
import UserNavbar from '../components/shared/UserNavbar';

function AnimePage() {
  const { user } = useAuth();
  return (
    <Box>
      {user ? <UserNavbar /> : <NonUserNavbar />}
      <div>AnimePage</div>
    </Box>
  )
}

export default AnimePage