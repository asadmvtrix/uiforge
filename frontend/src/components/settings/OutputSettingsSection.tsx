import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Stack } from "../../lib/stacks";
import StackLabel from "../core/StackLabel";

interface Props {
  stack: Stack | undefined;
  setStack: (config: Stack) => void;
  label?: string;
  shouldDisableUpdates?: boolean;
}

function OutputSettingsSection({
  stack,
  setStack,
  label = "Stack:",
  shouldDisableUpdates = false,
}: Props) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-gray-500 dark:text-zinc-400">{label}</span>
      <Select
        value={stack ?? ""}
        onValueChange={(value: string) => setStack(value as Stack)}
        disabled={shouldDisableUpdates}
      >
        <SelectTrigger
          className="w-48"
          id="output-settings-js"
          data-testid="stack-select"
        >
          <SelectValue placeholder="Select a stack" />
        </SelectTrigger>
          <SelectContent side="top">
            <SelectGroup>
              {Object.values(Stack).map((stack) => (
                <SelectItem key={stack} value={stack}>
                  <div className="flex items-center">
                    <StackLabel stack={stack} />
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

    </div>
  );
}

export default OutputSettingsSection;
