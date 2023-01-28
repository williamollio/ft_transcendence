import { Autocomplete, Box, TextField } from "@mui/material";
import { LabelValue } from "../../../interfaces/common.interface";
import React, { FC, forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface Props {
  label: string;
  isRequired?: boolean;
  selectedValues: string[];
  options: LabelValue[];
  onChange: (values: string[]) => void;
  className?: string;
  error?: FieldError;
}

const CustomMultiSelect: FC<Props> = forwardRef<HTMLInputElement, Props>(
  (props: Props, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      label,
      isRequired = false,
      selectedValues,
      options,
      onChange,
      className,
      error,
    } = props;

    function getLabel(value: string): string {
      return (
        options.find((option: LabelValue) => option.value === value)?.label ||
        ""
      );
    }

    return (
      <Box>
        <Autocomplete
          className={className}
          multiple
          options={options.map((option) => option.value)}
          value={selectedValues}
          getOptionLabel={(option) => getLabel(option as string)}
          onChange={(_event, value) => onChange(value as string[])}
          renderInput={(params) => (
            <TextField
              error={error != null}
              {...params}
              label={label}
              required={isRequired}
              variant={"outlined"}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Box>
    );
  }
);

export default CustomMultiSelect;
