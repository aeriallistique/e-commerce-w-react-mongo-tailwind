import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { useContext, useEffect, useState } from "react";
import styled from 'styled-components';
import Button from '../components/Button'
import axios from 'axios';

const ColumnsWrapper =styled.div`
  display:grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin-top: 40px;
`; 

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding:30px;
`;

export default function CartPage(){
  const {cartProducts} = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(()=>{
    if(cartProducts.length > 0 ){
      axios.post('/api/cart', {ids: cartProducts}).then(response =>{
        setProducts(response.data);
      })
    }
  }, [cartProducts])


  return(
    <>   
    <Header />
    <Center>
      <ColumnsWrapper>
        <Box>
        <h2>Cart</h2>
          {!cartProducts?.length && (
            <div>Your cart is empty.</div>
          )} 
          {products?.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  
                  <tr>
                    <td></td>
                    {products.map(product => (
                      <div>{product.title } : 
                      {cartProducts.filter(id => 
                        id === product._id).length}</div>
                    ) )}
                    </tr>
                  
                </tbody>
              </table>
         )} 
        </Box>
        {!!cartProducts?.length && (
          <Box>
          <h2>Order Information</h2>
          <input type="text" placeholder="Address" />
          <input type="text" placeholder="Address 2" />
          <Button black block > Continue to payment</Button>
        </Box>
        )}
        
      </ColumnsWrapper>
    </Center>
    
    </>
  )
}