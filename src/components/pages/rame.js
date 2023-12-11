import React, { useEffect, useState } from "react";
import { API } from "../../Processing/RestaurantAPI";
import { useLocation, useNavigate } from "react-router-dom";
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
  border: 2px solid ${(props) => (props.orderState ? "#FFC100" : "#007bff")};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  background-color: ${(props) =>
    props.orderState ? "#f5f5f5" : "transparent"};
  transition: transform 0.2s;
  cursor: pointer;
`;
const OrderItem = styled.div`
  margin-bottom: 30px;
  font-size: 18px;
  border: 1px solid ${(props) => (props.isTimePassed ? "red" : "#ccc")};
  padding: 10px;
  border-radius: 5px;
  transition: transform 0.2s;
  background-color: ${(props) =>
    props.isTimeWarning
      ? props.isTimePassed
        ? "red"
        : "#FFFF99"
      : props.isTimePassed
      ? "#ff9999"
      : "transparent"};

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
  flex: ${(props) => (props.orderState ? "2" : "1")};
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
  color: ${(props) =>
    props.isTimePassed ? "red" : props.isTimeWarning ? "orange" : "inherit"};
  font-size: 14px;
  margin-top: 5px;
`;

const SeeDetailsButton = styled.button`
  background-color: white;
  color: #007bff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
    color: white;
  }
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
    seconds: seconds,
  };
}

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState();
  const { state } = useLocation();
  const { restName, restInfo } = state;
  const navigate = useNavigate();

  let getConfirmedOrders = async (id) => {
    const orders = await API.getRestaurantOrdersConfirmed(id);
    setAllOrders(orders);
  };

  useEffect(() => {
    // getOrders(restInfo?.id);
    getConfirmedOrders(restInfo?.id);
  }, [restInfo]);

  const [confirmedOrders1, setConfirmedOrders1] = useState([]);

  useEffect(() => {
    let confArr = [];

    for (let i = 0; i < allOrders?.length; i++) {
      let eachOrder = allOrders[i];

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
        orderState: eachOrder.orderState,
        orderItems: orderItems,
        itemNotes: orderNotes,
        orderTable: eachOrder.orderTable,
      });
    }

    setConfirmedOrders1(confArr);

    const timer = setInterval(() => {
      confirmedOrders1.forEach((order) => {
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

  const sortedConfirmedOrders = groupOrdersByRequestedDate(confirmedOrders1);

  return (
    <OrdersContainer>
      <OrderSection>
        <h2 style={{ color: "#007bff", marginBottom: 100 }}>
          Confirmed Orders
        </h2>
        {sortedConfirmedOrders.map((order) => {
          return (
            <div key={order.id}>
              <OrderItem
                isTimeWarning={
                  calculateTimeLeft(order.orderRequestedDate).hours === 0 &&
                  calculateTimeLeft(order.orderRequestedDate).minutes <= 60
                }
                isTimePassed={isTimePassed(order.orderRequestedDate)}
              >
                <OrderDetails>
                  <OrderField orderState={true}>
                    <strong>Order ID:</strong> {order.id}
                  </OrderField>
                  <OrderField orderState={true}>
                    <strong>Order Request Date:</strong>{" "}
                    {new Date(order.orderRequestedDate).toLocaleString()}
                  </OrderField>
                  <OrderField orderState={true}>
                    <strong>Order Sent Date:</strong>{" "}
                    {order.orderSent
                      ? new Date(order.orderSent).toLocaleString()
                      : ""}
                  </OrderField>
                  <TimeWarning
                    isTimeWarning={
                      calculateTimeLeft(order.orderRequestedDate).hours === 0 &&
                      calculateTimeLeft(order.orderRequestedDate).minutes <= 45
                    }
                    isTimePassed={isTimePassed(order.orderRequestedDate)}
                  >
                    {isTimePassed(order.orderRequestedDate)
                      ? "Time has passed"
                      : `Time left: ${
                          calculateTimeLeft(order.orderRequestedDate).hours
                        }h ${
                          calculateTimeLeft(order.orderRequestedDate).minutes
                        }m ${
                          calculateTimeLeft(order.orderRequestedDate).seconds
                        }s`}
                  </TimeWarning>
                </OrderDetails>
                {/* <OrderItemContainer>
                {order.orderItems.map((item, index) => (
                  <OrderItemDetails key={index}>
                    <strong>Item {index + 1}:</strong> {item}
                    <OrderItemNote>
                      <strong>Notes:</strong> {order.itemNotes[index]}
                    </OrderItemNote>
                  </OrderItemDetails>
                ))}
              </OrderItemContainer> */}
                <TotalPrice>
                  <strong>Table ID:</strong>{" "}
                  {order.orderTable > 0 ? order.orderTable : "None"}
                </TotalPrice>
                <TotalPrice>
                  <strong>Total Price:</strong> ₾{order.totalPrice?.toFixed(2)}
                </TotalPrice>
                <UserId>
                  <strong>Customer ID:</strong> {order.userId}
                </UserId>
                <SeeDetailsButton
                  onClick={() => {
                    navigate("/HomePage/EachOrderDetails", {
                      state: {
                        orderItems: order.orderItems,
                        totalPrice: order.totalPrice?.toFixed(2),
                        userId: order?.userId,
                        orderNotes: order.itemNotes,
                        orderRequestedDate: order.orderRequestedDate,
                        orderSent: new Date(order.orderSent).toLocaleString(),
                        orderTable: order?.orderTable,
                      },
                    });
                  }}
                >
                  See Details
                </SeeDetailsButton>
                {/* <UserId>
                <strong>Customer ID:</strong> {order.userId}
              </UserId> */}
              </OrderItem>
            </div>
          );
        })}
      </OrderSection>
    </OrdersContainer>
  );
}
