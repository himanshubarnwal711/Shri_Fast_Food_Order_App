import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const cartCtx = useContext(CartContext);

  // ============================================================
  // API CONFIGURATION
  // ============================================================

  const API_URL = process.env.REACT_APP_API_URL || "https://81pgib20if.execute-api.ap-south-1.amazonaws.com";

  // ============================================================
  // TOTAL
  // ============================================================

  const totalAmount = `₹${cartCtx.totalAmount.toFixed(2)}`;

  const hasItems = cartCtx.items.length > 0;

  // ============================================================
  // CART HANDLERS
  // ============================================================

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({
      ...item,
      amount: 1,
    });
  };

  // ============================================================
  // OPEN CHECKOUT
  // ============================================================

  const orderHandler = () => {
    setSubmitError("");
    setIsCheckout(true);
  };

  // ============================================================
  // SUBMIT ORDER
  // ============================================================

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    setSubmitError("");

    // ----------------------------------------------------------
    // Build order object
    // ----------------------------------------------------------

    const orderData = {
      customer: {
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
      },

      items: cartCtx.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.amount,
        total: item.price * item.amount,
      })),

      totalAmount: cartCtx.totalAmount,
    };

    // ----------------------------------------------------------
    // Console logging
    // ----------------------------------------------------------

    console.log("=================================");
    console.log("        SHRI FAST FOOD ORDER");
    console.log("=================================");

    console.log("Customer Details:");

    console.log(
      "Name:",
      orderData.customer.name
    );

    console.log(
      "Phone:",
      orderData.customer.phone
    );

    console.log(
      "Email:",
      orderData.customer.email
    );

    console.log("---------------------------------");
    console.log("Order Summary:");

    orderData.items.forEach((item) => {
      console.log(
        `${item.name} | ₹${item.price} × ${item.quantity} = ₹${item.total.toFixed(
          2
        )}`
      );
    });

    console.log("---------------------------------");

    console.log(
      "Total Amount: ₹" +
        orderData.totalAmount.toFixed(2)
    );

    console.log("=================================");

    console.log(
      "Complete Order Object:",
      orderData
    );

    // ----------------------------------------------------------
    // Validate API URL
    // ----------------------------------------------------------

    if (!API_URL) {
      console.error(
        "REACT_APP_API_URL is not configured."
      );

      setIsSubmitting(false);

      setSubmitError(
        "Order service is currently unavailable. Please try again later."
      );

      return;
    }

    // ----------------------------------------------------------
    // Send order to AWS
    // ----------------------------------------------------------

    try {
      const orderApiUrl = `${API_URL}/orders`;

      console.log(
        "Sending order to:",
        orderApiUrl
      );

      const response = await fetch(
        orderApiUrl,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(orderData),
        }
      );

      // --------------------------------------------------------
      // Parse response
      // --------------------------------------------------------

      const result = await response.json();

      console.log(
        "Order API Response:",
        result
      );

      // --------------------------------------------------------
      // Check response
      // --------------------------------------------------------

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to place order"
        );
      }

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      console.log(
        "Order submitted successfully."
      );

      setIsSubmitting(false);
      setDidSubmit(true);

      // Clear cart ONLY after successful order
      cartCtx.clearCart();

    } catch (error) {
      console.error(
        "Order submission failed:",
        error
      );

      setIsSubmitting(false);

      setSubmitError(
        "Failed to place your order. Please try again."
      );
    }
  };

  // ============================================================
  // CART ITEMS
  // ============================================================

  const cartitems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(
            null,
            item.id
          )}
          onAdd={cartItemAddHandler.bind(
            null,
            item
          )}
        />
      ))}
    </ul>
  );

  // ============================================================
  // CART BUTTONS
  // ============================================================

  const modalActions = (
    <div className={classes.actions}>
      <button
        className={classes["button--alt"]}
        onClick={props.onClose}
      >
        Close
      </button>

      {hasItems && (
        <button
          className={classes.button}
          onClick={orderHandler}
        >
          Order
        </button>
      )}
    </div>
  );

  // ============================================================
  // CART CONTENT
  // ============================================================

  const cartModalContent = (
    <React.Fragment>
      {cartitems}

      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>

      {isCheckout && (
        <Checkout
          onConfirm={submitOrderHandler}
          onCancel={() => setIsCheckout(false)}
        />
      )}

      {!isCheckout && modalActions}

      {submitError && (
        <p
          style={{
            color: "red",
            marginTop: "15px",
          }}
        >
          {submitError}
        </p>
      )}
    </React.Fragment>
  );

  // ============================================================
  // SUBMITTING
  // ============================================================

  const isSubmittingModalContent = (
    <p>
      Processing order...
    </p>
  );

  // ============================================================
  // SUCCESS
  // ============================================================

  const didSubmitModalContent = (
    <React.Fragment>
      <p>
        Order received successfully!
      </p>

      <p>
        A confirmation email has been sent
        to your email address.
      </p>

      <div className={classes.actions}>
        <button
          className={classes.button}
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </React.Fragment>
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting &&
        !didSubmit &&
        cartModalContent}

      {isSubmitting &&
        isSubmittingModalContent}

      {!isSubmitting &&
        didSubmit &&
        didSubmitModalContent}
    </Modal>
  );
};

export default Cart;