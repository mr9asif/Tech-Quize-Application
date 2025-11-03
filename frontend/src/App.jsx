import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from './pages/Home'; // adjust path as needed

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
