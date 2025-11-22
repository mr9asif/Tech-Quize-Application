import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from './pages/Home'; // adjust 
// path as needed
import Signup from "./components/Signup";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
  );
};

export default App;
