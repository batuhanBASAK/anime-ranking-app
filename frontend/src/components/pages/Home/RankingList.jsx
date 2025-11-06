import { Box, Grid, Typography } from '@mui/material'
import AnimeCard from './AnimeCard'

function RankingList({ animeList }) {

  if (animeList.length === 0) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <Typography component="h2" variant="h4" sx={{ textAlign: "center" }}>There is no anime to display!</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2} sx={{ padding: "2rem" }}>
      {animeList.map((anime) => (
        <Grid key={anime.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
          <AnimeCard anime={anime} />
        </Grid>
      ))}

    </Grid>
  )
}

export default RankingList