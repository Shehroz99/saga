import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie, Review } from "../interface/IMovie";

const MovieListComponent: React.FC = () => {
  const [moviesWithTopReviews, setMoviesWithTopReviews] = useState<
    { movie: Movie; review: Review }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ data: Movie[] }>(
          "https://saga.filipjohn.workers.dev/reviews"
        );
        const movies = response.data.data;

        // Flatten reviews with their associated movies and sort by date
        const allReviews: { movie: Movie; review: Review }[] = [];
        movies.forEach((movie) => {
          movie.reviews.forEach((review) => {
            allReviews.push({ movie, review });
          });
        });
        allReviews.sort(
          (a, b) =>
            new Date(b.review.date).getTime() -
            new Date(a.review.date).getTime()
        );

        // Take the top 5 reviews
        const latestReviews = allReviews.slice(0, 5);

        // Set the state with each top review associated with its movie
        setMoviesWithTopReviews(latestReviews);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (moviesWithTopReviews.length === 0) return <p>No movies available</p>;

  return (
    <div className="movie-list">
      {moviesWithTopReviews.map(({ movie, review }, index) => (
        <div key={`${movie.slug}-${index}`} className="movie">
          <img src={movie.program.poster} alt="Movie poster" />

          <div className="review">
            <img src={review.media.logo} alt={`${review.media.name} logo`} />
            <p>
              <strong>{review.media.name}</strong>: {review.comment}
            </p>
            <p>
              Score: {review.rating.score}/{review.rating.max} (Normalized:{" "}
              {review.normalized_rating})
            </p>
            <p>Date: {new Date(review.date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieListComponent;
