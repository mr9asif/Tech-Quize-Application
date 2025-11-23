import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Home from './pages/Home'; // adjust 
// path as needed
import Myresult from "./components/Myresult";
import Signup from "./components/Signup";

// protected route
function RequiredAuth({children}){
  const isLogin = Boolean(localStorage.getItem('authToken'));
  const location = useLocation();

  if(!isLogin){
  return <Navigate to="/login" state={{from:location}} replace></Navigate>
}
return children;
}



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/result" element={
        <RequiredAuth>
         <Myresult></Myresult>
        </RequiredAuth>
      } />
    </Routes>
  );
};

export default App;
