import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";

export function Home() {
  return (
    <Box>
      <Navbar />
      <Box mt={"100px"}>
        <Outlet />
      </Box>
    </Box>
  );
}
