import React from "react";
import styled from "@emotion/styled";
import COLORS from "../themes/colors";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import LeftNavbarList from "./pageComponents/LeftNavbarList";

export default function HomePage() {
  return (
    <Main>
      <Page>
        <LeftSide>
          <LeftSideTop>
            <CompanyName>Fast Order</CompanyName>
          </LeftSideTop>
          <LeftSideList>
            <LeftNavbarList title={"Restaurant Info"} data={["address" , "MainImage" ]}/>   
            <LeftNavbarList title={"Products & Categories"} data={["Products" , "Categories" ]}/>     
          </LeftSideList>
        </LeftSide>
        <UpperSide>
          <UpperSideIn>
            <UserTitle>konstantin@gmail.com</UserTitle>
          </UpperSideIn>
        </UpperSide>
      </Page>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
`;
const UpperSide = styled.div`
  width: 100%;
  display: flex;
  background-color: ${COLORS.light};
  height: 80px;
  align-items: center;
`;
const UpperSideIn = styled.div`
  width: 97%;
  display: flex;

  margin-right: 3%;
  padding: 20px 0px;
  justify-content: right;
`;
const UserTitle = styled.p`
  font-size: 17px;
  margin: 0;
`;
const CompanyName = styled.p`
  font-size: 30px;
  color: white;
  margin: 0;
`;
const Page = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100vh;
`;
const LeftSide = styled.div`
  width: 300px;
  height: 100%;
  background-color: ${COLORS.blue};
`;

const LeftSideTop = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 0.1px solid ${COLORS.light};
`;

const LeftSideList = styled.ul`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0;
  padding: 10px 10px;
`;


