import { useAuth } from '../components/shared/AuthProvider/useAuth'
import UserNavbar from '../components/shared/UserNavbar';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import AddAnimeForm from "../components/pages/Admin/AddAnimeForm";
import { useState } from 'react';
import Tab from '../components/shared/Tab';
import TabPanel from "../components/shared/TabPanel";
import LogsPanel from '../components/pages/Admin/LogsPanel';

function AdminPanel() {
  const { user } = useAuth();

  // const [page, setPage] = useState(0);
  const [currTabVal, setCurrTabVal] = useState(0);


  return (
    <Box>
      <UserNavbar />

      <Container sx={{ padding: "1rem" }}>
        <Stack gap={5}>
          <Stack gap={2}>
            <Typography component="h1" variant="h4" >Hi {user.username}!</Typography>
            <Typography component="h2" variant="h5" >Admin Panel</Typography>
          </Stack>



          <Tab>
            <Stack gap={5}>
              <Stack gap={2}>
                <Typography component="h2" variant="h5" >Tabs</Typography>

                <Stack gap={2} direction="row">
                  <Button onClick={() => setCurrTabVal(0)}>Logs</Button>
                  <Button onClick={() => setCurrTabVal(1)}>Add Anime</Button>
                </Stack>
              </Stack>


              {/* logs tab */}
              <TabPanel currVal={currTabVal} tabVal={0}>
                <LogsPanel />
              </TabPanel>


              {/* Add anime tab */}
              <TabPanel currVal={currTabVal} tabVal={1}>
                <AddAnimeForm />
              </TabPanel>

            </Stack>
          </Tab>
        </Stack>
      </Container>

    </Box >
  )
}

export default AdminPanel