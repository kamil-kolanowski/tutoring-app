import  {useEffect} from 'react';
import './App.css';
import { Routes, Route, useNavigate } from "react-router";
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Teachers from './components/Teachers/Teachers';
import MyLessons from './components/MyLessons/MyLessons';
import MyProfile from './components/MyProfile/MyProfile';
import AddLesson from './components/AddLesson/AddLesson';
import MyReviews from './components/MyReviews/MyReviews'
import Authenticate from './components/Authenticate/Authenticate';
import { getCookie } from './functions/cookies';
import { db } from './functions/db';
import MyTeachers from './components/MyTeachers/MyTeachers';
import RegisterTeacher from './components/RegisterTeacher/RegisterTeacher';
import AllReviews from './components/AllReviews/AllReviews';


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
            <Route path="/my-teachers" element={<MyTeachers />}/>
            <Route path="/my-profile" element={<MyProfile />}/>
            <Route path="/my-reviews" element={<MyReviews />}/>
            <Route path="/all-reviews" element={<AllReviews />}/>
            <Route path="/add-lesson" element={<AddLesson />}/>
            <Route path="/register-teacher" element={<RegisterTeacher />}/>
            <Route path="/authenticate" element={<Authenticate />}/>
          </Routes>
        </Layout>
  );
}

export default App;
