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
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/box/OuttestBox.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BoardComment } from "./comment/BoardComment.jsx";
import { TitleBox } from "../../../css/component/box/TitleBox.jsx";
import {
  faCommentDots,
  faEye,
  faThumbsUp as solidThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoginContext } from "../../../LoginProvider.jsx";

export function BoardView() {
  const account = useContext(LoginContext);

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

  const [liked, setLiked] = useState(false);
  const [mouseOnLikeButton, setMouseOnLikeButton] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/board/view/${boardId}`)
      .then((res) => {
        setBoard(res.data);
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
  }, []);

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
            description: "요청 처리중 오류가 발생했습니다.",
            position: "bottom-left",
          });
        }
        console.log("삭제 요청중 오류: " + err);
      });
  }

  function handleClickLikeButton() {
    axios
      .post("/api/board/like", {
        boardId: board.boardId,
        boardMemberId: account.id,
      })
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        console.log("좋아요 버튼 요청중 오류: " + err);
      });
  }

  return (
    <Center>
      {board ? (
        <OuttestBox>
          <Box minH={"640px"}>
            <Badge>{boardType}</Badge>
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
                <Box>{board.memberNickname}</Box>
              </Box>
              <Flex w={"40%"} justifyContent={"space-around"}>
                <Flex alignItems={"center"}>
                  <FontAwesomeIcon opacity={"0.6"} h={"30px"} icon={faEye} />
                  <Box h={"30px"}>{board.boardViewCount}</Box>
                </Flex>
                <Flex alignItems={"center"}>
                  <FontAwesomeIcon opacity={"0.6"} icon={faCommentDots} />
                  <Box>댓글수</Box>
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
              <Box
                m={2}
                align={"center"}
                alignContent={"center"}
                w={"80px"}
                h={"80px"}
                rounded={"full"}
                cursor={"pointer"}
                border={"1px solid"}
                onClick={() => {
                  setLiked(!liked);
                  handleClickLikeButton();
                }}
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
              </Box>
            </Center>
          </Box>
          {account.hasAccess(board.boardMemberId) && (
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
          <BoardComment />
        </OuttestBox>
      ) : (
        <Spinner size="xl" />
      )}
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
