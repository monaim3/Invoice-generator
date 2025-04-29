import React, { Component, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.min.css";
import { Navbar } from "./components/index.js";
import Login from "./views/Login.jsx";
import ProtectorRoute from "./views/ProtectorRoute.jsx";
const InvoiceGenerator = lazy(() =>
  import("./views/invoice-generator/invoice-generator")
);
const InvoiceList = lazy(() => import("./views/invoice-list/invoice-list"));
const Settings = lazy(() => import("./views/settings/settings"));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Navbar />
          <div className="container-fluid">
            <Suspense fallback={<div>Loading...</div>}>
            
              <Routes>
                
                <Route exact path="/" element={<ProtectorRoute><InvoiceGenerator /></ProtectorRoute>} />
                <Route path="/invoices" element={<ProtectorRoute><InvoiceList /></ProtectorRoute>} />
                <Route path="/settings" element={<ProtectorRoute><Settings /></ProtectorRoute>} />
                <Route path="/login" element={<Login />} />
                <Route render={() => <h1>404 Error</h1>} />
              </Routes>
            </Suspense>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
