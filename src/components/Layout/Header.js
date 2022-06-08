import React, { Fragment } from "react";
import mealsIamge from "../../assets/meals.jpg";
import classes from "./Header.module.css";
import HeaderCartButton from "./HeaderCartButton";

const Header = (props) => {
  return (
    <Fragment>
      <header className={classes.header}>
        <h1>SHRI FAST FOOD</h1>
        <HeaderCartButton onClick={props.onShowCart} />
      </header>
      <div className={classes["main-image"]}>
        <img
          src={mealsIamge}
          alt="A roadside delicious and fast food vendor."
        />
      </div>
    </Fragment>
  );
};

export default Header;
