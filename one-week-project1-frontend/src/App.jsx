import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { Board } from "./page/board/Board.jsx";
import { BoardView } from "./page/board/view/BoardView.jsx";
import { BoardWrite } from "./page/board/write/BoardWrite.jsx";
import { LoginComponent } from "./page/member/login/LoginComponent.jsx";
import { LoginProvider } from "./LoginProvider.jsx";
import { SignupComponent } from "./page/member/signup/SignupComponent.jsx";
import axios from "axios";

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Board /> },
      { path: "/board", element: <Board /> },
      { path: "/board/view/:id", element: <BoardView /> },
      { path: "/board/write", element: <BoardWrite /> },
      { path: "/signup", element: <SignupComponent /> },
      { path: "/login", element: <LoginComponent /> },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  );
}

export default App;
