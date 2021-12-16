import { Route, Redirect } from "react-router-dom";

/* takes a component as a prop, as well as any number of
props to pass down to that component */
const ProtectedRoute = (props) => {
  return (
    <Route>
      {props.loggedIn ? props.children : <Redirect to={props.redirectTo} />}
    </Route>
  );
};

export default ProtectedRoute;
