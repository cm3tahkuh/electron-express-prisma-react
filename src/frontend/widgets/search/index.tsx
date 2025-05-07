import { TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface SearchProps {
  onChange: (value: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onChange }) => {
  const [value, setValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onChange(val);
  };
  return (
    <TextField.Root
      value={value}
      onChange={handleInputChange}
      variant="classic"
      placeholder="Поиск…"
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  );
};
