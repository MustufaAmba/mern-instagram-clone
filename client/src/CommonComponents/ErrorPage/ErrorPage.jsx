import React from 'react'
import {useNavigate, useLocation} from "react-router-dom"
const ErrorPage = () => {
    const location = useLocation()
    const navigate = useNavigate()
    return (
        <div className='container'>
            <div className="text-center">
                    <h1 className="mt-5">OOPS</h1>
                    <p><span className="text-danger">{location.state.status}</span> {location.state.message}</p>
                    {(location.state.status===400||location.state.status===401)&&<p>Go back to <span className="fs-cursor text-primary" onClick={()=>navigate("/")}>login</span></p>}
            </div>

        </div>
    )
}

export default ErrorPage
