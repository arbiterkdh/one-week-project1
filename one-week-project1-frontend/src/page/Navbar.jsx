import { Box, Center, Flex, useToast } from "@chakra-ui/react";
import { NavBox } from "../css/component/box/NavBox.jsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../LoginProvider.jsx";

export function Navbar() {
  const account = useContext(LoginContext);

  const toast = useToast();
  const navigate = useNavigate();

  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      border={"1px solid"}
      bgColor={"white"}
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
            <NavBox onClick={() => navigate("/board")}>종합게시판</NavBox>
            {account.isLoggedIn() && (
              <Box>
                <NavBox onClick={() => navigate("/memberinfo")}>
                  회원정보
                </NavBox>
                <NavBox
                  onClick={() => {
                    account.logout();
                    navigate("/");
                    toast({
                      status: "info",
                      description: "로그아웃되었습니다.",
                      position: "bottom-right",
                    });
                  }}
                >
                  로그아웃
                </NavBox>
              </Box>
            )}
            {!account.isLoggedIn() && (
              <Box>
                <NavBox onClick={() => navigate("/signup")}>회원가입</NavBox>
                <NavBox onClick={() => navigate("/login")}>로그인</NavBox>
              </Box>
            )}
          </Flex>
        </Box>
      </Center>
    </Box>
  );
}
