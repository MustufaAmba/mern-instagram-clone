import React, { useState } from "react";
import "./styles.css";
const CustomPasswordField = ({  placeholder, styles,name,formikHandler,value,id }) => {
  const [toggleVisibility, setToggleVisibility] = useState(false);
  return (
    <div className="parent">
      <input
        type={toggleVisibility ? "text" : "password"}
        className={`inputStyles ${styles}`}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={formikHandler}
      />
      {value && (
        <p
          className="toggleBtnStyles fw-bold fs-small  m-0"
            style={{paddingTop:"5px"}}
          onClick={() => setToggleVisibility((state) => (state = !state))}
        >
          {toggleVisibility ? "Hide" : "Show"}
        </p>
      )}
    </div>
  );
};

export default CustomPasswordField;
