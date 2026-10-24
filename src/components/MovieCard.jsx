const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

export default function MovieCard({ movie, onSelect }) {
  return (
    <article className="card">
      {/* Click the poster or title to see the movie's overview. */}
      <button className="card-button" type="button" onClick={() => onSelect(movie)}>
        {movie.poster_path ? (
          <img src={`${IMG_BASE}${movie.poster_path}`} alt={`${movie.title} poster`} />
        ) : (
          <div className="no-poster">No image</div>
        )}
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.slice(0, 4) || 'Unknown'} · ★ {movie.vote_average?.toFixed(1) ?? 'N/A'}</p>
      </button>
    </article>
  );
}
