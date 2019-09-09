import React from 'react';
import Link from 'react-router-dom/es/Link';

const NotFound = () => {
  return (
    <div>
      <div>404 Error. The page you are looking for is not exist.</div>
      <Link to="/">Return to Home Page</Link>
    </div>
  );
};

export default NotFound;
