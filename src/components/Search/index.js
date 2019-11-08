import React, { createRef, useState, useEffect } from "react";
import styled from "styled-components";
import Fuse from "fuse.js";
import { useApp } from "../../contexts/App.context";
import { Input, Link } from "../../theme";
const StyledSearchWrapper = styled.div`
  width: 100%;
`;

const StyledSearchResults = styled.div`
  position: absolute;
  top: 12rem;
  background: #ffffff;
  width: 50%;
  z-index: 1000;
`;

const StyledSearchResult = styled.div`
  padding: 1rem;
  color: #000000;
`;

export default function() {
  const nodeRef = createRef();
  const [{ data }] = useApp();
  const fuse = new Fuse(data, {
    keys: ["title"]
  });

  const [state, setState] = useState({
    isSearching: false,
    search: "",
    result: []
  });

  useEffect(() => {
    window.addEventListener("click", onOutsideClick);
    return () => window.removeEventListener("click", onOutsideClick);
  }, [onOutsideClick]);

  async function search(e) {
    const { value } = e.target;
    if (value.length > 5) {
      setState({ isSearching: true, search: value, result: state.result });
      let result = await fuse.search(value);
      if (result.length > 0) {
        setState({
          isSearching: true,
          search: state.value,
          result: result
        });
      }
    } else {
      setState({ isSearching: false, search: "", result: [] });
    }
  }

  function onOutsideClick(e) {
    if (nodeRef && nodeRef.current.contains(e.target) === true) return;
    setState({
      isSearching: false,
      result: [],
      search: ""
    });
  }

  return (
    <StyledSearchWrapper ref={nodeRef}>
      <Input type="text" placeholder="Search Publications" onChange={search} />
      {state.isSearching && (
        <StyledSearchResults>
          {state.result.map((result, index) => (
            <StyledSearchResult key={index}>
              <Link href={`/publication/${result.txID}`}>{result.title}</Link>
            </StyledSearchResult>
          ))}
        </StyledSearchResults>
      )}
    </StyledSearchWrapper>
  );
}
