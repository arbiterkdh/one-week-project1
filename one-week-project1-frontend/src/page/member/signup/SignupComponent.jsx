import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/Box/OuttestBox.jsx";
import { HeaderBox } from "../../../css/component/Box/HeaderBox.jsx";
import { useContext, useEffect, useState } from "react";
import { CounterBox } from "../../../css/component/Box/CounterBox.jsx";
import { EmailVerifyComponent } from "./email/EmailVerifyComponent.jsx";
import axios from "axios";
import {
  faEye as emptyEye,
  faEyeSlash as emptyEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEye as fullEye,
  faEyeSlash as fullEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../LoginProvider.jsx";

export function SignupComponent() {
  const account = useContext(LoginContext);

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [address, setAddress] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [domain, setDomain] = useState("");

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const [isTrySending, setIsTrySending] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [canShow, setCanShow] = useState(false);
  const [eye, setEye] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  let passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*_\-+=])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*_\-+=]{8,15}$/;
  let nicknameRegex = /^[가-힣0-9]{2,10}$/;

  useEffect(() => {
    if (selectedDomain !== "") {
      setDomain(selectedDomain);
    } else {
      setDomain("");
    }
  }, [selectedDomain]);

  function handleSendVerifyNumber(email) {
    axios
      .post("/api/member/signup/email/send", { email })
      .then(() => {
        toast({
          status: "info",
          description: "인증번호가 전송되었습니다. 이메일을 확인해주세요",
          position: "bottom-left",
        });
      })
      .catch((err) => {
        console.log("이메일 전송 요청중 오류: " + err);
        setIsVerifyingEmail(false);
      })
      .finally(() => {
        setIsTrySending(false);
        setResetTimer(false);
      });
  }

  async function handleClickRequestEmailVerifying() {
    setIsTrySending(true);

    try {
      await axios.post("/api/member/signup/email/check", {
        email: address + "@" + domain,
      });
      setIsVerifyingEmail(true);
      handleSendVerifyNumber(address + "@" + domain);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast({
          status: "warning",
          description: "유효하지 않은 이메일입니다.",
          position: "bottom-left",
        });
      } else if (err.response && err.response.status === 409) {
        toast({
          status: "warning",
          description: "이미 사용중인 이메일입니다.",
          position: "bottom-left",
        });
      } else if (err.response && err.response.status === 406) {
        setIsVerifyingEmail(true);
        setResetTimer(true);
        handleSendVerifyNumber(address + "@" + domain);
      } else {
        console.error(err);
      }
      if (err.response && err.response.status !== 406) {
        setIsTrySending(false);
      }
    }
  }

  function handleCheckNickname() {
    axios
      .get(`/api/member/signup/nickname/check/${nickname}`)
      .then(() => {
        toast({
          status: "success",
          description: "사용 가능한 별명입니다.",
          position: "bottom-left",
        });
        setIsNicknameChecked(true);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          toast({
            status: "warning",
            description: "이미 사용중인 별명입니다.",
            position: "bottom-left",
          });
        }
      });
  }

  function handleSignup() {
    axios
      .post("/api/member/signup", {
        memberEmail: address + "@" + domain,
        memberNickname: nickname,
        memberPassword: password,
      })
      .then(() => {
        toast({
          status: "success",
          description: `회원이 되신걸 환영합니다, ${nickname}님.😄`,
          position: "bottom-left",
        });
        axios
          .post("/api/member/login/token", {
            memberEmail: address + "@" + domain,
            memberPassword: password,
          })
          .then((res) => {
            account.login(res.data.token);
            navigate("/");
          });
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원가입중 문제가 발생하였습니다.",
          position: "bottom-left",
        });
      })
      .finally(() => {
        setAddress("");
        setDomain("");
        setPassword("");
        setPasswordCheck("");
        setNickname("");
        onClose();
      });
  }

  let isPasswordChecked =
    password === passwordCheck && password.match(passwordRegex);
  let allChecked =
    isPasswordChecked && nickname.match(nicknameRegex) && isNicknameChecked;

  return (
    <Center>
      <OuttestBox>
        <HeaderBox>회원가입</HeaderBox>
        <Stack minH={"480px"}>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            {isVerifiedEmail ? (
              <InputGroup>
                <Input value={address + "@" + domain} isDisabled />
                <InputRightElement w={"200px"} opacity={"0.7"}>
                  인증되었습니다.
                </InputRightElement>
              </InputGroup>
            ) : (
              <Flex>
                <InputGroup>
                  <Input
                    type={"text"}
                    placeholder={"이메일"}
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                  <InputRightElement>@</InputRightElement>
                </InputGroup>

                <Select
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  value={selectedDomain}
                >
                  <option value="">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="kakao.com">kakao.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="daum.net">daum.net</option>
                  <option value="nate.com">nate.com</option>
                  <option value="hotmail.com">hotmail.com</option>
                </Select>
                <Input
                  type={"text"}
                  placeholder={"직접입력"}
                  onChange={(e) => setDomain(e.target.value)}
                  value={domain}
                  isDisabled={selectedDomain !== ""}
                />
                <Button
                  w={"200px"}
                  isDisabled={address === "" || domain === "" || isTrySending}
                  onClick={handleClickRequestEmailVerifying}
                >
                  {isTrySending ? (
                    <Spinner />
                  ) : isVerifyingEmail ? (
                    "재전송"
                  ) : (
                    "이메일인증"
                  )}
                </Button>
              </Flex>
            )}
            {isVerifyingEmail && (
              <CounterBox h={"42px"}>
                <EmailVerifyComponent
                  resetTimer={resetTimer}
                  setResetTimer={setResetTimer}
                  isVerifyingEmail={isVerifyingEmail}
                  setIsVerifyingEmail={setIsVerifyingEmail}
                  email={address + "@" + domain}
                  setIsVerifiedEmail={setIsVerifiedEmail}
                />
              </CounterBox>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>
              비밀번호 (영어 대/소문자 구분, 특수문자 !@#$%^*_-+= 입력 가능)
            </FormLabel>
            <InputGroup>
              <Input
                isDisabled={!isVerifiedEmail}
                type={canShow ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.trim());
                }}
              />
              <InputRightElement
                onMouseEnter={() => setEye(true)}
                onMouseLeave={() => setEye(false)}
                onClick={() => {
                  setCanShow(!canShow);
                }}
              >
                {canShow && (
                  <Box>
                    {eye || <FontAwesomeIcon icon={emptyEye} />}
                    {eye && <FontAwesomeIcon icon={fullEye} />}
                  </Box>
                )}
                {canShow || (
                  <Box>
                    {eye || <FontAwesomeIcon icon={emptyEyeSlash} />}
                    {eye && <FontAwesomeIcon icon={fullEyeSlash} />}
                  </Box>
                )}
              </InputRightElement>
            </InputGroup>
            {password.length > 0 && !password.match(passwordRegex) ? (
              <Text fontSize={"xs"} color={"red.600"}>
                비밀번호는 영문, 숫자, 특수문자 조합으로 이루어진 8~15자 이어야
                합니다.
              </Text>
            ) : (
              <Text h={"18px"}></Text>
            )}
            <FormLabel>비밀번호 재확인</FormLabel>
            <InputGroup>
              <Input
                type={canShow ? "text" : "password"}
                value={passwordCheck}
                isDisabled={!password.match(passwordRegex)}
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </InputGroup>
            {passwordCheck.length > 0 && passwordCheck !== password ? (
              <Text fontSize={"xs"} color={"red.600"}>
                비밀번호가 다릅니다.
              </Text>
            ) : (
              <Text h={"18px"}></Text>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <InputGroup>
              <Input
                value={nickname}
                isDisabled={!isPasswordChecked}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameChecked(false);
                }}
              />
              <InputRightElement w={"80px"}>
                <Button
                  size={"sm"}
                  isDisabled={!nickname.match(nicknameRegex)}
                  onClick={handleCheckNickname}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {nickname.length > 0 && !nickname.match(nicknameRegex) ? (
              <Text fontSize={"xs"} color={"red.600"}>
                닉네임은 한글조합, 숫자로 이루어진 2~10자 이어야 합니다.
              </Text>
            ) : (
              <Text h={"18px"}></Text>
            )}
          </FormControl>
          <Box>
            <Button onClick={onOpen} isDisabled={!allChecked}>
              가입
            </Button>
          </Box>
        </Stack>
      </OuttestBox>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>가입 확인</ModalHeader>
          <ModalBody>이대로 가입하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleSignup}>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}
