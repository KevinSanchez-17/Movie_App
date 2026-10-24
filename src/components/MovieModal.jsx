import { useEffect, useRef } from 'react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieModal({ movie, onClose }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!movie) return undefined;
    const oldOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
      // Keep Tab inside the popup until it closes.
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button:not([disabled]), a[href]');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const year = movie.release_date?.slice(0, 4) || 'Unknown year';
  const rating = Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    // Show the movie info in a popup when a card is selected.
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        aria-describedby="movie-modal-overview"
      >
        <button ref={closeButtonRef} className="modal-close" type="button" onClick={onClose} aria-label="Close movie details">×</button>
        <div className="modal-layout">
          {movie.poster_path ? (
            <img className="modal-poster" src={`${IMG_BASE}${movie.poster_path}`} alt={`${movie.title} poster`} />
          ) : (
            <div className="modal-poster no-poster">No poster available</div>
          )}
          <div className="modal-copy">
            <span className="eyebrow">MOVIE DETAILS</span>
            <h2 id="movie-modal-title">{movie.title}</h2>
            <p className="modal-meta">{year} <span aria-hidden="true">·</span> ★ {rating} / 10</p>
            <h3>Overview</h3>
            <p id="movie-modal-overview">{movie.overview?.trim() || 'No overview is available for this movie.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
