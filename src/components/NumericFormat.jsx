import React from "react";
import { NumericFormat, PatternFormat } from "react-number-format";

export const MoneyFormat = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
      prefix="Rp. "
      suffix=",00"
    />
  );
});

export const NumberFormat = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, disabled, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      disabled={disabled}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
      decimalScale={0}
    />
  );
});

export const PhoneNumberFormat = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <PatternFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      valueIsNumericString
      format="####-####-####"
    />
  );
});
