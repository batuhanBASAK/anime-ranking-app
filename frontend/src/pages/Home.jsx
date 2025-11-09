import { Box, Container, Pagination, Typography } from '@mui/material'
import { useAuth } from "../components/shared/AuthProvider/useAuth";
import { useEffect, useState } from 'react';
import api from "../api/api";
import RankingList from '../components/pages/Home/RankingList';
import NonUserNavbar from "../components/shared/NonUserNavbar";
import UserNavbar from "../components/shared/UserNavbar";

function Home() {
  const { user } = useAuth();
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ✅ Show 15 animes per page
  const animeCountInPage = 15;

  const fetchAnimes = async (pageNumber) => {
    try {
      const startIndex = (pageNumber - 1) * animeCountInPage;
      const res = await api.get(`/api/animes/${startIndex}/${animeCountInPage}`);
      setAnimeList(res.data.animes);
      setTotalCount(res.data.totalCount);
    } catch {
      setAnimeList([]);
      setTotalCount(0);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchAnimes(value);
  };

  // ✅ Fetch first page on mount
  useEffect(() => {
    fetchAnimes(1);
  }, []);

  const pageCount = Math.ceil(totalCount / animeCountInPage);

  return (
    <Box>
      {user ? <UserNavbar /> : <NonUserNavbar />}

      <Container>
        <Typography
          component="h1"
          variant="h3"
          sx={{ textAlign: "center", margin: "2rem auto" }}
        >
          Ranking
        </Typography>

        <RankingList animeList={animeList} />

        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Home;
