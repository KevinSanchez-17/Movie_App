import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

// Gets popular movies from a specific page
export const getPopularMovies = (signal, page = 1) =>
  tmdb
    .get("/movie/popular", { params: { page }, signal })
    .then((res) => res.data);

// Searches for movies and lets us load more results
export const searchMovies = (query, signal, page = 1) =>
  tmdb
    .get("/search/movie", { params: { query, page }, signal })
    .then((res) => res.data);
