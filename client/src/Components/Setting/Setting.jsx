import React,{useState,useEffect} from "react";
import Header from "../../CommonComponents/header/Header";
import SettingNavigation from "./SettingNavigation";
import "./setting.styles.css"
import { Outlet } from "react-router-dom";
import Footer from "../../CommonComponents/footer/Footer";
const Setting = () => {
  const [windowSize,setWindowSize] = useState(window.innerWidth)
  const [toggleSettings,setToggleSettings] = useState("edit")
  useEffect(()=>{
    window.addEventListener("resize",()=>{
      setWindowSize(window.innerWidth)
    })
  },[])

  return (
    <div>
      <Header />
      <div className="container-fluid mt-5 pt-sm-5 p-0 p-sm-2">
        <div className="container-lg  bg-white border mt-3 ">
          <div className="row">
            <div className={`p-0  border-end ${(toggleSettings.length===0&&windowSize<=576)?"col-12 d-sm-block":"d-none d-sm-block col-3 "}`} style={{height:"70vh"}}>
                <SettingNavigation setToggleSettings={setToggleSettings}/>
            </div>
            <div className={`${(toggleSettings&&windowSize<=576)?"col-12":"col-9 d-none d-sm-block"}`} >
                <Outlet context={[windowSize,setToggleSettings]}/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
    );
  };

export default Setting;
