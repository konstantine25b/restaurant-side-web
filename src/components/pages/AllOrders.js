import React, { useEffect, useState } from "react";
import { API } from "../../Processing/RestaurantAPI";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrderSection = styled.div`
  width: 85%;
  margin: 20px 0;
  margin-left: -8%;
  border: 2px solid ${(props) =>
    props.isConfirmed ? "#FFC100" : "#007bff"};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  background-color: ${(props) =>
    props.isConfirmed ? "#f5f5f5" : "transparent"};
  transition: transform 0.2s;
  cursor: pointer;
`;

const OrderItem = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const ConfirmButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const OrderDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const OrderField = styled.div`
  flex: ${(props) =>
    props.isConfirmed ? "2" : "1"};
`;

const OrderItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const OrderItemDetails = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
`;

const OrderItemNote = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 5px;
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  margin-top: 10px;
`;

const UserId = styled.div`
  font-size: 16px;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 15px;
`;

const TimeWarning = styled.div`
  color: ${(props) => (props.isTimePassed ? "red" : props.isTimeWarning ? "orange" : "inherit")};
  font-size: 14px;
  margin-top: 5px;
`;


function isTimePassed(requestedDate) {
  const currentTime = new Date();
  return currentTime > new Date(requestedDate);
}

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
    seconds: seconds
  };
}

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState();
  const { state } = useLocation();
  const { restName, restInfo } = state;

  let getOrders = async (id) => {
    const orders = await API.getRestaurantOrders(id);
    setAllOrders(orders);
  };

  useEffect(() => {
    getOrders(restInfo.id);
  }, [restInfo]);

  const orderConfirmation = async (id, orderToConfirm) => {
    const confirmOrderSuccess = await API.confirmRestaurantOrder(id);
    alert(
      confirmOrderSuccess
        ? "Order confirmed successfully!"
        : "Order confirmation failed."
    );
    if (confirmOrderSuccess) {
      const updatedPendingOrders = pendingOrders.filter(
        (order) => order.id !== id
      );
      setPendingOrders(updatedPendingOrders);

      setConfirmedOrders((prevConfirmedOrders) => [...prevConfirmedOrders, orderToConfirm]);
    }
  };

  const [pendingOrders, setPendingOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);

  useEffect(() => {
    let confArr = [];
    let pendArr = [];

    for (let i = 0; i < allOrders?.length; i++) {
      let eachOrder = allOrders[i];
      if (eachOrder.isConfirmed === false) {
        let orderItems = [];
        let orderNotes = [];

        for (let j = 0; j < eachOrder.orderItems.length; j++) {
          orderItems.push(eachOrder.orderItems[j].dish_id);
          orderNotes.push(eachOrder.orderItems[j].notes);
        }

        pendArr.push({
          id: eachOrder.id,
          orderRequestedDate: eachOrder.orderRequestedDate,
          orderSent: eachOrder.orderSent,
          totalPrice: eachOrder.totalPrice,
          userId: eachOrder.userId,
          isConfirmed: eachOrder.isConfirmed,
          orderItems: orderItems,
          itemNotes: orderNotes,
        });
      } else {
        let orderItems = [];
        let orderNotes = [];

        for (let j = 0; j < eachOrder.orderItems.length; j++) {
          orderItems.push(eachOrder.orderItems[j].dish_id);
          orderNotes.push(eachOrder.orderItems[j].notes);
        }

        confArr.push({
          id: eachOrder.id,
          orderRequestedDate: eachOrder.orderRequestedDate,
          orderSent: eachOrder.orderSent,
          totalPrice: eachOrder.totalPrice,
          userId: eachOrder.userId,
          isConfirmed: eachOrder.isConfirmed,
          orderItems: orderItems,
          itemNotes: orderNotes,
        });
      }
    }

    setConfirmedOrders(confArr);
    setPendingOrders(pendArr);

    const timer = setInterval(() => {
      pendingOrders.forEach((order) => {
        // Calculate remaining time for each pending order
        const timeLeft = calculateTimeLeft(order.orderRequestedDate);

        // Update the state with the new remaining time
        setRemainingTime(timeLeft);
      });
    }, 1000);

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };

  }, [allOrders]);

  const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const confirmOrder = (id) => {
    const orderToConfirm = pendingOrders.find((order) => order.id === id);

    if (orderToConfirm) {
      const confirmConfirmation = window.confirm(
        "Are you sure you want to confirm this order?"
      );

      if (confirmConfirmation) {
        orderConfirmation(id, orderToConfirm);
      }
    }
  };

  return (
    <OrdersContainer>
      <OrderSection isConfirmed>
        <h2 style={{ color: "#FFC100" }}>Pending Orders</h2>
        {pendingOrders.map((order) => (
          <div key={order.id}>
            <OrderItem>
              <OrderDetails>
                <OrderField isConfirmed={false}>
                  <strong>Order ID:</strong> {order.id}
                </OrderField>
                <OrderField isConfirmed={false}>
                  <strong>Order Request Date:</strong>{" "}
                  {new Date(order.orderRequestedDate).toLocaleString()}
                </OrderField>
                <OrderField isConfirmed={false}>
                  <strong>Order Sent Date:</strong>{" "}
                  {order.orderSent
                    ? new Date(order.orderSent).toLocaleString()
                    : ""}
                </OrderField>
                <TimeWarning
                  isTimeWarning={calculateTimeLeft(order.orderRequestedDate).hours === 0 && calculateTimeLeft(order.orderRequestedDate).minutes <= 60}
                  isTimePassed={isTimePassed(order.orderRequestedDate)}
                >
                  {isTimePassed(order.orderRequestedDate)
                    ? "Time has passed"
                    : `Time left: ${calculateTimeLeft(order.orderRequestedDate).hours}h ${calculateTimeLeft(order.orderRequestedDate).minutes}m ${calculateTimeLeft(order.orderRequestedDate).seconds}s`}
                </TimeWarning>
              </OrderDetails>
              <OrderItemContainer>
                {order.orderItems.map((item, index) => (
                  <OrderItemDetails key={index}>
                    <strong>Item {index + 1}:</strong> {item}
                    <OrderItemNote>
                      <strong>Notes:</strong> {order.itemNotes[index]}
                    </OrderItemNote>
                  </OrderItemDetails>
                ))}
              </OrderItemContainer>
              <TotalPrice>
                <strong>Total Price:</strong> ₾{order.totalPrice.toFixed(2)}
              </TotalPrice>
              <UserId>
                <strong>Customer ID:</strong> {order.userId}
              </UserId>
              <OrderField isConfirmed={false}>
                {!order.isConfirmed && (
                  <ConfirmButton onClick={() => confirmOrder(order.id)}>
                    Confirm Order
                  </ConfirmButton>
                )}
              </OrderField>
            </OrderItem>
          </div>
        ))}
      </OrderSection>
      <OrderSection>
        <h2 style={{ color: "#007bff" }}>Confirmed Orders</h2>
        {confirmedOrders.map((order) => (
          <div key={order.id}>
            <OrderItem>
              <OrderDetails>
                <OrderField isConfirmed={true}>
                  <strong>Order ID:</strong> {order.id}
                </OrderField>
                <OrderField isConfirmed={true}>
                  <strong>Order Request Date:</strong>{" "}
                  {new Date(order.orderRequestedDate).toLocaleString()}
                </OrderField>
                <OrderField isConfirmed={true}>
                  <strong>Order Sent Date:</strong>{" "}
                  {order.orderSent
                    ? new Date(order.orderSent).toLocaleString()
                    : ""}
                </OrderField>
                <TimeWarning
                  isTimePassed={isTimePassed(order.orderRequestedDate)}
                >
                  {isTimePassed(order.orderRequestedDate)
                    ? "Time has passed"
                    : `Time left: ${calculateTimeLeft(order.orderRequestedDate).hours}h ${calculateTimeLeft(order.orderRequestedDate).minutes}m ${calculateTimeLeft(order.orderRequestedDate).seconds}s`}
                </TimeWarning>
              </OrderDetails>
              <OrderItemContainer>
                {order.orderItems.map((item, index) => (
                  <OrderItemDetails key={index}>
                    <strong>Item {index + 1}:</strong> {item}
                    <OrderItemNote>
                      <strong>Notes:</strong> {order.itemNotes[index]}
                    </OrderItemNote>
                  </OrderItemDetails>
                ))}
              </OrderItemContainer>
              <TotalPrice>
                <strong>Total Price:</strong> ₾{order.totalPrice.toFixed(2)}
              </TotalPrice>
              <UserId>
                <strong>Customer ID:</strong> {order.userId}
              </UserId>
            </OrderItem>
          </div>
        ))}
      </OrderSection>
    </OrdersContainer>
  );
}
