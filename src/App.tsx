import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes element={<Layout><Outlet /></Layout>}>
        <Route
          path="/"
          element={
            
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <h1>About</h1>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
