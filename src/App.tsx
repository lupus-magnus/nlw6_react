import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AuthContextProvider from "./contexts/AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/rooms/new">
          <NewRoom />
        </Route>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
