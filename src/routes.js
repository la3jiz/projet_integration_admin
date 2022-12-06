import { useContext } from 'react'
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import ReservationPage from './pages/ReservationPage';
import GuidePage from './pages/GuidePage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import RandonneePage from './pages/RandonneePage';
import DashboardAppPage from './pages/DashboardAppPage';
import { AuthContext } from './contexts/auth-context';
// ----------------------------------------------------------------------

export default function Router() {
  const { token } =useContext(AuthContext)
  const routes = useRoutes([
    {
      path: '/',
      element:!token?<LoginPage/> : <DashboardLayout />,
      children: [
        { element: <Navigate to="/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'guide', element: <GuidePage /> },
        { path: 'randonnee', element: <RandonneePage /> },
        { path: 'reservation', element: <ReservationPage /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
