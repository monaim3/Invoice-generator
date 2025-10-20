
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.min.css";
import { Navbar } from "./components/index.js";
import Login from "./views/Login.jsx";
import ProtectorRoute from "./views/ProtectorRoute.jsx";
import { AuthProvider } from "./views/AuthContext.jsx";

const InvoiceGenerator = lazy(() =>
  import("./views/invoice-generator/invoice-generator")
);
const InvoiceList = lazy(() => import("./views/invoice-list/invoice-list"));
const Settings = lazy(() => import("./views/settings/settings"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <React.Fragment>
          <Navbar />
          <div className="container-fluid">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route 
                  exact 
                  path="/" 
                  element={
                    <ProtectorRoute>
                      <InvoiceGenerator />
                    </ProtectorRoute>
                  } 
                />
                <Route 
                  path="/invoices" 
                  element={
                    <ProtectorRoute>
                      <InvoiceList />
                    </ProtectorRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectorRoute>
                      <Settings />
                    </ProtectorRoute>
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<h1>404 Error</h1>} />
              </Routes>
            </Suspense>
          </div>
        </React.Fragment>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;