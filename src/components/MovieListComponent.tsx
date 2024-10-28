import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie, Review } from "../interface/IMovie";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick";

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

        const latestReviews = allReviews.slice(0, 5);
        setMoviesWithTopReviews(latestReviews);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (moviesWithTopReviews.length === 0)
    return <p className="text-center text-white">No movies available</p>;

  return (
    <div className="min-h-screen bg-gray-800 py-10">
      <div className="container mx-auto p-4 border border-gray-700 rounded-lg bg-gray-900 shadow-lg">

        <Slider>
        {moviesWithTopReviews.map(({ movie, review }, index) => (
          <div
            key={`${movie.slug}-${index}`}
            className="mb-8 p-4 border-b border-gray-700 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              <img
                src={movie.program.poster}
                alt="Movie poster"
                className="w-28 h-40 rounded-lg shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={review.media.logo}
                    alt={`${review.media.name} logo`}
                    className="w-8 h-8 rounded-full"
                  />
                  <h2 className="text-lg font-semibold text-white">
                    {review.media.name}
                  </h2>
                </div>
                <p className="text-gray-300 mb-2">{review.comment}</p>
                <p className="text-gray-400 mb-1">
                  <strong>Score:</strong> {review.rating.score}/
                  {review.rating.max} (Normalized: {review.normalized_rating})
                </p>
                <p className="text-gray-400">
                  <strong>Date:</strong>{" "}
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        </Slider>
      </div>
    </div>
  );
};

export default MovieListComponent;
