import Link from "next/link"
import { useContext } from "react";
import styled from "styled-components";
import { CartContext } from "./CartContext";
import Center from "./Center";

const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color:#fff;
  text-decoration: none;
`;

const Wrapper = styled.div`
display:flex;
justify-content: space-between;
padding: 20px 0;
`;

const StyledNav = styled.nav`
display:flex;
gap: 15px;

`;

const NavLink = styled(Link)`
color: #aaa;
text-decoration:none;

`;

export default function Header(){
  const {cartProducts} = useContext(CartContext);
  return(
    <StyledHeader>
      <Center>
      <Wrapper>
        <Logo href={'/'}>Ecommerce </Logo>
        <StyledNav>
          <NavLink href={'/products'}>All Products</NavLink>
          <NavLink href={'/categories'}>Categories</NavLink>
          <NavLink href={'/'}>Home</NavLink>
          <NavLink href={'/account'}>Account</NavLink>
          <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
        </StyledNav>
      </Wrapper>
    </Center>
    </StyledHeader>
  )
}