import { Navigate, Route, Routes } from 'react-router-dom';
import UserAuthContextProvider from './auth/UserAuthContextProvider';
import ProtectedRoute from './components/routes/ProtectedRoute';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace={true} />} />
      </Routes>
    </UserAuthContextProvider>
  );
};
