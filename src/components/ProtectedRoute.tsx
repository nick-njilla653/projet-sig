import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  requiredRole,
  ...rest
}) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && (!requiredRole || userRole === requiredRole) ? (
          Component ? <Component {...props} /> : null
        ) : (
          <Redirect
            to={{
              pathname: '/LoginPage',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;