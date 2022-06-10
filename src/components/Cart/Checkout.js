import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";

const isTenChars = (value) => value.trim().length === 10;

const isEmail = (value) => value.trim().includes("@");

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

    const enteredName = nameInputRef.current.value;
    const enteredPhone = phoneInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredPhoneIsValid =
      !isEmpty(enteredPhone) && isTenChars(enteredPhone);
    const enteredEmailIsValid = !isEmpty(enteredEmail) && isEmail(enteredEmail);

    setFormInputsValidity({
      name: enteredNameIsValid,
      phone: enteredPhoneIsValid,
      email: enteredEmailIsValid,
    });

    const formIsValid =
      enteredNameIsValid && enteredPhoneIsValid && enteredEmailIsValid;

    if (!formIsValid) {
      return;
    }

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
    <form className={classes.form} onSubmit={confirmHandler}>
      <div className={nameControlClasses}>
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" ref={nameInputRef} />
        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
      </div>
      <div className={phoneControlClasses}>
        <label htmlFor="phone">Phone Number</label>
        <input type="number" id="phone" ref={phoneInputRef} />
        {!formInputsValidity.phone && (
          <p>Please enter a valid phone number (only 10 digits)!</p>
        )}
      </div>
      <div className={emailControlClasses}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailInputRef} />
        {!formInputsValidity.email && <p>Please enter a valid email!</p>}
      </div>
      <div className={classes.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
