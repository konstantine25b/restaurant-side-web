import React, { useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";


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
// const ConfirmButton = styled.button`
//   background-color: #007bff;
//   color: #fff;
//   padding: 10px 20px;
//   border: none;
//   border-radius: 5px;
//   font-size: 16px;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

const FancyInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const TableInput = styled.input`
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
`;


const ConfirmButton = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#007bff" : "#0056b3")};
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
const DeleteButton = styled.button`
  background-color: black; /* Red color */
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  margin-left: 20px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.8; /* Darker red on hover */
  }
`;
const DenyButton = styled.button`
  background-color: red;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: darkred;
  }
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

const TimeWarning = styled.div`
  color: ${(props) =>
    props.isTimePassed ? "red" : props.isTimeWarning ? "orange" : "inherit"};
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
    seconds: seconds,
  };
}


const EachPendingOrder = ({ order, confirmOrder, denyOrder, handleDeleteOrder }) => {
    const navigate = useNavigate();


    const [tableNumber, setTableNumber] = useState(-1);

    const handleTableChange = (e) => {
           
        setTableNumber(e.target.value)
  
        console.log( tableNumber)
      };

      const handleConfirmClick = () => {
        // console.log(order.orderTable,tableNumber)
        if (order.orderTable <= 0 && tableNumber > 0) {
        //   console.log(1)
          confirmOrder(order.id, tableNumber);
        } else if (order.orderTable > 0) {
            // console.log("dfdg")
          confirmOrder(order.id , -1);// ese imito rom table ro gadavcem chaiweros 
        }
        else{
          alert("Please choose a table number");
        }
      };
 

  return (
    <div key={order.id}>
              <OrderItem
                isTimeWarning={
                  calculateTimeLeft(order.orderRequestedDate).hours === 0 &&
                  calculateTimeLeft(order.orderRequestedDate).minutes <= 45
                }
                isTimePassed={isTimePassed(order.orderRequestedDate)}
              >
                <OrderDetails>
                  <OrderField orderState={0}>
                    <strong>Order ID:</strong> {order.id}
                  </OrderField>
                  <OrderField orderState={0}>
                    <strong>Order Request Date:</strong>{" "}
                    {new Date(order.orderRequestedDate).toLocaleString()}
                  </OrderField>
                  <OrderField orderState={0}>
                    <strong>Order Sent Date:</strong>{" "}
                    {order.orderSent
                      ? new Date(order.orderSent).toLocaleString()
                      : ""}
                  </OrderField>
                  <TimeWarning
                    isTimeWarning={
                      calculateTimeLeft(order.orderRequestedDate).hours === 0 &&
                      calculateTimeLeft(order.orderRequestedDate).minutes <= 60
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
                  <strong>Total Price:</strong> ₾{order.totalPrice.toFixed(2)}
                </TotalPrice>
                <UserId>
                  <strong>Customer ID:</strong> {order.userId}
                </UserId>
                <OrderField orderState={0}>
                  {!order.orderState && (
                    <>
                      <SeeDetailsButton
                        onClick={() => {
                          navigate("/HomePage/EachOrderDetails", {
                            state: {
                              orderItems: order.orderItems,
                              totalPrice: order.totalPrice?.toFixed(2),
                              userId: order?.userId,
                              orderNotes: order.itemNotes,
                              orderRequestedDate: order.orderRequestedDate,
                              orderSent: new Date(
                                order.orderSent
                              ).toLocaleString(),
                              orderTable: order?.orderTable,
                            },
                          });
                        }}
                      >
                        See Details
                      </SeeDetailsButton>
                      {order.orderTable <= 0 ? (
                          <TableInput
                            type="number"
                            placeholder="Enter Table Number"
                            onChange={(e) => handleTableChange(e)}
                            min="1" // Set the minimum allowed value
                            step="1"
                          />
                       
                      ) : null}
                      
                      <ConfirmButton
                      
                        onClick={handleConfirmClick}
                      >
                        Confirm Order
                      </ConfirmButton>
                      <DenyButton onClick={() => denyOrder(order.id)}>
                        Deny Order
                      </DenyButton>
                      <DeleteButton onClick={() => handleDeleteOrder(order.id)}>
                        Delete Order
                      </DeleteButton>
                    </>
                  )}
                </OrderField>
              </OrderItem>
            </div>
  );
};

export default EachPendingOrder;