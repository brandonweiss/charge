import { Search as SearchIcon } from "react-feather"
import styled from "@emotion/styled"

const Search = styled.div`
  align-items: center;
  display: flex;
`

const Icon = styled(SearchIcon)`
  color: #a9a9a9;
  margin-right: -1.8em;
  pointer-events: none;
  position: relative;
  z-index: 2;
`

const Input = styled.input`
  border-radius: 8px;
  background-color: inherit;
  border: none;
  line-height: normal;
  padding: 0.7em 0.7em 0.7em 2.5em;
  margin-right: 1em;
  width: 115px;
  transition: width 0.3s ease-in-out;

  &:focus {
    background-color: #e0e0e0;
    outline: 0;
    width: 240px;
  }

  &::placeholder {
    color: #a9a9a9;
  }
`

export default () => (
  <Search>
    <Icon />
    <Input type="text" id="algolia-search" placeholder="Search" />
  </Search>
)
