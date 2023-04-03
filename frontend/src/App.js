import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'
import { HomePage, MyRecipesPage, CreateRecipePage, ProfilePage } from './pages';
import { links } from './utils/mock.jsx'

function App() {
  return (
    <Router>
      <Header props={links} />
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/my-recipes" element={<MyRecipesPage />} />
        <Route path="/create-recipe" element={<CreateRecipePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router >
  );
}

export default App;
