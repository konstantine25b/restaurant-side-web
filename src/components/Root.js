import React from "react";
import styled from "@emotion/styled";
import COLORS from "../themes/colors";

import LeftNavbarList from "./pageComponents/LeftNavbarList";
import { Outlet, useNavigate } from "react-router-dom";

export default function Root() {
  const navigate = useNavigate();

  return (
    <Main>
      <Page>
        <LeftSide>
          <LeftSideTop>
            <CompanyName onClick={() => navigate(`/`)}>Fast Order</CompanyName>
          </LeftSideTop>
          <LeftSideList>
            <LeftNavbarList
              title={"Restaurant Info"}
              data={["Address", "MainImage"]}
            />
            <LeftNavbarList
              title={"Products & Categories"}
              data={["Products", "Categories"]}
            />
          </LeftSideList>
        </LeftSide>
        <RightSide>
          <UpperSideIn>
            <UserTitle>konstantin@gmail.com</UserTitle>
          </UpperSideIn>
          <Outlet />
        </RightSide>
      </Page>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
`;
const RightSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  align-items: center;
`;
const UpperSideIn = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  padding-right: 3%;
  background-color: ${COLORS.light};
  padding: 20px 0px;
  justify-content: right;
  align-items: center;
`;
const UserTitle = styled.p`
  font-size: 17px;
  margin: 0;
  margin-right: 30px;
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
