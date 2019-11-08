import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect
} from "react";
import ArweaveContext from "./Arweave.context";
import { APP_NAME } from "../constants";

const UPDATE = "UPDATE";

const AppContext = createContext();

function useAppContext() {
  return useContext(AppContext);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      return {
        ...state,
        data: payload.publicationList,
        isLoading: payload.isLoading,
        isEmpty: payload.isEmpty
      };
    }
    default: {
      throw Error(`Unexpected action type in AppContext reducer: '${type}'.`);
    }
  }
}

function init() {
  return {
    data: [],
    isLoading: false,
    isEmpty: false
  };
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  const update = useCallback(payload => {
    dispatch({ type: UPDATE, payload });
  }, []);

  return (
    <AppContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const { arweave } = useContext(ArweaveContext);
  const [state, { update }] = useAppContext();
  let publicationList = [];

  useEffect(() => {
    async function loadPublications() {
      update({
        isLoading: true,
        publicationList: [],
        isEmpty: false
      });
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

          await publicationList.push({
            ...document,
            data: await new Blob([documentData]).text()
          });
        }
        update({
          publicationList,
          isEmpty: false,
          isLoading: false
        });
      } else {
        update({
          publicationList: [],
          isEmpty: true,
          isLoading: false
        });
      }
    }

    return () => loadPublications();
  }, []);

  return [state];
}
