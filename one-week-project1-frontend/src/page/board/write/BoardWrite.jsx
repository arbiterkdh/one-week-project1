import {
  Box,
  Button,
  Center,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/box/OuttestBox.jsx";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const account = useContext(LoginContext);

  const {
    isOpen: uploadModalIsOpen,
    onOpen: uploadModalOnOpen,
    onClose: uploadModalOnClose,
  } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();

  const [boardType, setBoardType] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");

  useEffect(() => {
    if (!account.isLoggedIn()) {
      navigate("/");
      toast({
        status: "warning",
        description: "로그인이 필요한 서비스입니다.",
        position: "bottom-left",
      });
    }
  }, []);

  function handleUploadBoardWrite() {
    axios
      .postForm("/api/board/write/upload", {
        boardMemberId: account.id,
        boardType,
        boardTitle,
        boardContent,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "글이 등록되었습니다.",
          position: "bottom-left",
        });
        navigate(`/board/view/${res.data.boardId}`);
      })
      .catch((err) => {
        console.log("글 업로드 요청중 오류: " + err);
      });
  }

  let isAllConditionChecked = boardType && boardTitle && boardContent;

  return (
    <Center>
      <OuttestBox>
        <Select
          onChange={(e) => setBoardType(e.target.value)}
          value={boardType}
          placeholder={"글 종류"}
        >
          <option value={"talk"}>잡담/유머/힐링</option>
          <option value={"info"}>정보/지식공유</option>
          <option value={"issue"}>정치/경제/이슈</option>
          <option value={"culture"}>게임/문화/연예</option>
          <option value={"other"}>기타</option>
        </Select>
        <Input
          type={"text"}
          placeholder={"제목을 입력해주세요."}
          onChange={(e) => setBoardTitle(e.target.value)}
          value={boardTitle}
        />
        <Textarea
          minH={"800px"}
          placeholder={"내용을 입력해주세요."}
          resize={"none"}
          onChange={(e) => setBoardContent(e.target.value)}
          value={boardContent}
        />
        <Button>글 임시저장 불러올곳</Button>
        <Button>글 임시저장 만들곳</Button>
        <Button
          isDisabled={!isAllConditionChecked}
          onClick={() => uploadModalOnOpen()}
        >
          글 업로드 만들곳
        </Button>
      </OuttestBox>
      <Modal isOpen={uploadModalIsOpen} onClose={uploadModalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box>업로드 확인</Box>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>이대로 업로드하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={() => uploadModalOnClose()}>취소</Button>
            <Button onClick={() => handleUploadBoardWrite()}>확인</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
