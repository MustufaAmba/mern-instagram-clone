import React from "react";
import { NavLink } from "react-router-dom";

const SettingNavigation = ({setToggleSettings}) => {
  return (
    <div className="d-flex flex-column">
      <NavLink
        className="settingLinksStyles"
        to="/account/edit"
        onClick={()=>setToggleSettings("edit")}
        style={({ isActive }) =>
          isActive ? { borderLeft: "1px solid black", fontWeight: "500" } : {}
        }
      >
        Edit Profile
      </NavLink>
      <NavLink
        className="settingLinksStyles"
        onClick={()=>setToggleSettings("password")}
        style={({ isActive }) =>
          isActive ? { borderLeft: "1px solid black", fontWeight: "500" } : {}
        }
        to="/account/password"
      >
        Change password
      </NavLink>
    </div>
  );
};

export default SettingNavigation;
