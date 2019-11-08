import React, { useState, useRef, useContext, useEffect } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { useToasts } from "react-toast-notifications";
import { User, Plus, LogOut } from "react-feather";
import { Button, Link } from "../../theme";
import Modal from "../Modal";
import { device, size } from "../../breakpoints";
import AppContext from "../../contexts/Arweave.context";
import { storeValues, getStoredValue, clearStorageValue } from "../../utils";

const HeaderFrame = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.concreteGray};
  @media (max-width: 480px) {
    font-size: 0.8rem;
    display: inherit;
  }
`;

const HeaderElement = styled.div`
  margin: 0.5rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.wisteriaPurple};
  }
  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.wisteriaPurple};
    :hover {
      color: ${({ theme }) => darken(0.1, theme.wisteriaPurple)};
    }
  }
`;

const StyledInputForm = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  border: 1px dotted ${({ theme }) => theme.backgroundColor};
  padding: 3rem;
  cursor: pointer;
`;

const StyledUser = styled.div`
  cursor: pointer;
`;
const StyledInputTitle = styled.div`
  color: ${({ theme }) => theme.backgroundColor};
`;

export default function() {
  const { arweave, setloggedIn, balance } = useContext(AppContext);
  const [loginModal, setLoginModal] = useState(false);
  const address = getStoredValue("address");
  const { addToast } = useToasts();
  const fileRef = useRef(null);

  function triggerInput() {
    fileRef.current.click();
  }
  async function handleInputFileChange(arweave, files, setloggedIn) {
    const fileReader = new FileReader();

    if (files.length > 0) {
      fileReader.onload = async e => {
        try {
          const data = JSON.parse(e.target.result);
          const address = await arweave.wallets.jwkToAddress(data);
          const wallet = await arweave.wallets.generate();
          await getCurrentBalance(address, wallet);
          await storeValues({ address, wallet: JSON.stringify(wallet) });
          addToast("Login successful", {
            appearance: "success"
          });
          setLoginModal(false);
        } catch (err) {
          addToast("Login failed. Please try again", {
            appearance: "error"
          });
          console.log("Login error: ", err);
        }
      };
      fileReader.readAsText(files[0]);
    }
  }

  const clearAll = () => {
    clearStorageValue("wallet");
    clearStorageValue("address");
    window.location.reload();
  };

  useEffect(() => {
    getCurrentBalance(address);
  }, [address]);

  async function getCurrentBalance(address, wallet) {
    let isLoggedIn = address !== null ? true : false;
    let balance = await arweave.wallets.getBalance(address);
    setloggedIn(isLoggedIn, wallet, balance);
  }

  return (
    <>
      <HeaderFrame>
        <HeaderElement>
          <Title>
            <Link id="link" href="/">
              <h1 id="title">Academia</h1>
            </Link>
          </Title>
        </HeaderElement>
        <HeaderElement>
          {address || address !== null ? (
            <>
              <HeaderElement>
                <Link href="/create">
                  <Plus size={14} />
                  New
                </Link>
              </HeaderElement>
              <HeaderElement>
                <StyledUser>
                  <Link href={`/academia/${address}`}>
                    <User size={14} /> {arweave.ar.winstonToAr(balance)} AR
                  </Link>
                </StyledUser>
                <HeaderElement>
                  <Link onClick={clearAll}>
                    <LogOut size={14} /> Logout
                  </Link>
                </HeaderElement>
              </HeaderElement>
            </>
          ) : (
            <HeaderElement>
              <Button onClick={() => setLoginModal(true)}>Login</Button>
            </HeaderElement>
          )}
        </HeaderElement>
      </HeaderFrame>
      <Modal size="md" open={loginModal} onClose={() => setLoginModal(false)}>
        <>Login</>
        <StyledInputForm onClick={triggerInput}>
          <StyledInputTitle>
            <Title>Drop a keyfile to Login</Title>
          </StyledInputTitle>
          <input
            type="file"
            ref={fileRef}
            onChange={({ target: { files } }) =>
              handleInputFileChange(arweave, files, setloggedIn)
            }
            style={{ display: "none" }}
          />
        </StyledInputForm>
      </Modal>
    </>
  );
}
