import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AuthContextProvider from "./contexts/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={NewRoom} path="/rooms/new" />
          <Route component={Room} path="/rooms/:id" />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
