import { Box, Center, Flex } from "@chakra-ui/react";
import { NavBox } from "../css/component/box/NavBox.jsx";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      border={"1px solid"}
    >
      <Center>
        <Box
          w={"100%"}
          h={"80px"}
          alignContent={"center"}
          paddingInline={"20px"}
        >
          <Flex justifyContent={"space-between"}>
            <NavBox onClick={() => navigate("/")}>7판</NavBox>
            <NavBox onClick={() => navigate("/board")}>게시판</NavBox>
            <NavBox onClick={() => navigate("/memberinfo")}>회원정보</NavBox>
            <NavBox onClick={() => navigate("/signup")}>회원가입</NavBox>
            <NavBox onClick={() => navigate("/login")}>로그인</NavBox>
            <NavBox onClick={() => navigate("/logout")}>로그아웃</NavBox>
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
