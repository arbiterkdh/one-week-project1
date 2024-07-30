import { Box } from "@chakra-ui/react";

export function OuttestBox(props) {
  return (
    <Box
      my={10}
      p={3}
      borderRadius={"10px"}
      border={"2px solid darkgreen"}
      w={"1024px"}
      alignItems={"center"}
      boxShadow="
        0 12px 24px rgba(0, 0, 0, 0.03),
        0 -12px 24px rgba(0, 0, 0, 0.03),
        12px 0 24px rgba(0, 0, 0, 0.03),
        -12px 0 24px rgba(0, 0, 0, 0.03),
        0 0 10px rgba(0, 0, 0, 0.03)
      "
      {...props}
    />
  );
}
