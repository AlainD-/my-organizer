import { Route, Routes } from 'react-router-dom';
import UserAuthContextProvider from './auth/UserAuthContextProvider';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </UserAuthContextProvider>
  );
};
