import styled from "@emotion/styled";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import COLORS from "../../themes/colors";

export default function LeftNavbarList(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ListItem onClick={toggleDropdown}>
        <ListItemTitle>{props.title}</ListItemTitle>
        <ChevronDownIcon
          style={{
            width: 20,
            height: 20,
            color: "white",
          }}
        />
      </ListItem>
      <ListContent style={{ display: isOpen ? "block" : "none" }}>
        {props.data?.map((item,index)=>(
            
           <ListContentItem key ={index}>
            <ListContentItemP>  {item}</ListContentItemP>
          
            </ListContentItem>
        ))}
        
      </ListContent>
    </>
  );
}
const ListItemTitle = styled.p`
  font-size: 18px;
  color: white;
`;
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  border-radius: 3px;
  background-color: ${COLORS.insideBlue};
  margin-top: 8px;
  &:hover {
    cursor: pointer;
  }
  

`;
const ListContent = styled.ul`
  all: unset;
  background-color: ${COLORS.insideBlue};
  padding-bottom : 15px ;
`
const ListContentItem = styled.li`
  display: flex;
  width: 50%;
  
  align-items: center;
  padding: 2px 10px;

  margin-left: 15px;
  &:hover {
    cursor: pointer;
  }
  margin-top: 17px;
  border-left : 1px solid white;
`
const ListContentItemP = styled.p`
color:white;
margin: 0;
font-size: 15px;
 `;
