import { Box, Center, Flex, Spinner, Textarea } from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/box/OuttestBox.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BoardCommentComponent } from "./comment/BoardCommentComponent.jsx";
import { TitleBox } from "../../../css/component/box/TitleBox.jsx";
import {
  faCommentDots,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardView() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/board/view/${id}`)
      .then((res) => {
        setBoard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Center>
      {board ? (
        <OuttestBox>
          <Box minH={"640px"}>
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
                  <FontAwesomeIcon opacity={"0.6"} icon={faThumbsUp} />
                  <Box>{board.boardLikeCount}</Box>
                </Flex>
              </Flex>
            </Flex>
            <Textarea resize={"none"} minH={"500px"} readOnly>
              {board.boardContent}
            </Textarea>
          </Box>
          <BoardCommentComponent />
        </OuttestBox>
      ) : (
        <Spinner size="xl" />
      )}
    </Center>
  );
}
