import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
const MultiPost = ({ data, handleDoubleClick, id, variant }) => {
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const [index, setIndex] = useState(0);
  const setStyles = () => {
    return variant === "comment"
      ? {
          height: "fit-content",
          transform: "translateY(-50%)",
          top: "50%",
        }
      : {};
  };
  return (
    <div id={id} onDoubleClick={handleDoubleClick}>
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        interval={null}
        keyboard={true}
        style={setStyles()}
        className="d-flex align-items-center justify-content-center"
      >
        {data.images.length > 0 &&
          data.images.map((url, index) => (
            <Carousel.Item key={index}>
              <img className="d-block" src={url} width="100%" alt="post" />
            </Carousel.Item>
          ))}
        {data.videos.length > 0 &&
          data.videos.map((url, index) => (
            <Carousel.Item key={index}>
              <video
                autoPlay
                loop={true}
                width="100%"
                muted
                controlsList="nofullscreen"
                controls
              >
                <source src={url} type="video/mp4" />
              </video>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export default MultiPost;
