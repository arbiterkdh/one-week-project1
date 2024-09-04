import { Center } from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/Box/OuttestBox.jsx";
import { HeaderBox } from "../../../css/component/Box/HeaderBox.jsx";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../../LoginProvider.jsx";
import { TitleBox } from "../../../css/component/Box/TitleBox.jsx";
import { useNavigate } from "react-router-dom";

export function MemberInfoComponent() {
  const account = useContext(LoginContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !account.isLoggedIn() ||
      (account.isLoggedIn() && !account.hasAccess(account.id))
    ) {
      account.logout();
      navigate("/");
    }
  }, [account]);

  return (
    <Center>
      <OuttestBox>
        <HeaderBox>마이페이지</HeaderBox>
        <TitleBox></TitleBox>
        <TitleBox></TitleBox>
        <TitleBox></TitleBox>
      </OuttestBox>
    </Center>
  );
}
