import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/SignUp/SignUp";
import StoreProvider from "./store";
import Home from "./Components/Home/Home";
import Auth from "./CommonComponents/Auth/Auth";
import Chat from "./Components/Chat/Chat";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import Setting from "./Components/Setting/Setting";
import Edit from "./Components/Setting/Edit";
import Password from "./Components/Setting/Password";
import ErrorPage from "./CommonComponents/ErrorPage/ErrorPage";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
      <ToastContainer />
        <Routes>
   
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/signUp" element={<SignUp />}></Route>
          <Route path="/:userData" element={<ProfilePage />}></Route>
          <Route path="/:userData/saved" element={<ProfilePage />}></Route>
          <Route
            path="/home"
            element={
              <Auth>
                <Home />
              </Auth>
            }
          ></Route>
          <Route
            path="/chat"
            element={
              <Auth>
                <Chat />
              </Auth>
            }
          ></Route>
          <Route
            path="/account"
            element={
              <Auth>
                <Setting />
              </Auth>
            }
          >
            <Route path="/account/edit" element={<Edit/>}></Route>
            <Route path="/account/password" element={<Password/>}></Route>
          </Route>
          <Route path="/error" element={<ErrorPage />}></Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
