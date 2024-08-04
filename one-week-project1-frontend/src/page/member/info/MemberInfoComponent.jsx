import { Center } from "@chakra-ui/react";
import { OuttestBox } from "../../../css/component/Box/OuttestBox.jsx";
import { HeaderBox } from "../../../css/component/Box/HeaderBox.jsx";
import { useContext, useEffect } from "react";
import { LoginContext } from "../../../LoginProvider.jsx";

export function MemberInfoComponent() {
  const account = useContext(LoginContext);

  useEffect(() => {
    if (!account.isLoggedIn()) {
    }
  }, []);

  return (
    <Center>
      <OuttestBox>
        <HeaderBox>마이페이지</HeaderBox>
      </OuttestBox>
    </Center>
  );
}
