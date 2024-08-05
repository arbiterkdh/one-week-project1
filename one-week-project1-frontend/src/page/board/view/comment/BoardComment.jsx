import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { TitleBox } from "../../../../css/component/Box/TitleBox.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../../LoginProvider.jsx";
import {
  faCheck,
  faFeatherPointed,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { TooltipButton } from "../../../../css/component/Button/TooltipButton.jsx";

export function BoardComment({ boardId, boardMemberId }) {
  const account = useContext(LoginContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const [commentList, setCommentList] = useState([]);
  const [comment, setComment] = useState("");
  const [isCommentWriting, setIsCommentWriting] = useState(false);

  const [modifyingBoardCommentId, setModifyingBoardCommentId] = useState(-1);
  const [modifyingComment, setModifyingComment] = useState("");

  const [deleteCommentId, setDeleteCommentId] = useState(-1);

  useEffect(() => {
    if (boardId) {
      axios
        .get(`/api/board/comment/${boardId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => {
          console.log("댓글 요청중 오류: " + err);
        });
    }
  }, [isCommentWriting, modifyingBoardCommentId, deleteCommentId]);

  function handleClickSendComment() {
    setIsCommentWriting(true);
    axios
      .post("/api/board/comment/write", {
        boardCommentBoardId: boardId,
        boardCommentMemberId: account.id,
        boardCommentContent: comment,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "댓글이 작성되었습니다.",
          position: "bottom-left",
        });
        setComment("");
      })
      .catch((err) => {
        toast({
          status: "warning",
          description: "댓글 전송중 오류가 발생했습니다.",
          position: "bottom-left",
        });
        console.log("댓글 전송중 오류: " + err);
      })
      .finally(() => setIsCommentWriting(false));
  }

  function handleClickModifyComment(boardCommentContent, boardCommentId) {
    if (modifyingBoardCommentId === -1) {
      setModifyingBoardCommentId(boardCommentId);
      setModifyingComment(boardCommentContent);
    } else {
      axios
        .put("/api/board/comment/modify", {
          boardCommentId,
          boardCommentBoardId: boardId,
          boardCommentMemberId: account.id,
          boardCommentContent,
        })
        .then((res) => {
          setModifyingBoardCommentId(-1);
          toast({
            status: "success",
            description: "댓글이 수정되었습니다.",
            position: "bottom-left",
          });
        })
        .catch((err) => {
          toast({
            status: "warning",
            description: "댓글 수정중 오류가 발생했습니다.",
            position: "bottom-left",
          });
          console.log("댓글 수정중 오류: " + err);
        });
    }
  }

  function handleClickDeleteBoardComment() {
    axios
      .delete(`/api/board/comment/delete/${account.id}/${deleteCommentId}`)
      .then((res) => {
        toast({
          status: "success",
          description: "댓글이 삭제되었습니다.",
          position: "bottom-left",
        });
        setDeleteCommentId(-1);
        onClose();
      })
      .catch((err) => {
        toast({
          status: "warning",
          description: "댓글 삭제중 오류가 발생했습니다.",
          position: "bottom-left",
        });
        console.log("댓글 삭제중 오류: " + err);
      });
  }

  return (
    <Stack>
      <Flex alignItems={"center"} gap={2}>
        <TitleBox>댓글[{commentList.length}]</TitleBox>
        <FontAwesomeIcon size={"xl"} icon={faComments} />
      </Flex>
      <Flex h={"120px"}>
        <Textarea
          type={"text"}
          h={"100px"}
          overflowY={"scroll"}
          placeholder={"댓글 입력"}
          value={comment}
          resize={"none"}
          onChange={(e) => setComment(e.target.value)}
        />
        <TooltipButton
          placement={"top"}
          label={"전송"}
          openDelay={300}
          onClick={handleClickSendComment}
          h={"100px"}
          w={"70px"}
        >
          <FontAwesomeIcon size={"xl"} icon={faFeatherPointed} />
        </TooltipButton>
      </Flex>
      <Stack minH={"200px"}>
        {commentList.map((comment, index) => {
          const isCommentWriter = comment.boardCommentMemberId == boardMemberId;
          const commentNickname = isCommentWriter
            ? comment.memberNickname + "(글쓴이)"
            : comment.memberNickname;

          const now = new Date();
          const commentTime = new Date(comment.boardCommentInserted);

          const diffTime = Math.abs(now - commentTime);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          const diffSeconds = Math.floor(diffTime / 1000);

          let boardCommentInserted = "";

          if (diffMinutes < 1) {
            boardCommentInserted = diffSeconds + "초전";
          } else if (diffHours < 1) {
            boardCommentInserted = diffMinutes + "분전";
          } else if (diffDays < 1) {
            boardCommentInserted = diffHours + "시간전";
          } else {
            boardCommentInserted = comment.boardCommentInserted.slice(0, -9);
          }
          if (comment.boardCommentUpdated !== comment.boardCommentInserted) {
            boardCommentInserted += " (수정됨)";
          }

          return (
            <Box
              key={index}
              minH={"120px"}
              borderRadius={"5px"}
              border={"1px solid"}
            >
              <Flex justifyContent={"space-between"}>
                <Text>{commentNickname}</Text>
                <Text>{boardCommentInserted}</Text>
              </Flex>
              <Flex>
                <Textarea
                  resize={"none"}
                  border={
                    modifyingBoardCommentId === comment.boardCommentId
                      ? "1px solid"
                      : "none"
                  }
                  bg={
                    modifyingBoardCommentId === comment.boardCommentId
                      ? ""
                      : "gray.100"
                  }
                  readOnly={modifyingBoardCommentId !== comment.boardCommentId}
                  value={
                    modifyingBoardCommentId === comment.boardCommentId
                      ? modifyingComment
                      : comment.boardCommentContent
                  }
                  onChange={(e) => setModifyingComment(e.target.value)}
                />
                {account &&
                account.hasAccess(comment.boardCommentMemberId) &&
                modifyingBoardCommentId !== comment.boardCommentId ? (
                  <Stack>
                    <TooltipButton
                      label={"수정"}
                      openDelay={300}
                      size={"sm"}
                      onClick={() =>
                        handleClickModifyComment(
                          comment.boardCommentContent,
                          comment.boardCommentId,
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </TooltipButton>
                    <TooltipButton
                      label={"삭제"}
                      openDelay={300}
                      size={"sm"}
                      onClick={() => {
                        setDeleteCommentId(comment.boardCommentId);
                        onOpen();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </TooltipButton>
                  </Stack>
                ) : (
                  account &&
                  account.hasAccess(comment.boardCommentMemberId) && (
                    <Stack>
                      <TooltipButton
                        label={"확인"}
                        openDelay={300}
                        size={"sm"}
                        onClick={() =>
                          handleClickModifyComment(
                            modifyingComment,
                            comment.boardCommentId,
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </TooltipButton>
                      <TooltipButton
                        label={"취소"}
                        openDelay={300}
                        size={"sm"}
                        onClick={() => {
                          setModifyingBoardCommentId(-1);
                          setModifyingComment("");
                        }}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </TooltipButton>
                    </Stack>
                  )
                )}
              </Flex>
            </Box>
          );
        })}
      </Stack>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setDeleteCommentId(-1);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            댓글 삭제
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleClickDeleteBoardComment}>삭제</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
