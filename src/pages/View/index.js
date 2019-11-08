import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { DownloadCloud, Coffee } from "react-feather";
import { useToasts } from "react-toast-notifications";
import { withRouter } from "react-router-dom";
import AppContext from "../../contexts/Arweave.context";
import { getStoredValue, downloadPDF } from "../../utils";
import Modal from "../../components/Modal";
import { Button, Input, FormGroup, Label, ExternalLink } from "../../theme";

const StyledButton = styled(Button)`
  border-radius: 0;
  padding: 0.5rem;
  width: ${({ width }) => (width ? width : "10rem")};
  align-self: flex-end;
`;

const StyledInput = styled(Input)``;
const StyledFormGroup = styled(FormGroup)`
  padding: 2rem;
`;
const StyledFormButton = styled.div`
  margin: 2rem 0;
`;

const StyledTitle = styled.h2``;

const StyledBody = styled.article`
  margin: 2rem 0;
`;

const StyledAuthor = styled.h4``;

const StyledSpan = styled.span``;

const StyledDate = styled.h4``;

function View(props) {
  const { arweave } = useContext(AppContext);
  const amountRef = useRef(null);
  const { addToast } = useToasts();
  let wallet = getStoredValue("wallet");
  let address = getStoredValue("address");
  const [state, setState] = useState({
    isLoading: false,
    data: {
      document: "",
      docTags: null
    },
    amount: 0
  });
  const [visible, setVisible] = useState(false);
  let txID = props.location.pathname.split("/")[2];
  useEffect(() => {
    async function loadPublication() {
      setState({ isLoading: true });
      let tx = await arweave.transactions.get(txID);
      let tags = tx.get("tags");
      let docTags = { txID };
      let document = tx.get("data", { decode: true });
      for (let tag in tags) {
        let tagIndex = tags[tag];
        let name = tagIndex.get("name", { decode: true, string: true });
        let value = tagIndex.get("value", { decode: true, string: true });
        docTags[name] = value;
      }
      setState({
        isLoading: false,
        data: {
          document: await new Blob([document]).text(),
          docTags
        }
      });
    }
    loadPublication();
  }, []);

  async function makeDonation() {
    let key = JSON.parse(wallet);
    let tx = await arweave.createTransaction(
      {
        target: address,
        quantity: arweave.ar.arToWinston(parseFloat(amountRef.current.value))
      },
      key
    );
    const { data } = await arweave.api.get("/tx_anchor");
    tx.last_tx = data;

    await arweave.transactions.sign(tx, key);
    let { status } = await arweave.transactions.post(tx);
    console.log(status);
    if (status === 200) {
      console.log("Success");
      addToast("Your donation has been sent. Thank you!", {
        appearance: "success"
      });
    } else if (status === 400) {
      addToast("An error occured. Please try again", {
        appearance: "error"
      });
      console.log("Error");
    } else {
      addToast("Unknown error", {
        appearance: "error"
      });
      console.log("Unknown error");
    }
  }

  return (
    <>
      {state.data && state.data.docTags && (
        <>
          <StyledTitle>{state.data.docTags.title}</StyledTitle>
          <StyledBody>{state.data.docTags.abstract}</StyledBody>
          <StyledAuthor>
            Uploaded by{" "}
            <ExternalLink
              href={`https://viewblock.io/arweave/address/${
                state.data.docTags["owner"]
              }`}
            >
              {state.data.docTags["owner"]}
            </ExternalLink>
          </StyledAuthor>
          <StyledDate>
            {/* Uploaded on {new Date(state.data.docTags["createdAt"])} */}
          </StyledDate>
          <StyledButton
            width="15rem"
            onClick={() =>
              downloadPDF(
                state.data.document,
                state.data.docTags["Content-Type"]
              )
            }
          >
            <DownloadCloud size={14} />
            &nbsp; Download Publication
          </StyledButton>
          &nbsp;
          {address && (
            <StyledButton onClick={() => setVisible(true)}>
              <Coffee size={14} />
              &nbsp;Make Donation
            </StyledButton>
          )}
        </>
      )}
      <Modal open={visible} size="md" onClose={() => setVisible(false)}>
        <></>
        <StyledFormGroup>
          <Label htmlFor="amount">Amount</Label>
          <StyledInput type="number" ref={amountRef} />

          <StyledFormButton>
            <StyledButton onClick={makeDonation}>Make donation</StyledButton>
          </StyledFormButton>
        </StyledFormGroup>
      </Modal>
    </>
  );
}

export default withRouter(View);
