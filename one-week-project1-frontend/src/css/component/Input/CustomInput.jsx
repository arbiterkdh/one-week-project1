import { Input } from "@chakra-ui/react";

export function CustomInput({ index, InputRefs, ...props }) {
  function handlePressKeyDown(event, index) {
    if (event.key === "Enter") {
      event.preventDefault();
      InputRefs.current[index + 1].focus();
    }
  }

  return (
    <Input
      ref={(el) => (InputRefs.current[index + 1] = el)}
      onKeyDown={(e) => handlePressKeyDown(e, index)}
      {...props}
    />
  );
}
