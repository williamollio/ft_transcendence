import React, { FC, forwardRef } from "react";
import {
  UseFormRegister,
  RegisterOptions,
  Path,
  FieldValues,
} from "react-hook-form";
import { useReactHookFormHelper } from "../../../utils/use-react-hook-form-helper";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";

interface Props {
  name?: Path<FieldValues>;
  rules?: RegisterOptions<FieldValues>;
  error?: any;
  register?: UseFormRegister<FieldValues>;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string;
  value?: string | number;
  disable?: boolean;
}

const CustomTextField: FC<Props> = forwardRef<HTMLInputElement, Props>(
  (props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      label,
      isRequired,
      placeholder,
      defaultValue,
      name,
      rules,
      error,
      register,
      value,
      disable = false,
    } = props;

    const { getErrorMessage } = useReactHookFormHelper();

    return (
      <Box>
        <TextField
          error={error != null}
          fullWidth
          label={label}
          required={isRequired}
          inputRef={ref}
          {...register?.(name || "", rules)}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          variant={"outlined"}
          helperText={error && getErrorMessage(error)}
          InputLabelProps={{ shrink: true }}
          disabled={disable}
        />
      </Box>
    );
  }
);

export default CustomTextField;
