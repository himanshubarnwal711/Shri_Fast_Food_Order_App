import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";

const isTenChars = (value) => value.trim().length === 10;

const isEmail = (value) => {
  const trimmedValue = value.trim();

  return (
    trimmedValue.includes("@") &&
    trimmedValue.includes(".")
  );
};

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    phone: true,
    email: true,
  });

  const nameInputRef = useRef();
  const phoneInputRef = useRef();
  const emailInputRef = useRef();

  const confirmHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value.trim();
    const enteredPhone = phoneInputRef.current.value.trim();
    const enteredEmail = emailInputRef.current.value.trim();

    const enteredNameIsValid = !isEmpty(enteredName);

    const enteredPhoneIsValid =
      !isEmpty(enteredPhone) &&
      isTenChars(enteredPhone) &&
      /^\d{10}$/.test(enteredPhone);

    const enteredEmailIsValid =
      !isEmpty(enteredEmail) &&
      isEmail(enteredEmail);

    setFormInputsValidity({
      name: enteredNameIsValid,
      phone: enteredPhoneIsValid,
      email: enteredEmailIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredPhoneIsValid &&
      enteredEmailIsValid;

    if (!formIsValid) {
      return;
    }

    // Send customer information to Cart.js
    props.onConfirm({
      name: enteredName,
      phone: enteredPhone,
      email: enteredEmail,
    });
  };

  const nameControlClasses = `${classes.control} ${
    formInputsValidity.name ? "" : classes.invalid
  }`;

  const phoneControlClasses = `${classes.control} ${
    formInputsValidity.phone ? "" : classes.invalid
  }`;

  const emailControlClasses = `${classes.control} ${
    formInputsValidity.email ? "" : classes.invalid
  }`;

  return (
    <form
      className={classes.form}
      onSubmit={confirmHandler}
    >
      {/* NAME */}

      <div className={nameControlClasses}>
        <label htmlFor="name">
          Your Name
        </label>

        <input
          type="text"
          id="name"
          ref={nameInputRef}
          autoComplete="name"
        />

        {!formInputsValidity.name && (
          <p>Please enter a valid name!</p>
        )}
      </div>

      {/* PHONE */}

      <div className={phoneControlClasses}>
        <label htmlFor="phone">
          Phone Number
        </label>

        <input
          type="tel"
          id="phone"
          ref={phoneInputRef}
          inputMode="numeric"
          maxLength="10"
          autoComplete="tel"
        />

        {!formInputsValidity.phone && (
          <p>
            Please enter a valid phone number
            (only 10 digits)!
          </p>
        )}
      </div>

      {/* EMAIL */}

      <div className={emailControlClasses}>
        <label htmlFor="email">
          Email
        </label>

        <input
          type="email"
          id="email"
          ref={emailInputRef}
          autoComplete="email"
        />

        {!formInputsValidity.email && (
          <p>
            Please enter a valid email!
          </p>
        )}
      </div>

      {/* NOTE */}

      <p className={classes.note}>
        Your order will be cancelled if we could
        not call you at the given phone number.
      </p>

      {/* ACTIONS */}

      <div className={classes.actions}>
        <button
          type="button"
          onClick={props.onCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={classes.submit}
        >
          Confirm
        </button>
      </div>
    </form>
  );
};

export default Checkout;