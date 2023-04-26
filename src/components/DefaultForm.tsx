import React from 'react'
import {
  FormControl,
  Input,
  WarningOutlineIcon,
} from 'native-base'
export default function DefaultForm({
  label,
  type = 'text',
  errors = {},
  changeText,
  blurText,
  key,
  InputRightElement,
}: any) {
  return (
    <FormControl
      bg="#111118"
      marginBottom="30"
      isInvalid={errors[label]}
      key={key}
    >
      <FormControl.Label bg="#111118">
        {label}
      </FormControl.Label>
      <Input
        type={type}
        defaultValue=""
        placeholder={`Enter youer ${label}`}
        bg="#1e1e27"
        color="white"
        fontSize="18"
        borderWidth="0"
        borderRadius="10"
        height="55"
        cursorColor="white"
        onChangeText={(e) => changeText(e, key)}
        onBlur={() => blurText()}
        InputRightElement={InputRightElement}
      />
      <FormControl.ErrorMessage
        color="red"
        fontSize="20"
        leftIcon={<WarningOutlineIcon size="xs" />}
      >
        {errors[label]}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
