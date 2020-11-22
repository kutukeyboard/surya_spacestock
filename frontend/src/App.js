import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SearchPage from "./pages/search";
import DetailPage from "./pages/detail";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <SearchPage />
        </Route>
        <Route path="/:itemId">
          <DetailPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
