import { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useDispatch } from 'react-redux'
import { setUser, setLogout } from './redux/features/authSlice'
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound/NotFound";
import { Toaster } from 'react-hot-toast';
import EditorPage from "./pages/EditorPage";
function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  useEffect(() => {
    dispatch(setUser(user));
  }, []);
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: '#4aed88',
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <div className="App">
          {/* <Header /> */}
          <ToastContainer />

          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/editor/:roomId"
              element={
                <PrivateRoute>
                  <EditorPage />
                </PrivateRoute>}
            ></Route>
            <Route exact path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
