import { OuttestBox } from "../../css/component/box/OuttestBox.jsx";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { HeaderBox } from "../../css/component/box/HeaderBox.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../LoginProvider.jsx";

export function Board() {
  const account = useContext(LoginContext);

  const [boardList, setBoardList] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => {
        setBoardList(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setBoardList([]);
        }
        console.log("게시판 리스트 요청중 오류: " + err);
      });
  }, []);

  return (
    <Center>
      {boardList ? (
        <OuttestBox h={"768px"}>
          <Flex alignItems={"center"}>
            <HeaderBox w={"80%"}>자유게시판</HeaderBox>

            <Flex w={"20%"}>
              <Select></Select>
              <Button>검색버튼 만들곳</Button>
            </Flex>
          </Flex>
          <Box h={"600px"}>
            <Table w={"100%"}>
              <Thead>
                <Tr>
                  <Th w={"3%"}>#</Th>
                  <Th w={"5%"}>주제</Th>
                  <Th w={"30%"}>제목</Th>
                  <Th w={"15%"}>글쓴이</Th>
                  <Th w={"9%"}>좋아요</Th>
                  <Th w={"10%"}>조회수</Th>
                  <Th w={"10%"}>작성일시</Th>
                </Tr>
              </Thead>
              <Tbody>
                {boardList.length > 0 ? (
                  boardList.map((board, index) => {
                    let boardType = "";
                    if (board.boardType === "talk") {
                      boardType = "잡담/유머/힐링";
                    } else if (board.boardType === "info") {
                      boardType = "정보/지식공유";
                    } else if (board.boardType === "issue") {
                      boardType = "정치/사회/이슈";
                    } else if (board.boardType === "culture") {
                      boardType = "게임/문화/연예";
                    } else if (board.boardType === "other") {
                      boardType = "기타";
                    }

                    let isModified = false;

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = ("0" + (now.getMonth() + 1)).slice(-2);
                    const day = ("0" + now.getDate()).slice(-2);
                    const hour = ("0" + now.getHours()).slice(-2);
                    const minute = ("0" + now.getMinutes()).slice(-2);
                    const second = ("0" + now.getSeconds()).slice(-2);
                    if (board.boardUpdated !== board.boardInserted) {
                      isModified = true;
                    }
                    return (
                      <Tr key={index}>
                        <Td>{board.boardId}</Td>
                        <Td>
                          <Badge fontSize={"xx-small"}>[{boardType}]</Badge>
                        </Td>
                        <Td
                          onClick={() =>
                            navigate(`/board/view/${board.boardId}`)
                          }
                        >
                          <Flex alignItems={"center"}>
                            <Box>{board.boardTitle}</Box>
                            <Badge>+{board.boardCommentCount}</Badge>
                          </Flex>
                        </Td>
                        <Td fontSize={"small"}>{board.memberNickname}</Td>
                        <Td>{board.boardLikeCount}</Td>
                        <Td>{board.boardViewCount}</Td>
                        <Td fontSize={"small"}>
                          {board.boardInserted}
                          {isModified && "(수정됨)"}
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td></Td>
                    <Td>게시글이 없습니다.</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
          <Box h={"45px"}>
            <Flex justifyContent={"space-between"}>
              <Box></Box>
              {account.isLoggedIn() && (
                <Button onClick={() => navigate("/board/write")}>글쓰기</Button>
              )}
            </Flex>
          </Box>
          <Box border={"1px solid black"} h={"50px"}>
            페이지네이션 할 곳
          </Box>
        </OuttestBox>
      ) : (
        <Spinner size="xl" />
      )}
    </Center>
  );
}
