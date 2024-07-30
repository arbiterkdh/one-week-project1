import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { Board } from "./page/board/Board.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BoardView } from "./page/board/view/BoardView.jsx";
import { BoardWrite } from "./page/board/write/BoardWrite.jsx";
import { LoginComponent } from "./page/member/login/LoginComponent.jsx";
import { LoginProvider } from "./LoginProvider.jsx";
import { SignupComponent } from "./page/member/signup/SignupComponent.jsx";

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
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
