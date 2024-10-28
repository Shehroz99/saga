import React, { useEffect, useState } from "react";
import axios from "axios";
import { Movie, Review } from "../interface/IMovie";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  let settings = {
    dots: true,
    infinte: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="min-h-screen bg-gray-800 py-10 overflow-hidden">
      <div className="w-1/2 mx-auto border border-gray-700 rounded-lg bg-gray-900 shadow-lg">
        <Slider {...settings}>
          {moviesWithTopReviews.map(({ movie, review }, index) => (
            <div
              key={`${movie.slug}-${index}`}
              className="w-80 bg-[#2E2233] shadow-lg text-white "
            >
              {/* Movie Image */}
              <div className="flex items-start gap-4">
                <img
                  src={movie.program.poster}
                  alt="Movie poster"
                  className="w-1/2 rounded-lg shadow-md"
                />
                {/* Movie Details */}
                <div className="flex-1 ">
                  {/* Logo and Title */}
                  <img
                    src={review.media.logo}
                    alt="LOGO"
                    className="w-40 h-20 flex"
                  />
                  <p className="text-gray-300 text-sm mb-4">
                    “{review.comment}”
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(6)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < review.rating.score
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex items-center justify-center bg-purple-600 px-4 py-2 rounded-lg text-white font-semibold text-sm">
                      <span className="mr-2">▶️</span> Spill av
                    </button>
                    <button className="bg-gray-700 px-4 py-2 rounded-lg text-white font-semibold text-sm">
                      Les mer
                    </button>
                  </div>
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
