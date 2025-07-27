
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import { DashboardPage } from './pages/Dashboardpage';
import Forgotpassword from './pages/Forgotpassword';
import Aboutpage from './pages/Aboutpage';
import Contactpage from './pages/Contactpage';




export default function App(){
  return (
    <>

 <Router>
        <Routes>
            <Route path='/' element={<Homepage/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/dashboard' element={<DashboardPage/>}></Route>
            <Route path='/forgotpassword' element={<Forgotpassword/>}></Route>
            <Route path='/about' element={<Aboutpage/>}></Route>
            <Route path='/contact' element={<Contactpage/>}></Route>






        </Routes>

    </Router>
    </>
    );
}


