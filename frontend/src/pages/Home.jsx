import { Box, Container, Pagination, Typography } from '@mui/material'
import { useAuth } from "../components/shared/AuthProvider/useAuth";
import { useLayoutEffect, useState } from 'react';
import api from "../api/api";
import RankingList from '../components/pages/Home/RankingList';
import NonUserNavbar from "../components/shared/NonUserNavbar";
import UserNavbar from "../components/shared/UserNavbar";

function Home() {
  const { user } = useAuth();
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Number of animes displayed in a page.
  const animeCountInPage = 12;




  const handlePageChange = async (event, value) => {
    try {
      const startIndex = page * animeCountInPage;
      const res = await api.get(`/api/animes/${startIndex}/${animeCountInPage}`);
      setAnimeList(() => res.data.animes);
      setTotalCount(() => res.data.totalCount);
      setPage(() => value);
    } catch {
      setAnimeList(() => ([]));
    }
  };



  useLayoutEffect(() => {
    const fetchAnimes = async () => {
      try {
        const startIndex = 0;
        // const res = await api.get(`/api/animes/${startIndex}/${animeCountInPage}`);
        const res = await api.get(`/api/animes/${startIndex}/${100}`);
        setAnimeList(() => res.data.animes);
        setTotalCount(() => res.data.totalCount);
      } catch {
        setAnimeList(() => ([]));
        setTotalCount(() => 0);
      }
    };

    fetchAnimes();
  }, []);


  return (
    <Box>

      {user ? (<UserNavbar />) : (<NonUserNavbar />)}

      <Container>
        <Typography
          component="h1"
          variant="h3"
          sx={{ textAlign: "center", margin: "2rem auto" }}
        >
          Ranking
        </Typography>
        <RankingList animeList={animeList} />

        {totalCount > animeCountInPage && (
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Pagination count={totalCount / animeCountInPage} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
          </Box>)}
      </Container>
    </Box >
  );
}

export default Home