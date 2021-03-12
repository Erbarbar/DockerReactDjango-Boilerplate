import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import HomePage from '../components/pages/Home';
import PrivatePage from '../components/pages/PrivatePage';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={HomePage} />
        <PrivateRoute path='private' component={PrivatePage} />
      </Switch>
    </Router>
  );
};

export default Routes;
