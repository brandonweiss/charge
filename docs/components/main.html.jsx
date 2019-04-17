import styled from "@emotion/styled"

const Main = styled.main`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 4rem 20px;
  padding-bottom: 0;
  position: relative;
  order: 1;
  flex-grow: 1;

  /* Fixes bottom padding not showing on a scroll container in Firefox */
  &:after {
    content: "";
    display: block;
    height: 4rem;
  }

  h1:first-of-type {
    margin-top: 0;
  }
`

export default ({ children }) => <Main>{children}</Main>
