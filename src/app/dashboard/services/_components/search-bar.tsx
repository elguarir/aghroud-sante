"use client";
import { SearchIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { Loader2 } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import { useTransition } from "react";

type Props = {
  search: string | null;
};

const SearchBar = (props: Props) => {
  const [isLoading, startTransition] = useTransition();

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withOptions({
      clearOnDefault: true,
      throttleMs: 500,
      shallow: false,
      startTransition,
    }),
  );

  return (
    <div className="flex items-center">
      <Input
        value={search ?? ""}
        size="lg"
        placeholder="Rechercher un service"
        id="search"
        name="search"
        isClearable
        startContent={<SearchIcon className="text-default-500" />}
        onClear={() => setSearch(null)}
        endContent={
          isLoading ? (
            <div className="mt-1.5">
              <Spinner color="current" size="sm" />
            </div>
          ) : undefined
        }
        labelPlacement="outside"
        label="Rechercher"
        onChange={(e) => {
          if (e.target.value === "") {
            setSearch(null);
            return;
          }
          setSearch(e.target.value);
        }}
        variant="bordered"
        classNames={{
          inputWrapper:
            "group-data-[focus=true]:border-primary !transition-all !duration-200",
        }}
      />
    </div>
  );
};

export default SearchBar;
