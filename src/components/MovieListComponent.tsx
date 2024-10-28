import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie, Review } from "../interface/IMovie";

const MovieListComponent: React.FC = () => {
  const [moviesWithTopReviews, setMoviesWithTopReviews] = useState<
    { movie: Movie; review: Review }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % moviesWithTopReviews.length
    );
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + moviesWithTopReviews.length) %
        moviesWithTopReviews.length
    );
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (moviesWithTopReviews.length === 0)
    return <p className="text-center">No movies available</p>;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${moviesWithTopReviews.length * 100}%`,
        }}
      >
        {moviesWithTopReviews.map(({ movie, review }, index) => (
          <div
            key={`${movie.slug}-${index}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full flex-shrink-0"
            style={{ width: "100%" }}
          >
            <img
              src={movie.program.poster}
              alt="Movie poster"
              className="w-40 h-40"
            />
            <div className="flex p-4">
              <div className="flex items-center mb-2">
                <img
                  src={review.media.logo}
                  alt={`${review.media.name} logo`}
                  className="w-10 h-10 mr-2"
                />
                <h2 className="text-lg font-semibold">{review.media.name}</h2>
              </div>
              <p className="relative text-gray-700 h-40 w-40">
                {review.comment}
              </p>
              <p className="relative text-gray-600 h-40 w-40">
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
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white px-2 py-1 rounded hover:bg-gray-600"
      >
        previous
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white px-2 py-1 rounded hover:bg-gray-600"
      >
        next
      </button>
    </div>
  );
};

export default MovieListComponent;
