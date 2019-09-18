import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '../not-found';
import Home from '../home';

const App = () => {
  return (
    <Router>
      <Switch>
        <Redirect exact from='/' to='/snapshot' />
        <Route exact path="/snapshot" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
