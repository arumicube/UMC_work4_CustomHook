import './App.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/home.tsx';
import NotFound from './pages/not-found.tsx';
import RootLayout from './layout/root-layout.tsx';
import MovieDetailPage from './pages/movieDetail.tsx';
import { MovieList } from './components/movieList.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: 'movies/:category',
        element: <MovieList />,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage/>,
      },
      
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

