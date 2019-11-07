import React, { useContext, useEffect, useState } from "react";
import ListItem from "../../components/ListItem";
import AppContext from "../../contexts/Arweave.context";
import Loader from "../../components/Loader";
import { APP_NAME } from "../../constants";
import { ZeroState } from "../../theme";
export default function() {
  const { arweave, address } = useContext(AppContext);
  const [state, setState] = useState({
    isLoading: false,
    publications: [],
    empty: false
  });

  let publicationList = [];

  useEffect(() => {
    async function loadPublications() {
      setState({ isLoading: true });
      const query = {
        op: "equals",
        expr1: "App-Name",
        expr2: APP_NAME
      };
      const { data } = await arweave.api.post(`arql`, query);
      if (data.length > 0) {
        for (let i in data) {
          let txID = data[i];
          let tx = await arweave.transactions.get(txID);
          let tags = tx.get("tags");
          let document = { txID };
          let documentData = tx.get("data", { decode: true });
          for (let tag in tags) {
            let tagIndex = tags[tag];
            let name = tagIndex.get("name", { decode: true, string: true });
            let value = tagIndex.get("value", { decode: true, string: true });

            document[name] = value;
          }

          publicationList.push({
            ...document,
            data: await new Blob([documentData]).text()
          });
          setState({ isLoading: false, publications: publicationList });
        }
      } else {
        setState({ isLoading: false, empty: true, publications: [] });
      }
    }

    loadPublications();
  }, [address]);

  return (
    <>
      {state.isLoading ? (
        <Loader />
      ) : (
        state.publications.map((publication, index) => {
          return (
            <>
              <ListItem key={index} publication={publication} />
            </>
          );
        })
      )}
      {state.empty && <ZeroState>No publications yet!</ZeroState>}
    </>
  );
}
