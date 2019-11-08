import React, { useContext, useEffect, useState } from "react";
import ListItem from "../../components/ListItem";
import { useApp } from "../../contexts/App.context";
import Loader from "../../components/Loader";
import { ZeroState } from "../../theme";
import Search from "../../components/Search";
export default function() {
  const [{ data, isLoading, isEmpty }] = useApp();
  const [state, setState] = useState({
    isLoading: false,
    publications: [],
    empty: false
  });

  return (
    <>
      <Search />
      {isLoading ? (
        <Loader />
      ) : (
        data.map((publication, index) => {
          return (
            <>
              <ListItem key={index} publication={publication} />
            </>
          );
        })
      )}
      {isEmpty && <ZeroState>No publications yet!</ZeroState>}
    </>
  );
}
