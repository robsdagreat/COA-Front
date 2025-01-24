import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Transactions from './Pages/Transaction';
import Settings from './Pages/Settings';
import { ThemeProvider, createTheme } from '@mui/material';
import Signup from './Pages/Signup';
import Home from './Pages/Home'
import Category from './Pages/Categories'

const theme = createTheme({
  palette: {
    primary: {
      main: '#21963c', 
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/home" />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="categories" element={<Category />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}