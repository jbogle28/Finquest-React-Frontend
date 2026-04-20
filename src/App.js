import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext'; // Added Provider
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import QuizSelection from './pages/games/QuizSelection';
import MarketSimulation from './pages/market/MarketSimulation';
import StockMarket from './pages/market/Stocks';
import BondMarket from './pages/market/Bonds';
import DepositMarket from './pages/market/FixedDeposits';
import Portfolio from './pages/market/Portfolio';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import QuizResults from './pages/games/QuizResults';
import QuizReview from './pages/games/QuizReview';
import QuizModule from './pages/games/QuizModule';
import ArcadeHub from './pages/games/ArcadeHub'; 
import Crossword from './pages/games/Crossword';
import CrosswordSuccess from './pages/games/CrosswordSuccess';
import TimeChallenge from './pages/games/TimeChallenge';
import TimeChallengeSuccess from './pages/games/TimeChallengeSuccess';
import TimeChallUnsuccessful from './pages/games/TimeChallengeUnsuccessful';
import UnderConstruction from './pages/static/UnderConstruction';
import Leaderboard from './pages/leaderboard/Leaderboard';
// HANGMAN IMPORTS
import Hangman from './pages/games/Hangman';
import HangmanSuccess from './pages/games/HangmanSuccess';
import HangmanUnsuccessful from './pages/games/Unsuccessful'; 
import Store from './pages/store/Store';
import ProfileSettings from './pages/profile/ProfileSettings';
// NEW EDUCATION & SCENARIO IMPORTS
import EducationHub from './pages/games/EducationHub';
import ScenarioSelection from './pages/games/ScenarioSelection';
import ScenarioModule from './pages/games/ScenarioModule';


function App() {
  const [user, setUser] = useState(authService.getCurrentUser());

  const refreshUser = () => {
    setUser(authService.getCurrentUser());
  };

  const handleGlobalLogout = () => {
    authService.logout();
    setUser(null); 
  };

  return (
    <LoadingProvider> {/* Wrapped in LoadingProvider to enable the global loading screen */}
      <Router>
        {user && <Navbar user={user} onLogout={handleGlobalLogout} />}
        
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={refreshUser} />} />
            <Route path="/register" element={<RegisterPage onRegisterSuccess={refreshUser} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* --- EDUCATION HUB ROUTES --- */}
            <Route 
              path="/edu-hub" 
              element={
                <ProtectedRoute>
                  <EducationHub />
                </ProtectedRoute>
              } 
            />
            {/* SCENARIO ROUTES */}
            <Route 
              path="/scenarios" 
              element={
                <ProtectedRoute>
                  <ScenarioSelection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scenario/:id" 
              element={
                <ProtectedRoute>
                  <ScenarioModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz" 
              element={
                <ProtectedRoute>
                  <QuizSelection user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:id" 
              element={
                <ProtectedRoute>
                  <QuizModule user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/arcade" 
              element={
                <ProtectedRoute>
                  <ArcadeHub />
                </ProtectedRoute>
              } 
            />

            {/* HANGMAN ROUTES */}
            <Route 
              path="/arcade/hangman" 
              element={
                <ProtectedRoute>
                  <Hangman />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hangman-success" 
              element={
                <ProtectedRoute>
                  <HangmanSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hangman-unsuccessful" 
              element={
                <ProtectedRoute>
                  <HangmanUnsuccessful />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/market" 
              element={
                <ProtectedRoute>
                  <MarketSimulation user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/market/stocks" 
              element={
                <ProtectedRoute>
                  <StockMarket/>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/market/bonds" 
              element={
                <ProtectedRoute>
                  <BondMarket/>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/market/deposits" 
              element={
                <ProtectedRoute>
                  <DepositMarket />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/results" 
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/review/:historyId" 
              element={
                <ProtectedRoute>
                  <QuizReview />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/arcade/crossword/:topic" 
              element={
                <ProtectedRoute>
                  <Crossword />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/crossword-success" 
              element={
                <ProtectedRoute>
                  <CrosswordSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
                path="/store" 
                element={
                    <ProtectedRoute>
                        <Store />
                    </ProtectedRoute>
                } 
            />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

            {/* TIME CHALLENGE ROUTES */}
            <Route 
              path="/arcade/time-challenge" 
              element={
                <ProtectedRoute>
                  <TimeChallenge />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/time-challenge-unsuccessful" 
              element={
                <ProtectedRoute>
                  <TimeChallUnsuccessful />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/time-challenge-success" 
              element={
                <ProtectedRoute>
                  <TimeChallengeSuccess />
                </ProtectedRoute>
              } 
            />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </LoadingProvider>
  );
}

export default App;