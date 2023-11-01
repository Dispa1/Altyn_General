import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Pages/Main/Main';
import Login from './components/Pages/Login/Login';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
        <Route path="/" element={<Main />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
