import { useEffect, useState } from "react";
import { useDebouncedValue } from "./debounce";
import { navigate, useLocation } from "rakkasjs";

export function useSearchWithQuery() {
  const { current } = useLocation();
  const url = current;
  const [keyword, setKeyword] = useState(url?.searchParams?.get("q") ?? "");
  const { debouncedValue, isDebouncing } = useDebouncedValue(keyword, 2000);
  useEffect(() => {
    if (current) {
      url?.searchParams?.set("q", debouncedValue);
      navigate(url);
    }
  }, [debouncedValue]);
  return { debouncedValue, isDebouncing, keyword, setKeyword };
}
