import { useState } from "react";

const useFilter = (defaultSort) => {
  const [sort, setSort] = useState(defaultSort);
  const [search, setSearch] = useState(null);

  const resetSearch = () => setSearch(null);

  return {
    sort,
    search,
    resetSearch,
    setSort,
    setSearch,
  };
};

export default useFilter;
