import { Outlet, Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './components/Login Page/LoginForm';
import SignUpForm from './components/Sign Up Page/SignUpForm';
import CreateYourProfile from './components/Sign Up Page/CreateYourProfile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <LoginForm /> }></Route>
          <Route path='/signup' element={ <SignUpForm /> }></Route>
          <Route path='/signup/:id' element={ <CreateYourProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
