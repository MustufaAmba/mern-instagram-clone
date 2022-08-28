import React from "react";
import "./customTextfield.styles.css";
const CustomTextfield = ({ value, placeholder, styles,name,id,formikHandler }) => {
  return (
    <div>
      <input
        className={`inputStyles ${styles}`}
        name={name}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={formikHandler}
      />
    </div>
  );
};

export default CustomTextfield;
