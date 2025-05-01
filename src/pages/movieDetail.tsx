// pages/movieDetail.tsx
import { useParams } from 'react-router-dom';
import { useFetch } from '../hook/useFetch';
import { DetailMovie } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const { data, isLoading, error } = useFetch<DetailMovie>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        로딩 중입니다...
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        alt={data.title}
        className="mb-4 rounded-lg"
      />
      <p className="text-gray-800">{data.overview}</p>
      <p className="text-sm text-gray-500 mt-4">평점: {data.vote_average} / 10</p>
      <p className="text-sm text-gray-500">개봉일: {data.release_date}</p>
    </div>
  );
};

export default MovieDetailPage;
