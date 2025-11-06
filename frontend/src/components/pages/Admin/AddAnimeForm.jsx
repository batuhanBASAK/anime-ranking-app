import { useRef } from 'react'
import api from "../../../api/api";
import Form from '../../shared/Form';
import { Button, Stack, Typography } from '@mui/material';

function AddAnimeForm() {

  const slugRef = useRef();
  const nameRef = useRef();
  const descRef = useRef();

  const handleAddingAnime = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const slug = slugRef.current.value;
    const description = descRef.current.value;

    try {
      const res = await api.post("/api/anime", { name, slug, description });
      alert(res.data.message);
      nameRef.current.value = "";
      slugRef.current.value = "";
      descRef.current.value = "";
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <Form
      onSubmit={handleAddingAnime}
      elevation={5}
      sx={{
        borderRadius: "0.5rem",
        padding: "2rem 1rem",
        width: "100%",
      }}
    >
      <Stack gap={5}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ textAlign: "center" }}>
          Add a new Anime
        </Typography>

        <Stack gap={2}>
          <Form.Input id="name" variant="outlined" type="text" label="Anime name" inputRef={nameRef} required />
          <Form.Input id="slug" variant="outlined" type="text" label="Anime slug" inputRef={slugRef} required />
          <Form.Input id="desc" variant="outlined" type="text" label="Anime description" inputRef={descRef} required />
        </Stack>
        <Button size="large" variant="contained" type="submit">Add a new anime</Button>
      </Stack>
    </Form>
  )
}

export default AddAnimeForm