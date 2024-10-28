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

  if (loading) return <p className="text-center">Loading...</p>;
  if (moviesWithTopReviews.length === 0)
    return <p className="text-center">No movies available</p>;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {moviesWithTopReviews.map(({ movie, review }, index) => (
        <div
          key={`${movie.slug}-${index}`}
          className="bg-white rounded-lg shadow-lg overflow-hidden w-64"
        >
          <img
            src={movie.program.poster}
            alt="Movie poster"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center mb-2">
              <img
                src={review.media.logo}
                alt={`${review.media.name} logo`}
                className="w-10 h-10 mr-2"
              />
              <h2 className="text-lg font-semibold">{review.media.name}</h2>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <p className="text-gray-600">
              Score: {review.rating.score}/{review.rating.max} (Normalized:{" "}
              {review.normalized_rating})
            </p>
            <p className="text-gray-500 text-sm">
              Date: {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieListComponent;
