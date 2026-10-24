import { useEffect, useState } from 'react';
import { isCancel } from 'axios';
import { getPopularMovies, searchMovies } from './api/tmdb';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      try {
        setLoading(true);
        setError('');
        if (page === 1) setMovies([]);

        const data = search
          ? await searchMovies(search, controller.signal, page)
          : await getPopularMovies(controller.signal, page);

        if (controller.signal.aborted) return;
        // Add the next page to the movies already on screen.
        setMovies((previous) => page === 1
          ? data.results
          : [...previous, ...data.results.filter((movie) =>
              !previous.some((oldMovie) => oldMovie.id === movie.id))]);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        if (controller.signal.aborted || isCancel(err)) return;
        setError("Couldn't load movies. Try again later.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadMovies();
    return () => controller.abort();
  }, [search, page]);

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(query.trim());
  }

  return (
    <main className="app">
      <h1>Movie Explorer</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          aria-label="Search for movies"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>

      {search && (
        <div className="search-heading">
          <h2>Results for "{search}"</h2>
          <button type="button" onClick={() => {
            setQuery('');
            setPage(1);
            setSearch('');
          }}>Show popular</button>
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      {loading && page === 1 && <p>Loading...</p>}

      {/* Show this when a search has no matches. */}
      {!loading && !error && movies.length === 0 && (
        <p>{search ? `No results for '${search}'` : 'No movies found.'}</p>
      )}

      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelect={setSelectedMovie} />
        ))}
      </div>

      {/* TMDB sends more movies when we increase the page number. */}
      {!error && movies.length > 0 && page < totalPages && (
        <div className="load-more">
          <button type="button" disabled={loading} onClick={() => setPage(page + 1)}>
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </main>
  );
}
