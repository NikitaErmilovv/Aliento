"use client";

import { useState } from "react";
import { formatPhoneInput, phoneDigits } from "@/lib/phone";

export function MaskedPhoneInput({
  id = "phone",
  name = "phone",
  required,
  className = "field",
  defaultValue,
  placeholder = "+7 (900) 000-00-00",
}: {
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(() =>
    defaultValue ? formatPhoneInput(defaultValue) : ""
  );

  function handleChange(nextRaw: string) {
    const digits = phoneDigits(nextRaw);
    if (digits.length === 0) {
      setValue("");
      return;
    }
    setValue(formatPhoneInput(nextRaw));
  }

  function handleFocus() {
    if (!value) setValue("+7");
  }

  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      placeholder={placeholder}
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={handleFocus}
      onBlur={() => {
        if (value === "+7") setValue("");
      }}
      required={required}
      className={className}
    />
  );
}
