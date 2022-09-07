import {Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from `${process.env.LOGIN_FORM}`;
import SignUpForm from `${process.env.SIGN_UP_FORM}`;
import CreateYourProfile from `${process.env.CREATE_YOUR_PROFILE}`;
import Home from `${process.env.HOME}`;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <LoginForm /> }></Route>
          <Route path='/signup' element={ <SignUpForm /> }></Route>
          <Route path='/signup/:id' element={ <CreateYourProfile />}></Route>
          <Route path='/home' element={ <Home /> }></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
