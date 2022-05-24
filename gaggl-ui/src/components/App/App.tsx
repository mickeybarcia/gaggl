import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, RequireAuth } from '../../auth';
import NavBar from '../NavBar';
import Login from '../Login';
import Search from '../Search';
import Matches from '../Matches';
import Profile from '../Profile';
import Match from '../Matches/Match';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <main className="App">
        <div>
          <NavBar />
          <Routes>
            <Route path="/" element={<Navigate to="/search" />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/search"
              element={
                <RequireAuth>
                  <Search />
                </RequireAuth>
              }
            />
            <Route
              path="/matches"
              element={
                <RequireAuth>
                  <Matches />
                </RequireAuth>
              }
            />
            <Route
              path="/matches/:matchId"
              element={
                <RequireAuth>
                  <Match />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </main>
    </AuthProvider>
  );
};

export default App;
