// components/movieList.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFetch } from '../hook/useFetch';
import { MovieResponse } from '../types/movie';
import { CustomButton } from './custom-button';

interface MovieListProps {
  title: string;
  endpoint: string;
}

export const MovieList = ({ title, endpoint }: MovieListProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, error } = useFetch<MovieResponse>(
    `https://api.themoviedb.org/3/movie/${endpoint}?language=ko-KR&page=${page}`
  );

  if (error?.trim()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-red-600 text-xl font-semibold mb-4">{error}</p>
        <CustomButton onClick={() => navigate('/')} label="처음으로 돌아가기" />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4" />
        <p className="text-lg text-gray-700 font-medium">로딩 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-center mt-8 gap-4">
        <CustomButton
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          label="<"
        />
        <span className="flex items-center text-gray-700 font-semibold text-lg">
          {page} 페이지
        </span>
        <CustomButton onClick={() => setPage((prev) => prev + 1)} label=">" />
      </div>

      <h1 className="text-3xl font-bold text-center my-8 text-gray-900">{title}</h1>

      <ul className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
        {data.results.map((movie) => (
          <li
            key={movie.id}
            className="relative overflow-hidden rounded-2xl shadow-lg group bg-white"
          >
            <Link to={`/movies/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="rounded-2xl w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-white/60 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 cursor-pointer">
                <h2 className="text-black text-lg font-bold mb-2">{movie.title}</h2>
                <p className="text-black text-sm line-clamp-3">{movie.overview}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
