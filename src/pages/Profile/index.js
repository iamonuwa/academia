import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { and, or, equals } from "arql-ops";
import { StyledTitle, ZeroState } from "../../theme";
import ListItem from "../../components/ListItem";
import AppContext from "../../contexts/Arweave.context";
import Loader from "../../components/Loader";
import { getStoredValue } from "../../utils";
import { APP_NAME } from "../../constants";

const GridContainer = styled.div`
  display: grid;
  margin: 3rem 0;
  grid-template-columns: repeat(3, 1fr);
`;

const StyledHeading = styled(StyledTitle)`
  font-weight: 600;
  font-size: 1rem;
`;

const StyledWrapper = styled.div`
  margin: 2rem;
`;
export default function() {
  const { arweave } = useContext(AppContext);
  let address = getStoredValue("address");
  const [state, setState] = useState({
    isLoading: false,
    publications: [],
    empty: false
  });
  let publicationList = [];

  useEffect(() => {
    async function loadMyPublications() {
      setState({ isLoading: true });
      let query = and(equals("author", address), equals("App-Name", APP_NAME));
      const { data } = await arweave.api.post(`arql`, query);
      if (data.length > 0) {
        for (let i in data) {
          let txID = data[i];
          let tx = await arweave.transactions.get(txID);
          let tags = tx.get("tags");
          let document = { txID };

          for (let tag in tags) {
            let tagIndex = tags[tag];
            let name = tagIndex.get("name", { decode: true, string: true });
            let value = tagIndex.get("value", { decode: true, string: true });

            document[name] = value;
          }

          publicationList.push(document);
          setState({ isLoading: false, publications: publicationList });
        }
      } else {
        setState({ isLoading: false, publications: [], empty: true });
      }
    }

    loadMyPublications();
  }, []);
  return (
    <StyledWrapper>
      <StyledHeading>Your Publications</StyledHeading>
      {state.empty && <ZeroState>No publications yet!</ZeroState>}
      <>
        {state.isLoading ? (
          <Loader />
        ) : (
          state.publications.map((publication, index) => {
            return (
              <>
                <GridContainer>
                  <ListItem
                    height="15rem"
                    width="20rem"
                    key={index}
                    publication={publication}
                  />
                </GridContainer>
              </>
            );
          })
        )}
      </>
    </StyledWrapper>
  );
}
