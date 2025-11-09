import { useAuth } from '../components/shared/AuthProvider/useAuth'
import UserNavbar from '../components/shared/UserNavbar';
import { Box, Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function User() {
  const { user } = useAuth();

  // Example user
  // {
  //   "_id": "690f9747d8e7cd2f56f6b1ba",
  //   "username": "foo1",
  //   "email": "foo1@mail.com",
  //   "role": "user",
  //   "animesRated": [
  //     {
  //       "name": "Jujutsu Kaisen",
  //       "slug": "jujutsu-kaisen",
  //       "animeID": "690cb4830da9b138d4f68370",
  //       "rating": 10,
  //       "_id": "690f974dd8e7cd2f56f6b1c8"
  //     },
  //     {
  //       "name": "Naruto",
  //       "slug": "naruto",
  //       "animeID": "690cb4de0da9b138d4f68378",
  //       "rating": 10,
  //       "_id": "690fd5bc56330e440f814c7a"
  //     }
  //   ]
  // }


  return (
    <Box>
      <UserNavbar />

      <Container sx={{ padding: "1rem" }}>
        <Stack gap={5}>
          <Typography
            component="h1"
            variant="h4"
          >
            Hi {user.username}!
          </Typography>


          {user.animesRated.length !== 0 ? (
            <Stack gap={2}>
              <Typography variant="h4" component="h2">Table here</Typography>
              <TableContainer sx={{ backgroundColor: "background.paper" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Anime Name
                      </TableCell>
                      <TableCell>
                        Your rating
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.animesRated.map((anime) => (
                      <TableRow key={anime.slug}>
                        <TableCell>
                          {anime.name}
                        </TableCell>
                        <TableCell>
                          {anime.rating}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          ) : (
            <Typography>You haven't rated any anime yet!</Typography>
          )}


        </Stack>
      </Container>
    </Box >
  )
}

export default User