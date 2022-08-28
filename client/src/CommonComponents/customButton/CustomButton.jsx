import React from "react";
import "./customButton.styles.css";
const CustomButton = ({ styles, isdisable, text,handler,children }) => (
  <button
    type="submit"
    className={`btn btn-primary btnStyles ${styles} rounded-3 fw-bold d-flex align-items-center justify-content-center text-center`}
    disabled={isdisable}
    onClick={handler}
  >
    {children}{text}
  </button>
);

export default CustomButton;
