import React from "react";
import styled from "styled-components";
import { darken, transparentize } from "polished";
import Toggle from "react-switch";

import { Link } from "../../theme";
import { useDarkModeManager } from "../../contexts/LocalStorage.context";

const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.concreteGray};
`;

const FooterElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.appPink};
  :hover {
    cursor: pointer;
  }
  #link {
    text-decoration-color: ${({ theme }) => theme.appPink};
  }
  #title {
    display: inline;
    font-size: 0.825rem;
    margin-right: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.appPink};
    :hover {
      color: ${({ theme }) => darken(0.2, theme.appPink)};
    }
  }
`;

const StyledToggle = styled(Toggle)`
  margin-right: 24px;
  .react-switch-bg[style] {
    background-color: ${({ theme }) =>
      darken(0.05, theme.inputBackground)} !important;
    border: 1px solid ${({ theme }) => theme.concreteGray} !important;
  }
  .react-switch-handle[style] {
    background-color: ${({ theme }) => theme.inputBackground};
    box-shadow: 0 4px 8px 0
      ${({ theme }) => transparentize(0.93, theme.shadowColor)};
    border: 1px solid ${({ theme }) => theme.mercuryGray};
    border-color: ${({ theme }) => theme.mercuryGray} !important;
    top: 2px !important;
  }
`;

const EmojiToggle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: Arial sans-serif;
`;

export default function Footer() {
  const [isDark, toggleDarkMode] = useDarkModeManager();

  return (
    <FooterFrame>
      <FooterElement>
        <Title>
          <Link id="link" href="#">
            <h1 id="title">Code</h1>
          </Link>
        </Title>
      </FooterElement>

      <StyledToggle
        checked={!isDark}
        uncheckedIcon={
          <EmojiToggle role="img" aria-label="moon">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            🌙️
          </EmojiToggle>
        }
        checkedIcon={
          <EmojiToggle role="img" aria-label="sun">
            {/* eslint-disable-line jsx-a11y/accessible-emoji */}
            {"☀️"}
          </EmojiToggle>
        }
        onChange={() => toggleDarkMode()}
      />
    </FooterFrame>
  );
}
