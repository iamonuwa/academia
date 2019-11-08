import React from "react";
import styled from "styled-components";
import { DownloadCloud } from "react-feather";
import { CardBody, CardWrapper, Link } from "../../theme";
import { downloadPDF } from "../../utils";
import { device } from "../../breakpoints";

const StyledCardWrapper = styled(CardWrapper)`
  font-size: ${({ width }) => width && "0.9rem"};
  margin-top: 2rem;
`;

const StyledCardBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
  padding: 32px;
`;

const StyledIcon = styled(DownloadCloud)`
  cursor: pointer;
  margin-right: 1rem;
`;

const StyledArticlePreview = styled.div`
  text-align: justify;
`;

const StyledTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  @media (max-width: ${device.mobileL}) {
    font-size: 0.9rem;
    width: 10rem;
  }
`;

const StyledPageViews = styled.div``;

const StyledAuthor = styled.h4`
  margin-left: 0.5rem;
  align-self: center;
`;

const StyledInfo = styled.div`
  display: flex;
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDetails = styled.div``;
const StyledAction = styled.div`
  align-self: flex-end;
`;

const StyledSpan = styled.span`
  cursor: pointer;
  margin-right: 1rem;
`;
export default function({ publication, height, width }) {
  return (
    <>
      {publication.title && (
        <StyledCardWrapper>
          <StyledCardBody width={width}>
            <StyledTitle>{publication.title}</StyledTitle>
            <StyledArticlePreview>{publication.abstract}</StyledArticlePreview>
            <StyledFooter>
              <StyledDetails>
                <StyledInfo>
                  <StyledAuthor>{/*  */}</StyledAuthor>
                </StyledInfo>
                <StyledPageViews>
                  {/* {publication.createdAt && new Date(publication.createdAt)} */}
                </StyledPageViews>
              </StyledDetails>
              <StyledAction>
                {publication.data && (
                  <StyledSpan
                    onClick={() =>
                      downloadPDF(publication.data, publication["Content-Type"])
                    }
                  >
                    <StyledIcon size={14} />
                    Download
                  </StyledSpan>
                )}
                <Link href={`/publication/${publication.txID}`}>
                  View details
                </Link>
              </StyledAction>
            </StyledFooter>
          </StyledCardBody>
        </StyledCardWrapper>
      )}
    </>
  );
}
