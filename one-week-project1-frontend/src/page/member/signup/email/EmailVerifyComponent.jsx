import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export function EmailVerifyComponent({
  isVerifyingEmail,
  setIsVerifyingEmail,
  email,
  setIsVerifiedEmail,
}) {
  const toast = useToast();

  const [remainTime, setRemainTime] = useState(5 * 60 * 1000);
  const [inputNumber, setInputNumber] = useState("");
  const [count, setCount] = useState(5);

  let minutes = Math.floor(remainTime / 1000 / 60);
  let seconds = Math.floor((remainTime / 1000) % 60);
  let isExpired = (minutes <= 0 && seconds <= 0) || count === 0;

  useEffect(() => {
    if (isVerifyingEmail) {
      const timer = setInterval(() => {
        setRemainTime((t) => t - 1000);
      }, 1000);
      if (remainTime <= 0) {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }
  }, [isVerifyingEmail]);

  useEffect(() => {
    if (isExpired || count === 0) {
      hasFailedVerifyingEmail();
    }
  }, [isExpired, count]);

  function hasFailedVerifyingEmail() {
    axios
      .delete(`/api/member/signup/verify/delete/${email}`)
      .then((res) => {})
      .catch((err) => {
        console.log("인증번호 삭제 요청중 오류: " + err);
      });
    setIsVerifyingEmail(false);
    setRemainTime(5 * 60 * 1000);
    setCount(5);
    setInputNumber("");
  }

  function handleCheckVerifyNumber() {
    axios
      .post("/api/member/signup/verify/check", {
        email,
        verifyNumber: inputNumber,
      })
      .then((res) => {
        setIsVerifyingEmail(false);
        setIsVerifiedEmail(true);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setCount(count - 1);
          toast({
            status: "warning",
            description: `인증번호가 틀립니다. 남은횟수 ${count - 1}회`,
            position: "bottom-left",
          });
        }
        console.log(err);
      });
  }

  return (
    <Flex>
      <InputGroup>
        <Input
          value={inputNumber}
          placeholder={"인증번호 입력"}
          type={"number"}
          onChange={(e) => setInputNumber(e.target.value.trim())}
        />
        <InputRightElement mr={1} w={"100px"}>
          {minutes +
            " : " +
            (seconds === 0 ? "00" : seconds < 10 ? "0" + seconds : seconds)}
        </InputRightElement>
      </InputGroup>
      <Button isDisabled={isExpired} onClick={handleCheckVerifyNumber}>
        입력
      </Button>
    </Flex>
  );
}
