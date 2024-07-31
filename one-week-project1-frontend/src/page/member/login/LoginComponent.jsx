import { LoginContext } from "../../../LoginProvider.jsx";
import { useContext, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  faEye as emptyEye,
  faEyeSlash as emptyEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import {
  faEye as fullEye,
  faEyeSlash as fullEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OuttestBox } from "../../../css/component/box/OuttestBox.jsx";
import { HeaderBox } from "../../../css/component/box/HeaderBox.jsx";

export function LoginComponent() {
  const account = useContext(LoginContext);

  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [canShow, setCanShow] = useState(false);
  const [eye, setEye] = useState(false);

  function handleLogin() {
    axios
      .post("/api/member/login/token", {
        memberEmail: email,
        memberPassword: password,
      })
      .then((res) => {
        account.login(res.data.token);
        toast({
          status: "success",
          description: "로그인되었습니다.",
          position: "bottom-right",
        });
        setEmail("");
        navigate("/");
      })
      .catch((err) => {
        account.logout();
        toast({
          status: "warning",
          description: "이메일 또는 비밀번호를 확인해주세요.",
          position: "bottom-right",
        });
        console.log("로그인 요청중 오류: " + err);
      })
      .finally(() => {
        setPassword("");
      });
  }

  return (
    <Center>
      <OuttestBox>
        <HeaderBox>로그인</HeaderBox>
        <Input
          placeholder={"이메일"}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <InputGroup display={"inherit"}>
          <Input
            type={canShow ? "text" : "password"}
            value={password}
            placeholder={"비밀번호"}
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
        <Button onClick={handleLogin}>로그인</Button>
      </OuttestBox>
    </Center>
  );
}
