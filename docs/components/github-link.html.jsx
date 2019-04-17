import { GitHub } from "react-feather"
import styled from "@emotion/styled"

const Anchor = styled.a`
  color: #666666;
`

export default ({ className, size }) => (
  <Anchor className={className} href="https://github.com/brandonweiss/charge">
    <GitHub width={size} height={size} />
  </Anchor>
)
