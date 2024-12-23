import  {useEffect} from 'react';
import './App.css';
import { Routes, Route, useNavigate } from "react-router";
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Teachers from './components/Teachers/Teachers';
import MyLessons from './components/MyLessons/MyLessons';
import MyProfile from './components/MyProfile/MyProfile';
// import Login from './components/Login/Login';
// import Register from './components/Register/Register'
import Authenticate from './components/Authenticate/Authenticate';
import { getCookie } from './functions/cookies';
import { db } from './functions/db';


function App() {

  db.open()

  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie("userData")) {
      navigate('/authenticate')
    }
  }, [navigate])
  


  return (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/teachers" element={<Teachers />}/>
            <Route path="/my-lessons" element={<MyLessons />}/>
            <Route path="/my-profile" element={<MyProfile />}/>
            <Route path="/authenticate" element={<Authenticate />}/>
          </Routes>
        </Layout>
  );
}

export default App;
