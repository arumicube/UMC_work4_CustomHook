import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Genre {
  id: number;
  name: string;
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: Genre[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const [movieRes, creditRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              },
            }
          ),
          axios.get<{ cast: Cast[] }>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCast(creditRes.data.cast.slice(0, 5)); // 상위 5명만
      } catch (err) {
        setError('영화 정보를 불러오지 못했습니다 😢');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">🐻‍❄️ 로딩 중...</div>;
  }

  if (error || !movie) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error || '영화 정보를 찾을 수 없습니다'}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 md:px-10 lg:px-20 bg-black text-gray-200">
      <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* 영화 포스터 */}
        <div className="flex justify-center">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-xl shadow-lg w-full max-w-[400px]"
          />
        </div>

        {/* 영화 상세 정보 */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-400 mb-3">{movie.release_date}</p>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">{movie.overview}</p>
          <p className="mb-2">
            <strong className="text-white">장르:</strong>{' '}
            {movie.genres.map((g) => g.name).join(', ')}
          </p>
          <p>
            <strong className="text-white">평점:</strong> ⭐ {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </div>

      {/* 출연진 */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {cast.map((actor) => (
            <div key={actor.id} className="text-center">
              {actor.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="w-20 h-20 object-cover rounded-full mx-auto shadow-md"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-400 mx-auto">
                  사진 없음
                </div>
              )}
              <p className="mt-2 text-sm text-white font-medium">{actor.name}</p>
              <p className="text-xs text-gray-400">({actor.character} 역)</p>
            </div>
          ))}
        </div>
      </div>
      <footer className="mt-20 py-8 border-t border-gray-700 text-center text-sm text-gray-400">
        ⓒ 2025 Armin Cinema. All rights reserved.
      </footer>
    </div>
  );
}
