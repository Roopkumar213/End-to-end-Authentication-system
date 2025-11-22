// src/components/auth/OAuthSuccess.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { setAccessTokenHeader } from '../../services/authService';

const OAuthSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAuth() || {};

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      console.error('OAuthSuccess: missing tokens in query params');
      navigate('/login');
      return;
    }

    console.log('OAuthSuccess: received tokens');

    // Store tokens in localStorage (same as email/password login)
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Set default Authorization header for axios
    setAccessTokenHeader(accessToken);

    const init = async () => {
      try {
        if (typeof refreshUser === 'function') {
          console.log('OAuthSuccess: calling refreshUser()');
          await refreshUser();
        }
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuthSuccess: refreshUser failed', err);
        navigate('/login');
      }
    };

    init();
  }, [location.search, navigate, refreshUser]);

  return <div>Signing you in with Google...</div>;
};

export default OAuthSuccess;
