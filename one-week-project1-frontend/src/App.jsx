import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { Board } from "./page/board/Board.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BoardView } from "./page/board/view/BoardView.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Board /> },
      { path: "/board", element: <Board /> },
      { path: "/board/view/:id", element: <BoardView /> },
    ],
  },
]);

function App() {
  return (
    <>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </>
  );
}

export default App;
