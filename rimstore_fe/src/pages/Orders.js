import React, { useEffect, useState } from 'react';
import apiService from '../api/apiService';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.getOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.order_id}>
              <p>Order ID: {order.order_id}</p>
              <p>Status: {order.order_status}</p>
              <p>Total: ${order.total_amount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no orders.</p>
      )}
    </div>
  );
};

export default Orders;
