export interface Media {
  name: string;
  slug: string;
  logo: string;
  url: string;
}

export interface Rating {
  score: number;
  max: number;
}

export interface Review {
  media: Media;
  rating: Rating;
  normalized_rating: number;
  comment: string;
  date: string;
}

export interface Program {
  id: number;
  type: string;
  slug: string;
  imdbId: string;
  title: string;
  originalTitle: string;
  originalLanguage: string;
  runtime: number;
  releasedAt: string;
  imdbRating: number;
  imdbVotes: number;
  poster: string;
  backdrop: string | null;
}

export interface Movie {
  type: string;
  slug: string;
  reviews: Review[];
  program: Program;
}
