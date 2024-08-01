import { Button, Flex, Input, Stack } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { TitleBox } from "../../../../css/component/Box/TitleBox.jsx";
import { useState } from "react";

export function BoardComment() {
  const [comment, setComment] = useState("");

  return (
    <Stack>
      <Flex alignItems={"center"} gap={2}>
        <TitleBox>댓글[댓글수]</TitleBox>
        <FontAwesomeIcon size={"xl"} icon={faComments} />
      </Flex>
      <Flex minH={"200px"}>
        <Input
          type={"text"}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <Button>전송버튼</Button>
      </Flex>
    </Stack>
  );
}
