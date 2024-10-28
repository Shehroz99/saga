// MovieListComponent.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "../interface/IMovie";

const MovieListComponent: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ data: Movie[] }>(
          "https://saga.filipjohn.workers.dev/reviews"
        );
        setMovies(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (movies.length === 0) return <p>No movies available</p>;

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.slug} className="movie">
          <img src={movie.program.poster} alt="Movie poster" />

          <div className="reviews">
            {movie.reviews.map((review, index) => (
              <div key={index} className="review">
                <img
                  src={review.media.logo}
                  alt={`${review.media.name} logo`}
                />
                <p>
                  <strong>{review.media.name}</strong>: {review.comment}
                </p>
                <p>
                  Score: {review.rating.score}/{review.rating.max} (Normalized:{" "}
                  {review.normalized_rating})
                </p>
                <p>Date: {new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieListComponent;
