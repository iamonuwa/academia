import React, { Suspense, lazy, useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import AppContext, { arweave } from "../contexts/Arweave.context";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getStoredValue } from "../utils";

import List from "./List";
import View from "./View";
import Create from "./Create";
import Profile from "./Profile";

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const FooterWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  align-self: flex-end;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow: auto;
`;

const Body = styled.div`
  margin-top: 2rem;
  max-width: 50rem;
  width: 90%;
`;

function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps ? <C {...props} {...appProps} /> : <Redirect to="/" />
      }
    />
  );
}

export default function() {
  const [wallet, setWallet] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  let address = getStoredValue("address");

  return (
    <>
      <Suspense fallback={null}>
        <AppContext.Provider
          value={{
            arweave,
            wallet,
            loggedIn,
            balance,
            setloggedIn: (loggedIn, wallet, balance) => {
              setWallet(wallet);
              setLoggedIn(loggedIn);
              setBalance(balance);
            }
          }}
        >
          <AppWrapper>
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <BodyWrapper>
              <Body>
                <Suspense fallback={null}>
                  <Switch>
                    <Route exact path="/" component={() => <List />} />
                    <Route
                      exact
                      path="/publication/:hash"
                      component={() => <View />}
                    />
                    <AuthenticatedRoute
                      exact
                      appProps={address}
                      path="/create"
                      component={() => <Create />}
                    />
                    <AuthenticatedRoute
                      exact
                      appProps={address}
                      path="/academia/:address"
                      component={() => <Profile />}
                    />
                  </Switch>
                </Suspense>
              </Body>
            </BodyWrapper>
            <FooterWrapper>
              <Footer />
            </FooterWrapper>
          </AppWrapper>
        </AppContext.Provider>
      </Suspense>
    </>
  );
}
