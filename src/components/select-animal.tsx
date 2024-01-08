import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "./theme-provider";

interface SelectAnimalProps {
  setSelectedAnimal: (value:string) => void;
}

export function SelectAnimal({ setSelectedAnimal}: SelectAnimalProps) {

  const { theme } = useTheme();
  const handleSelectChange = (value: string) => {
    setSelectedAnimal(value);
  };

  const selectTriggerStyle: React.CSSProperties = {
    backgroundColor: theme === "dark" || theme === "system"  ? "#09090b" : "initial",
  };

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[215px]" style={selectTriggerStyle}>
        <SelectValue placeholder="Chien" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Animal</SelectLabel>
          <SelectItem value="chien">Chien</SelectItem>
          <SelectItem value="chat">Chat</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
