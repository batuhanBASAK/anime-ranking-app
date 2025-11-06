import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { useNavigate } from 'react-router';

function AnimeCard({ anime }) {
  const navigate = useNavigate();
  const handleNavigation = (e) => {
    e.preventDefault();

    const to = `/anime/${anime.slug}`;
    navigate(to);
  }

  // ✅ Limit description length for preview
  const getPreview = (text, limit = 200) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit).trim() + "..." : text;
  };

  return (
    <Card sx={{ height: "20rem" }}>
      <CardContent>
        {/* rank */}
        <Typography variant="h5" component="div">
          Rank: #{anime.ranking}
        </Typography>

        {/* Title */}
        <Typography
          gutterBottom
          variant="h5"
          component="div"
        >
          {anime.name}
        </Typography>

        {/* description */}
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >
          {getPreview(anime.description)}
        </Typography>

        {/* rating */}
        <Typography component="div" >
          Rating: {anime.overallRating}
        </Typography>

      </CardContent>
      <CardActions>
        <Button onClick={handleNavigation}>Go to the anime page</Button>
      </CardActions>
    </Card>
  )
}

export default AnimeCard