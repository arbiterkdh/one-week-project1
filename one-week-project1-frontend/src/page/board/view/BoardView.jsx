import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/Box/OuttestBox.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BoardComment } from "./comment/BoardComment.jsx";
import { TitleBox } from "../../../css/component/Box/TitleBox.jsx";
import {
  faCommentDots,
  faEye,
  faThumbsUp as solidThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../../LoginProvider.jsx";
import { CursorBox } from "../../../css/component/Box/CursorBox.jsx";

export function BoardView() {
  const account = useContext(LoginContext);
  const location = useLocation();

  const { boardId } = useParams();

  const {
    isOpen: boardDeleteModalIsOpen,
    onOpen: boardDeleteModalOnOpen,
    onClose: boardDeleteModalOnClose,
  } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [boardType, setBoardType] = useState("");
  const [boardInserted, setBoardInserted] = useState("");

  const [liked, setLiked] = useState(false);
  const [mouseOnLikeButton, setMouseOnLikeButton] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/board/view/${boardId}`)
      .then((res) => {
        setBoard(res.data);
        setLiked(res.data.isLikedByMemberId);
        if (res.data.boardType === "talk") {
          setBoardType("잡담/유머/힐링");
        } else if (res.data.boardType === "info") {
          setBoardType("정보/지식공유");
        } else if (res.data.boardType === "issue") {
          setBoardType("정치/사회/이슈");
        } else if (res.data.boardType === "culture") {
          setBoardType("게임/문화/연예");
        } else if (res.data.boardType === "other") {
          setBoardType("기타");
        }
      })
      .catch((err) => {
        console.log("게시물 조회 요청중 오류: " + err);
      });

    if (location.state && location.state.boardInserted) {
      setBoardInserted(location.state.boardInserted);
    }
  }, [location.state]);

  function handleClickDeleteBoard() {
    axios
      .delete(`/api/board/delete/${account.id}/${boardId}`)
      .then((res) => {
        toast({
          status: "success",
          description: "안전하게 삭제되었습니다.",
          position: "bottom-left",
        });
        boardDeleteModalOnClose();
        navigate(`/board`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "삭제 요청 처리중 오류가 발생했습니다.",
            position: "bottom-left",
          });
        }
        console.log("삭제 요청중 오류: " + err);
      });
  }

  function handleClickLikeButton() {
    if (account.isLoggedIn()) {
      setLiked(!liked);
      axios
        .post("/api/board/like", {
          boardId: board.boardId,
          boardMemberId: account.id,
        })
        .then((res) => {
          setBoard(res.data);
        })
        .catch((err) => {
          setLiked(!liked);
          console.log("좋아요 버튼 요청중 오류: " + err);
        });
    } else {
      toast({
        status: "warning",
        description: "로그인이 필요한 서비스입니다.",
        position: "bottom-left",
      });
    }
  }

  return (
    <Center>
      <OuttestBox>
        {board ? (
          <Box minH={"640px"}>
            <Flex justifyContent={"space-between"}>
              <Badge>{boardType}</Badge>
              <Text fontSize={"xs"}>작성일시: {boardInserted}</Text>
            </Flex>
            <TitleBox p={2} m={1}>
              {board.boardTitle}
            </TitleBox>
            <Flex
              p={2}
              h={"35px"}
              alignItems={"center"}
              bgColor={"blackAlpha.200"}
            >
              <Box w={"60%"}>
                <CursorBox>{board.memberNickname}</CursorBox>
              </Box>
              <Flex w={"40%"} justifyContent={"space-around"}>
                <Flex alignItems={"center"}>
                  <FontAwesomeIcon opacity={"0.6"} h={"30px"} icon={faEye} />
                  <Box h={"30px"}>{board.boardViewCount}</Box>
                </Flex>
                <Flex alignItems={"center"}>
                  <FontAwesomeIcon opacity={"0.6"} icon={faCommentDots} />
                  <Box>{board.boardCommentCount}</Box>
                </Flex>
                <Flex alignItems={"center"}>
                  <FontAwesomeIcon opacity={"0.6"} icon={solidThumbsUp} />
                  <Box>{board.boardLikeCount}</Box>
                </Flex>
              </Flex>
            </Flex>
            <Textarea
              resize={"none"}
              minH={"500px"}
              value={board.boardContent}
              readOnly
            />
            <Center>
              <CursorBox
                m={2}
                align={"center"}
                alignContent={"center"}
                w={"80px"}
                h={"80px"}
                rounded={"full"}
                border={"2px solid"}
                onClick={() => handleClickLikeButton()}
                onMouseEnter={() => setMouseOnLikeButton(true)}
                onMouseLeave={() => setMouseOnLikeButton(false)}
              >
                {liked &&
                  (mouseOnLikeButton ? (
                    <FontAwesomeIcon size={"3x"} icon={regularThumbsUp} />
                  ) : (
                    <FontAwesomeIcon size={"3x"} icon={solidThumbsUp} />
                  ))}
                {!liked &&
                  (mouseOnLikeButton ? (
                    <FontAwesomeIcon size={"3x"} icon={solidThumbsUp} />
                  ) : (
                    <FontAwesomeIcon size={"3x"} icon={regularThumbsUp} />
                  ))}
              </CursorBox>
            </Center>
          </Box>
        ) : (
          <Box minH={"640px"}>
            <Flex>
              <Badge>
                loading...
                <Spinner size={"xs"} />
              </Badge>
            </Flex>
            <TitleBox p={2} m={1}>
              Loading...
            </TitleBox>
            <Flex p={2} h={"35px"} bgColor={"blackAlpha.200"} />
            <Box
              minH={"500px"}
              borderRadius={"5px"}
              border={"1px solid lightgray"}
            >
              <Spinner />
            </Box>
            <Center>
              <Box
                m={2}
                align={"center"}
                alignContent={"center"}
                w={"80px"}
                h={"80px"}
                rounded={"full"}
                border={"1px solid"}
              >
                <FontAwesomeIcon size={"3x"} icon={regularThumbsUp} />
              </Box>
            </Center>
          </Box>
        )}
        {board && account.hasAccess(board.boardMemberId) && (
          <Flex justifyContent={"end"}>
            <Button
              onClick={() =>
                navigate(`/board/modify/${board.boardMemberId}/${boardId}`)
              }
            >
              수정
            </Button>
            <Button onClick={boardDeleteModalOnOpen}>삭제</Button>
          </Flex>
        )}
        {board && (
          <BoardComment boardId={boardId} boardMemberId={board.boardMemberId} />
        )}
      </OuttestBox>

      <Modal isOpen={boardDeleteModalIsOpen} onClose={boardDeleteModalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            삭제 확인
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleClickDeleteBoard}>삭제</Button>
            <Button onClick={boardDeleteModalOnClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
