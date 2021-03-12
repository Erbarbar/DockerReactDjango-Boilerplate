import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { DjangoContext } from '../api/context/DjangoContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const django = useContext(DjangoContext);
  const history = useHistory();

  const LoadingPage = <h1>Loading...</h1>;
  const [Page, setPage] = useState(LoadingPage);

  const PrivatePage = (
    <>
      <Route {...rest} render={(props) => <Component {...props} />} />
    </>
  );

  useEffect(() => {
    let mounted = true;
    django.actions
      .checkLogged()
      .then(() => {
        if (mounted) setPage(PrivatePage);
      })
      .catch(() => history.push('login'));
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Component]);

  return Page;
};

export default PrivateRoute;
