import { useParams } from 'react-router-dom';
import { useFetch } from '../hook/useFetch';
import { DetailMovie, CreditResponse } from '../types/movie';

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const {
    data: movie,
    isLoading: isLoadingMovie,
    error: movieError,
  } = useFetch<DetailMovie>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
  );

  const {
    data: credits,
    isLoading: isLoadingCredits,
    error: creditError,
  } = useFetch<CreditResponse>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
  );

  if (movieError || creditError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {movieError || creditError}
      </div>
    );
  }

  if (isLoadingMovie || !movie || isLoadingCredits || !credits) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        로딩 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* 포스터 */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-2xl shadow-md"
        />

        {/* 영화 정보 */}
        <div className="flex-1 text-gray-800">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{movie.title}</h1>
          <p className="text-sm text-gray-500 italic mb-2">{movie.tagline}</p>
          <p className="text-base leading-relaxed mb-6">{movie.overview}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold">개봉일:</span> {movie.release_date}</p>
            <p><span className="font-semibold">평점:</span> {movie.vote_average} / 10</p>
            <p><span className="font-semibold">러닝타임:</span> {movie.runtime}분</p>
            <p><span className="font-semibold">언어:</span> {movie.spoken_languages.map(lang => lang.name).join(', ')}</p>
          </div>
        </div>
      </div>

      {/* 출연진 */}
      {credits.cast.length > 0 && (
        <div className="mt-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">출연진</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {credits.cast.slice(0, 10).map((actor) => (
              <div key={actor.id} className="text-center">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-auto rounded-xl shadow"
                  />
                ) : (
                  <div className="w-full h-[278px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-600">
                    이미지 없음
                  </div>
                )}
                <p className="mt-2 font-semibold">{actor.name}</p>
                <p className="text-sm text-gray-500">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;

