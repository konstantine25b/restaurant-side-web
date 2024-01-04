import React from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

export default function ConfOrderItems(props) {
  const navigate = useNavigate();
  const order = props?.props;

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
            {order.orderSent ? new Date(order.orderSent).toLocaleString() : ""}
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
                  calculateTimeLeft(order.orderRequestedDate).days
                }d ${calculateTimeLeft(order.orderRequestedDate).hours}h ${
                  calculateTimeLeft(order.orderRequestedDate).minutes
                }m ${calculateTimeLeft(order.orderRequestedDate).seconds}s`}
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
}

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
  const days = Math.floor((timeDiff / (1000 * 60 * 60 * 24)) % 30);
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}
