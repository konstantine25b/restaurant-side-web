import React, { useEffect, useState } from "react";
import { API } from "../../Processing/RestaurantAPI";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import ConfOrderItems from "../pageComponents/ConfOrderItems";

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrderSection = styled.div`
  width: 85%;
  margin: 20px 0;
  margin-left: -8%;
  border: 2px solid
    ${(props) =>
      props.orderState == 0
        ? "#FFC100"
        : props.orderState == 1
        ? "#007bff" : props.orderState ==2
        ? "red" : "grey"};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  background-color: ${(props) =>
    props.orderState ? "#f5f5f5" : "transparent"};
  transition: transform 0.2s;
  cursor: pointer;
`;

function calculateTimeLeft(requestedDate) {
  const currentTime = new Date();
  const endTime = new Date(requestedDate);
  const timeDiff = endTime - currentTime;
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}


export default function DeletedOrders() {
    const [allOrders, setAllOrders] = useState();
    const { state } = useLocation();
    const { restName, restInfo } = state;
    const navigate = useNavigate();
  
    let getDeletedOrders = async (id) => {
      const orders = await API.getRestaurantOrdersDeleted(id); // Change to your actual API endpoint
      setAllOrders(orders);
    };
  
    useEffect(() => {
      getDeletedOrders(restInfo?.id);
    }, [restInfo]);
  
    const [deniedOrders1, setDeniedOrders1] = useState([]);

    useEffect(() => {
      let denArr = [];
  
      for (let i = 0; i < allOrders?.length; i++) {
        let eachOrder = allOrders[i];
  
        let orderItems = [];
        let orderNotes = [];
  
        for (let j = 0; j < eachOrder.orderItems.length; j++) {
          orderItems.push(eachOrder.orderItems[j].dish_id);
          orderNotes.push(eachOrder.orderItems[j].notes);
        }
  
        denArr.push({
          id: eachOrder.id,
          orderRequestedDate: eachOrder.orderRequestedDate,
          orderSent: eachOrder.orderSent,
          totalPrice: eachOrder.totalPrice,
          userId: eachOrder.userId,
          orderState: eachOrder.orderState,
          orderItems: orderItems,
          itemNotes: orderNotes,
          orderTable: eachOrder.orderTable,
        });
      }
  
      setDeniedOrders1(denArr);
  
      const timer = setInterval(() => {
        deniedOrders1.forEach((order) => {
          // Calculate remaining time for each pending order
          const timeLeft = calculateTimeLeft(order.orderRequestedDate);
  
          // Update the state with the new remaining time
          setRemainingTime(timeLeft);
        });
      }, 1000);
  
      //  Clean up the timer when the component unmounts
      return () => {
        clearInterval(timer);
      };
    }, [allOrders]);
  
    const [remainingTime, setRemainingTime] = useState({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  
    function groupOrdersByRequestedDate(orders) {
      const currentTime = new Date();
      const lessThan1Hour = new Date(currentTime);
      lessThan1Hour.setHours(currentTime.getHours() - 1);
  
      const pendingOrders = [];
      const pastOrders = [];
  
      for (const order of orders) {
        const orderDate = new Date(order.orderRequestedDate);
  
        if (orderDate > currentTime) {
          pendingOrders.push(order);
        } else if (orderDate > lessThan1Hour) {
          pendingOrders.push(order);
        } else {
          pastOrders.push(order);
        }
      }
  
      return [...pendingOrders, ...pastOrders];
    }
  
    const sortedDeletedOrders = groupOrdersByRequestedDate(deniedOrders1).reverse();
  
  
  
    return (
      <OrdersContainer>
        <OrderSection orderState={3}>
          <h2 style={{ color: "gray", marginBottom: 100 }}>Deleted Orders</h2>
          {sortedDeletedOrders.map((order) => (
           (<ConfOrderItems key = {order.id} props = {order}/>)
        ))}
        </OrderSection>
      </OrdersContainer>
    );
  }
