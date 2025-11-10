import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";
import Home from "./page/home";

function App() {
  return (
    <BrowserRouter>
      <Routes
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
