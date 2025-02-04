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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div
      className="min-h-screen  overflow-hidden flex items-center justify-center min-h-screen;"
      style={{ backgroundColor: "#13032c" }}
    >
      <div
        className="w-1/2 border-gray-700"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.2)", // black with 20% opacity
          boxShadow: "inset 2px 4px 17px 0px rgba(247, 116, 222, 0.2)", // semi-transparent pink shadow
          borderRadius: "12px 12px 12px 12px",
          borderWidth: "1px 0px 0px 0px",
        }}
      >
        <Slider {...settings} className="absolute">
          {moviesWithTopReviews.map(({ movie, review }, index) => (
            <div key={`${movie.slug}-${index}`} className="w-80  text-white ">
              {/* Movie Image */}
              <div className="flex py-1">
                <img
                  src={movie.program.poster}
                  alt="Movie poster"
                  className="w-1/2 rounded-md	 shadow-md"
                />
                {/* Movie Details */}
                <div className="flex-col py-2 px-2 relative">
                  <div className="flex-col justify-end w-fit h-fit">
                    {/* Logo and Title */}
                    <h1>{movie.program.title}</h1>
                    <br></br>
                    <img
                      src={review.media.logo}
                      alt="LOGO"
                      className="w-10 h-5 flex justify-center"
                    />
                    <p className="text-gray-300 text-left text-xs object-contain overflow-hidden">
                      “{review.comment}”
                    </p>

                    {/* Buttons */}
                  </div>
                  <div className="flex-col justify-end w-fit h-fit absolute inset-x-2 bottom-2">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(6)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating.score
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className=" flex justify-end object-contain ">
                      <button
                        className="flex items-center justify-center bg-purple-600 px-1 py-1 rounded-lg text-white font-semibold text-xs"
                        style={{
                          backgroundColor: "rgba(160, 160, 160, 0.3)", // 30% opacity
                        }}
                      >
                        <span className="mr-2">▶️</span> Spill av
                      </button>
                      <button
                        className=" px-1 py-1 rounded-lg text-white font-semibold text-xs"
                        style={{
                          backgroundColor: "rgba(160, 160, 160, 0.3)", // 30% opacity
                        }}
                      >
                        Les mer
                      </button>
                    </div>
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
