import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx'
import { links } from './utils/mock.jsx'

function App() {
  return (
    <Header props={links} />
  );
}

export default App;
