import React, { useState, useCallback, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-dom";
import { getAppsmithConfigs } from "configs";
import { debounce } from "lodash";

const { algolia } = getAppsmithConfigs();
const searchClient = algoliasearch(algolia.apiId, algolia.apiKey);

type SearchProps = {
  query: string;
  children: React.ReactNode;
};

function Search({ query, children }: SearchProps) {
  const [queryInState, setQueryInState] = useState(query);
  const debouncedSetQueryInState = useCallback(
    debounce(setQueryInState, 100),
    [],
  );

  useEffect(() => {
    debouncedSetQueryInState(query);
  }, [query]);

  return (
    <InstantSearch
      indexName={algolia.indexName}
      searchClient={searchClient}
      searchState={{ query: queryInState }}
    >
      {children}
    </InstantSearch>
  );
}

export default Search;
