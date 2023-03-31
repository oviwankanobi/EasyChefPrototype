import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx'
import { HomePage, MyRecipesPage, CreateRecipePage, ProfilePage } from './pages';
import { links } from './utils/mock.jsx'

function App() {
  return (
    <Router>
      <Header props={links} />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/my-recipes" component={MyRecipesPage} />
        <Route path="/create-recipe" component={CreateRecipePage} />
        <Route path="/profile" component={ProfilePage} />
      </Switch>
    </Router >
  );
}

export default App;
