import { OuttestBox } from "../../css/component/Box/OuttestBox.jsx";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Highlight,
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
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderBox } from "../../css/component/Box/HeaderBox.jsx";
import { SmallButton } from "../../css/component/Button/SmallButton.jsx";
import { ClickableTh } from "../../css/component/Table/Thead/Th/ClickableTh.jsx";

export function Board() {
  const account = useContext(LoginContext);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState([]);
  const [boardType, setBoardType] = useState(
    searchParams.get("boardType") ? searchParams.get("boardType") : "general",
  );
  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") ? searchParams.get("page") : 1,
  );
  const [selected, setSelected] = useState(
    searchParams.get("type") ? searchParams.get("type") : "all",
  );
  const [keyword, setKeyword] = useState(
    searchParams.get("keyword") ? searchParams.get("keyword") : "",
  );

  const [isSearched, setIsSearched] = useState(!!keyword);
  const [isSearchedKeyword, setIsSearchedKeyword] = useState(
    keyword ? keyword : "",
  );

  const [sortType, setSortType] = useState(
    searchParams.get("sortType") ? searchParams.get("sortType") : "none",
  );
  const [sortState, setSortState] = useState(
    searchParams.get("sortState") ? searchParams.get("sortState") : "none",
  );
  const [sortCount, setSortCount] = useState(0);

  const [isGetting, setIsGetting] = useState(false);

  useEffect(() => {
    setIsGetting(true);
    axios
      .get(`/api/board/list?${searchParams}`)
      .then((res) => {
        setBoardList(res.data.boardList);
        setPageInfo(res.data.pageInfo);
        setCurrentPage(searchParams.get("page"));
        if (!searchParams.get("sortType")) {
          setSortType("none");
        }
        if (!searchParams.get("boardType")) {
          setBoardType("general");
        }
        if (!searchParams.get("keyword")) {
          setSelected("all");
          setKeyword("");
          setIsSearchedKeyword("");
        } else {
          setKeyword(searchParams.get("keyword"));
          setIsSearchedKeyword(searchParams.get("keyword"));
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
      })
      .finally(() => setIsGetting(false));
  }, [searchParams]);

  function handleClickSearch(boardType, searchType, searchKeyword) {
    if (searchKeyword.trim() === "") {
      return;
    }
    setIsSearched(true);
    setIsSearchedKeyword(searchKeyword);
    navigate(
      `/?type=${searchType}&keyword=${searchKeyword}&boardType=${boardType}`,
    );
  }

  function handleClickPageNumber(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/?${searchParams}`);
  }

  function handleClickBoardType(boardType) {
    searchParams.set("page", 1);
    searchParams.set("boardType", boardType);
    setBoardType(boardType);
    navigate(`/?${searchParams}`);
  }

  function handleClickBoardSort(sortCount, type) {
    let prevType = sortType;
    let count;
    if (prevType === type) {
      count = (sortCount + 1) % 3;
    } else {
      count = 1;
    }
    if (count === 0) {
      searchParams.set("sortState", "none");
      setSortState("none");
    } else if (count === 1) {
      searchParams.set("sortState", "up");
      setSortState("up");
    } else if (count === 2) {
      searchParams.set("sortState", "down");
      setSortState("down");
    }
    searchParams.set("page", 1);
    searchParams.set("sortType", type);
    setSortCount(count);
    setSortType(type);
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
                <Button onClick={() => handleClickBoardType("talk")}>
                  잡담/유머/힐링
                </Button>
                <Button onClick={() => handleClickBoardType("info")}>
                  정보/지식공유
                </Button>
                <Button onClick={() => handleClickBoardType("issue")}>
                  정치/경제/이슈
                </Button>
                <Button onClick={() => handleClickBoardType("culture")}>
                  게임/문화/연예
                </Button>
                <Button onClick={() => handleClickBoardType("other")}>
                  기타
                </Button>
              </Flex>
            </Flex>
          </Flex>
          <Box minH={"620px"}>
            <Table w={"100%"} my={1}>
              <Thead>
                <Tr>
                  <Th w={"9%"}>#</Th>
                  <Th w={"14%"}>주제</Th>
                  <Th w={"25%"}>제목</Th>
                  <Th w={"15%"}>글쓴이</Th>
                  <ClickableTh
                    w={"9%"}
                    onClick={() => handleClickBoardSort(sortCount, "like")}
                  >
                    좋아요
                    {sortState === "none" && sortType !== "date" && <FontAwesomeIcon icon={faSort} />}
                  </ClickableTh>
                  <ClickableTh
                    w={"10%"}
                    onClick={() => handleClickBoardSort(sortCount, "view")}
                  >
                    조회수
                    {sortState === "none" && <FontAwesomeIcon icon={faSort} />}
                  </ClickableTh>
                  <Th w={"11%"}>작성일시</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isGetting ? (
                  <Spinner size={"lg"} />
                ) : boardList.length > 0 ? (
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
                          <Badge
                            cursor={"pointer"}
                            onClick={() =>
                              handleClickBoardType(board.boardType)
                            }
                            fontSize={"xx-small"}
                          >
                            [{boardType}]
                          </Badge>
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
                              {isSearched ? (
                                <Highlight
                                  query={isSearchedKeyword}
                                  styles={{
                                    px: "1",
                                    py: "1",
                                    bg: "orange.100",
                                  }}
                                >
                                  {board.boardTitle}
                                </Highlight>
                              ) : (
                                <Box>{board.boardTitle}</Box>
                              )}
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
                          <Box>{boardInserted}</Box>
                          <Box>{isModified && "(수정됨)"}</Box>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClickSearch(boardType, selected, keyword);
                  }
                }}
              />
              <SmallButton
                w={"10%"}
                isDisabled={!keyword}
                onClick={() => handleClickSearch(boardType, selected, keyword)}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </SmallButton>
            </Flex>
            <Flex gap={1}>
              {currentPage > 3 && (
                <SmallButton
                  onClick={() => {
                    handleClickPageNumber(1);
                  }}
                >
                  <FontAwesomeIcon size={"xs"} icon={faBackwardFast} />
                </SmallButton>
              )}
              {currentPage > 1 && (
                <SmallButton
                  onClick={() => {
                    handleClickPageNumber(pageInfo.prevPageNumber);
                  }}
                >
                  <FontAwesomeIcon icon={faCaretLeft} />
                </SmallButton>
              )}
              {pageNumbers.map((pageNumber, index) => {
                return (
                  <SmallButton
                    key={index}
                    color={pageNumber == currentPage ? "red.500" : ""}
                    fontWeight={pageNumber == currentPage ? "600" : ""}
                    onClick={() => {
                      handleClickPageNumber(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </SmallButton>
                );
              })}
              {currentPage < pageInfo.endPageNumber && (
                <SmallButton
                  onClick={() => {
                    handleClickPageNumber(pageInfo.nextPageNumber);
                  }}
                >
                  <FontAwesomeIcon icon={faCaretRight} />
                </SmallButton>
              )}
              {currentPage < pageInfo.endPageNumber - 2 && (
                <SmallButton
                  onClick={() => {
                    handleClickPageNumber(pageInfo.endPageNumber);
                  }}
                >
                  <FontAwesomeIcon size={"xs"} icon={faForwardFast} />
                </SmallButton>
              )}
            </Flex>
            {account.isLoggedIn() ? (
              <Flex w={"300px"} justifyContent={"end"}>
                <SmallButton
                  h={"30px"}
                  w={"60px"}
                  onClick={() => navigate("/board/write")}
                >
                  글쓰기
                </SmallButton>
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
