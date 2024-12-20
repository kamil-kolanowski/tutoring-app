import './App.css';
import {db} from "./db"
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Teachers from './components/Teachers/Teachers';
import MyLessons from './components/MyLessons/MyLessons';
import MyProfile from './components/MyProfile/MyProfile';
import Login from './components/Login/Login';
import Register from './components/Register/Register'

function App() {
  db.open();
  return (
    <Router> 
      <Layout>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/teachers" element={<Teachers />}/>
        <Route path="/my-lessons" element={<MyLessons />}/>
        <Route path="/my-profile" element={<MyProfile />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
      </Layout>
    </Router>
  );
}

export default App;
