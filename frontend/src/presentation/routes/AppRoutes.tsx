import { Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';

const AppRoutes = () => (
  <Routes>
    <Route path="/register" element={<Register />} />
    {/* Add more routes for other pages later */}
  </Routes>
);

export default AppRoutes;