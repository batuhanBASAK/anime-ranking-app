import { Box, Container, Stack, Typography, Button, Backdrop, Rating, ButtonGroup } from '@mui/material'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useAuth } from '../components/shared/AuthProvider/useAuth'
import NonUserNavbar from '../components/shared/NonUserNavbar';
import UserNavbar from '../components/shared/UserNavbar';
import { useNavigate, useParams } from 'react-router';
import api from '../api/api';
import { BarChart } from '@mui/x-charts/BarChart';
import StarIcon from '@mui/icons-material/Star';
import Form from '../components/shared/Form';

function AnimePage() {
  const { slug } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [animeLoading, setAnimeLoading] = useState(true);
  const [userRate, setUserRate] = useState(null);
  const [newRate, setNewRate] = useState(null);
  const [openRatingForm, setOpenRatingForm] = useState(false);


  const rateAnime = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/user/anime/${anime.slug}/${newRate}`);
      const res = await api.get("/user/me");
      setUser(() => res.data.user);
    } catch (err) {
      alert(err.response.message);
    } finally {
      setOpenRatingForm(() => false);
    }
  }


  const reRateAnime = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/user/anime/${anime.slug}/${newRate}`);
      const res = await api.get("/user/me");
      setUser(() => res.data.user);
    } catch (err) {
      alert(err.response.message);
    } finally {
      setOpenRatingForm(() => false);
    }
  }



  useLayoutEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await api.get(`/api/anime/${slug}`);
        setAnime(() => res.data.anime);
      } catch (err) {
        alert(err.response.message);
        navigate("/", { replace: true });
      } finally {
        setAnimeLoading(() => false);
      }
    }
    fetchAnime();
  }, [user]);


  useEffect(() => {
    const findUserRate = () => {
      if (!user || !anime) {
        setUserRate(() => null);
        return;
      }

      try {
        const ratedAnime = user.animesRated.find(
          (r) => r.slug === anime.slug
        );

        if (ratedAnime) {
          setUserRate(() => ratedAnime.rating);
        } else {
          setUserRate(() => null);
        }
      } catch {
        setUserRate(() => null);
      }
    }

    findUserRate();
  }, [user, anime]);



  if (animeLoading) {
    return (
      <Typography component="h1" variant="h4">Loading...</Typography>
    )
  }

  return (
    <Box>
      {user ? <UserNavbar /> : <NonUserNavbar />}
      <Container sx={{ padding: "1rem" }}>
        <Stack gap={5}>
          {/* name & ranking */}

          <Typography component="h1" variant="h4">{anime.name} #{anime.ranking} (Rating: {anime.overallRating})</Typography>

          {/* display of user rate and other user related rating actions */}
          {user && (
            <Box>
              {userRate ? (
                <Stack gap={2} direction="row" alignItems="center">
                  <Typography
                    component="p"
                    variant="body1"
                  >
                    Your rate: {userRate}
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<StarIcon sx={{ color: "secondary.main" }} />}
                    onClick={() => setOpenRatingForm(true)}
                  >
                    Re-rate
                  </Button>
                </Stack>
              ) : (
                <Stack gap={2} direction="row" alignItems="center">
                  <Typography
                    component="p"
                    variant="body1"
                  >
                    You haven't rate {anime.name} yet!
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<StarIcon sx={{ color: "secondary.main" }} />}
                    onClick={() => setOpenRatingForm(true)}
                  >
                    Rate
                  </Button>
                </Stack>)}
            </Box>)}


          {/* description */}
          <Stack gap={2}>
            <Typography component="h2" variant="h5">Description</Typography>
            <Typography component="p" variant="body1">{anime.description}</Typography>
          </Stack>


          {/* ratings */}
          <Stack gap={2}>
            <Typography component="h2" variant="h5">Votes</Typography>
            {anime.totalRatings ? (
              <BarChart
                height={400}
                xAxis={[{
                  data: Object.keys(anime.ratingCounts),
                  label: 'Rating',
                }]}
                series={[
                  {
                    data: Object.values(anime.ratingCounts),
                    label: 'Number of Votes',
                  },
                ]}
              />
            ) : (
              <Typography component="p" variant="body1">This anime hasn't been voted yet!</Typography>
            )}
          </Stack>



        </Stack>
      </Container>


      <Backdrop open={openRatingForm}>
        <Form onSubmit={userRate ? reRateAnime : rateAnime} sx={{ padding: "1rem" }}>
          <Stack gap={5}>
            <Typography component="h2" variant='h4'>
              {userRate ? "Re-rate" : "Rate"}
            </Typography>

            <Stack gap={2}>
              <Rating
                name="rating"
                value={newRate}
                onChange={(e, newValue) => setNewRate(() => newValue)}
                min={1}
                max={10}
                precision={1}
                size="large"
              />
              <Stack gap={2} direction="row" variant="contained">
                <Button type='submit'>{userRate ? "Re-rate" : "Rate"}</Button>
                <Button onClick={() => setOpenRatingForm(false)}>Close</Button>
              </Stack>
            </Stack>
          </Stack>
        </Form>
      </Backdrop>


    </Box >
  )
}

export default AnimePage