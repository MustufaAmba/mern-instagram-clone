import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
const MultiplePost = ({ postContent, width }) => {
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  const [index, setIndex] = useState(0);
  return (
    <div className="flex-fill">
      <Carousel
        activeIndex={index}
        onSelect={handleSelect}
        style={{
          maxHeight: "560px",
        }}
        className="d-flex align-items-center justify-content-center"
        interval={null}
      >
        {postContent.url.map((data, index) => (
          <Carousel.Item key={index}>
            {data.type.includes("image") ? (
              <img
                className="d-block"
                src={data.url}
                width={`100%`}
                style={{ maxHeight: "560px" }}
                alt="post"
              />
            ) : (
              <video
                autoPlay
                loop={true}
                muted
                width={`100%`}
                style={{ maxHeight: "560px" }}
              >
                <source src={data.url} type="video/mp4" />
              </video>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default MultiplePost;
