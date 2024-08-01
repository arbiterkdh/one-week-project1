import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../../LoginProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Center,
  Flex,
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
import { OuttestBox } from "../../../css/component/Box/OuttestBox.jsx";
import { HeaderBox } from "../../../css/component/Box/HeaderBox.jsx";

export function BoardModify() {
  const account = useContext(LoginContext);

  const { boardMemberId, boardId } = useParams();

  const {
    isOpen: boardModifyModalIsOpen,
    onOpen: boardModifyModalOnOpen,
    onClose: boardModifyModalOnClose,
  } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();

  const [board, setBoard] = useState([]);
  const [boardType, setBoardType] = useState("");
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");

  const [clickedButton, setClickedButton] = useState("");

  useEffect(() => {
    if (account.hasAccess(boardMemberId)) {
      axios
        .get(`/api/board/view/${boardId}`)
        .then((res) => {
          setBoard(res.data);
          setBoardType(res.data.boardType);
          setBoardTitle(res.data.boardTitle);
          setBoardContent(res.data.boardContent);
        })
        .catch((err) => {
          console.log("게시물 수정 조회 요청중 오류: " + err);
        });
    } else {
      navigate("/");
      toast({
        status: "error",
        description: "올바르지 못한 요청입니다.",
        position: "bottom-left",
      });
    }
  }, []);

  function handleClickBoardModifyButton() {
    axios
      .put(`/api/board/modify`, {
        boardId,
        boardMemberId: account.id,
        boardType,
        boardTitle,
        boardContent,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "수정되었습니다.",
          position: "bottom-left",
        });
        boardModifyModalOnClose();
        navigate(`/board/view/${boardId}`);
      })
      .catch((err) => {
        console.log("글 수정 요청중 오류: " + err);
      });
  }

  let isAllConditionChecked =
    boardType !== board.boardType ||
    boardTitle !== board.boardTitle ||
    boardContent !== board.boardContent;

  return (
    <Center>
      <OuttestBox>
        <HeaderBox>게시글 수정</HeaderBox>
        <Select
          defaultValue={board.boardType}
          onChange={(e) => {
            setBoardType(e.target.value);
          }}
        >
          <option value="talk">잡답/유머/힐링</option>
          <option value="info">정보/지식공유</option>
          <option value="issue">정치/경제/이슈</option>
          <option value="culture">게임/문화/연예</option>
          <option value="other">기타</option>
        </Select>
        <Input
          placeholder={"제목을 입력해주세요."}
          defaultValue={board.boardTitle}
          onChange={(e) => {
            setBoardTitle(e.target.value);
          }}
        />
        <Textarea
          resize={"none"}
          placeholder={"내용을 입력해주세요."}
          defaultValue={board.boardContent}
          onChange={(e) => {
            setBoardContent(e.target.value);
          }}
        />
        <Flex>
          <Button
            isDisabled={!isAllConditionChecked}
            onClick={() => {
              setClickedButton("modify");
              boardModifyModalOnOpen();
            }}
          >
            수정
          </Button>
          <Button
            onClick={() => {
              setClickedButton("cancel");
              boardModifyModalOnOpen();
            }}
          >
            취소
          </Button>
        </Flex>
      </OuttestBox>
      <Modal isOpen={boardModifyModalIsOpen} onClose={boardModifyModalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {clickedButton === "modify" ? "수정 확인" : "취소 확인"}
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            {clickedButton === "modify"
              ? "이대로 수정하시겠습니까?"
              : "글 수정을 취소하시겠습니까?"}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                if (clickedButton === "modify") {
                  handleClickBoardModifyButton();
                } else {
                  navigate(`/board/view/${boardId}`);
                }
              }}
            >
              확인
            </Button>
            <Button onClick={boardModifyModalOnClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
