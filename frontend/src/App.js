import React, { Component } from "react";
import Root from "./Root";
import {Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import requireAuth from "./utils/RequireAuth";
import axios from "axios"

axios.defaults.baseURL = "http://127.0.0.1:8000";

const App = () => {
    return (
      <div>
        <Root> {/* replace BrowserRouter with Root */}
        <ToastContainer hideProgressBar={true} newestOnTop={true} />
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={requireAuth(Dashboard)} />
            <Route exact path="/" component={Home} />
            <Route path="*">Ups</Route>
          </Switch>
        </Root> {/* replace BrowserRouter with Root */}
      </div>
    )
}

export default App;