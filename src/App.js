import React from 'react';
import { Router } from '@reach/router';

import './App.css';
import Search from './components/Search';
import Details from './components/Details';

function App() {
  return (
    <Router>
      <Details path='/details/:repositoryId' />
      <Search path='/'/>
    </Router>
  );
}

export default App;
