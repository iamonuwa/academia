import React from "react";
import styled from "styled-components";
import { DownloadCloud } from "react-feather";
import { CardBody, CardWrapper, Link } from "../../theme";
import { downloadPDF } from "../../utils";

const StyledCardWrapper = styled(CardWrapper)`
  height: ${({ height }) => (height ? height : "12rem")};
  width: ${({ width }) => width && width};
  font-size: ${({ width }) => width && "0.9rem"};
`;

const StyledCardBody = styled(CardBody)`
  display: grid;
  grid-template-rows: ${({ width }) => width && "0fr 2fr 0fr"};
`;

const StyledIcon = styled(DownloadCloud)`
  cursor: pointer;
  margin-right: 1rem;
`;

const StyledArticlePreview = styled.div``;

const StyledTitle = styled.h3``;

const StyledPageViews = styled.div``;

const StyledAuthor = styled.h4`
  margin-left: 0.5rem;
  align-self: center;
`;

const StyledInfo = styled.div`
  display: flex;
`;

const StyledAvatar = styled.img`
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  align-self: center;
`;

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledDetails = styled.div``;
const StyledAction = styled.div`
  align-self: flex-end;
`;
export default function({ publication, height, width }) {
  return (
    <>
      {publication.title && (
        <StyledCardWrapper height={height} width={width}>
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
                  <StyledIcon
                    size={14}
                    onClick={() =>
                      downloadPDF(publication.data, publication["Content-Type"])
                    }
                  />
                )}
                <Link href={`/publication/${publication.txID}`}>
                  View Publication
                </Link>
              </StyledAction>
            </StyledFooter>
          </StyledCardBody>
        </StyledCardWrapper>
      )}
    </>
  );
}
