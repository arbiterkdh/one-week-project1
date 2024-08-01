import { OuttestBox } from "../../css/component/box/OuttestBox.jsx";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../../LoginProvider.jsx";
import {
  faBackwardFast,
  faCaretLeft,
  faCaretRight,
  faForwardFast,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderBox } from "../../css/component/box/HeaderBox.jsx";

export function Board() {
  const account = useContext(LoginContext);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(undefined);

  const [selected, setSelected] = useState("all");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    axios
      .get(`/api/board/list?${searchParams}`)
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
        setCurrentPage(searchParams.get("page"));
        if (!searchParams.get("keyword")) {
          setSelected("all");
          setKeyword("");
        }
        if (!searchParams.get("page")) {
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setBoardList([]);
        }
        console.log("게시판 리스트 요청중 오류: " + err);
      });
  }, [searchParams]);

  function handleClickSearch(searchType, searchKeyword) {
    navigate(`/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handleClickPageNumber(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/?${searchParams}`);
  }

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Center>
      {boardList ? (
        <OuttestBox minH={"768px"}>
          <Flex alignItems={"center"} gap={1}>
            <Flex w={"100%"} justifyContent={"space-between"} gap={1}>
              <HeaderBox w={"35%"}>종합게시판</HeaderBox>
              <Flex w={"65%"} gap={1} alignItems={"center"}>
                <Button>잡담/유머/힐링</Button>
                <Button>정보/지식공유</Button>
                <Button>정치/경제/이슈</Button>
                <Button>게임/문화/연예</Button>
                <Button>기타</Button>
              </Flex>
            </Flex>
          </Flex>
          <Box h={"620px"}>
            <Table w={"100%"}>
              <Thead>
                <Tr>
                  <Th w={"3%"}>#</Th>
                  <Th w={"7%"}>주제</Th>
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

                    if (board.boardUpdated !== board.boardInserted) {
                      isModified = true;
                    }

                    const now = new Date();
                    const boardTime = new Date(board.boardInserted);

                    const diffTime = Math.abs(now - boardTime);
                    const diffDays = Math.floor(
                      diffTime / (1000 * 60 * 60 * 24),
                    );
                    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                    const diffMinutes = Math.floor(diffTime / (1000 * 60));
                    const diffSeconds = Math.floor(diffTime / 1000);

                    let boardInserted = "";

                    if (diffMinutes < 1) {
                      boardInserted = diffSeconds + "초 전";
                    } else if (diffHours < 1) {
                      boardInserted = diffMinutes + "분 전";
                    } else if (diffDays < 1) {
                      boardInserted = diffHours + "시간 전";
                    } else {
                      boardInserted = board.boardInserted.slice(0, -9);
                    }

                    return (
                      <Tr key={index}>
                        <Td>{board.boardId}</Td>
                        <Td>
                          <Badge fontSize={"xx-small"}>[{boardType}]</Badge>
                        </Td>
                        <Td>
                          <Flex alignItems={"center"}>
                            <Box
                              fontSize={"small"}
                              cursor={"pointer"}
                              onClick={() => {
                                navigate(`/board/view/${board.boardId}`);
                              }}
                            >
                              {board.boardTitle}
                            </Box>
                            <Badge>+{board.boardCommentCount}</Badge>
                          </Flex>
                        </Td>
                        <Td fontSize={"small"} cursor={"pointer"}>
                          {board.memberNickname}
                        </Td>
                        <Td fontSize={"small"}>{board.boardLikeCount}</Td>
                        <Td fontSize={"small"}>{board.boardViewCount}</Td>
                        <Td fontSize={"small"}>
                          {boardInserted}
                          {isModified && "(수정됨)"}
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td></Td>
                    <Td></Td>
                    <Td fontSize={"small"}>게시글이 없습니다.</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Flex w={"300px"} gap={1}>
              <Select
                size={"sm"}
                w={"40%"}
                fontSize={"sm"}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="titleOrContent">제목+내용</option>
                <option value="nickname">글쓴이</option>
              </Select>
              <Input
                w={"50%"}
                size={"sm"}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button
                w={"10%"}
                size={"sm"}
                isDisabled={!keyword}
                onClick={() => handleClickSearch(selected, keyword)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Flex>
            <Flex gap={1}>
              {currentPage > 3 && (
                <Button
                  size={"sm"}
                  onClick={() => {
                    handleClickPageNumber(1);
                  }}
                >
                  <FontAwesomeIcon size={"xs"} icon={faBackwardFast} />
                </Button>
              )}
              {currentPage > 1 && (
                <Button
                  size={"sm"}
                  onClick={() => {
                    handleClickPageNumber(pageInfo.prevPageNumber);
                  }}
                >
                  <FontAwesomeIcon icon={faCaretLeft} />
                </Button>
              )}
              {pageNumbers.map((pageNumber, index) => {
                return (
                  <Button
                    size={"sm"}
                    key={index}
                    color={pageNumber == currentPage ? "red.500" : ""}
                    fontWeight={pageNumber == currentPage ? "600" : ""}
                    onClick={() => {
                      handleClickPageNumber(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
              {currentPage < pageInfo.endPageNumber && (
                <Button
                  size={"sm"}
                  onClick={() => {
                    handleClickPageNumber(pageInfo.nextPageNumber);
                  }}
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </Button>
              )}
              {currentPage < pageInfo.endPageNumber - 2 && (
                <Button
                  size={"sm"}
                  onClick={() => {
                    handleClickPageNumber(pageInfo.endPageNumber);
                  }}
                >
                  <FontAwesomeIcon size={"xs"} icon={faForwardFast} />
                </Button>
              )}
            </Flex>
            {account.isLoggedIn() ? (
              <Flex w={"300px"} justifyContent={"end"}>
                <Button
                  h={"30px"}
                  w={"60px"}
                  size={"sm"}
                  onClick={() => navigate("/board/write")}
                >
                  글쓰기
                </Button>
              </Flex>
            ) : (
              <Box w={"300px"} />
            )}
          </Flex>
        </OuttestBox>
      ) : (
        <Spinner size="xl" />
      )}
    </Center>
  );
}
