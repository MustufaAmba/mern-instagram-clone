import React from 'react'
import "./footer.styles.css"
const Footer = () => {
    const footerContent = ["Meta", "About", "Blog", "Jobs", "Help", "Api", "Privacy", "Terms", "Top accounts", "HashTags", "Locations", "Instagram Lite", "Contact uploading and non-users"]
    return (
        <footer className=''>
        <div className='d-flex justify-content-center mt-5  flex-wrap'>
            {footerContent.map((data, index) => <p className="linkStyles  px-2" key={index} >{data}</p>)}
            </div>
            <div className='d-flex justify-content-center mb-5 mt-2'>
                <p className='linkStyles'>English (UK)</p>
                <p className='linkStyles'>	&#169; 2022 Instagram from Meta</p>
            </div>
        </footer>
    )
}

export default Footer
