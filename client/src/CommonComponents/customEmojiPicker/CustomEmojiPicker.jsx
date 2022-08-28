import React,{useEffect,useRef} from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import { BiSmile } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import "./emojiPicker.styles.css"
function EmojiPicker(props) {
  const ref = useRef();
  useEffect(() => {
    const picker =  new Picker({ ...props, data, ref });
  }, []);

  return <div ref={ref} />;
}
const CustomEmojiPicker = ({handleImogiSelect,openDirection,styles}) => {
  return (
    <div>
      <OverlayTrigger
        trigger="click"
        placement={openDirection}
        rootClose={true}
        overlay={
          <Popover id={`popover-positioned-${openDirection}}`}>
            <Popover.Body>
              <EmojiPicker onEmojiSelect={ handleImogiSelect} />
            </Popover.Body>
          </Popover>
        }
      >
        <Button className=" smileBtnStyles" style={styles}>
          {" "}
          <BiSmile className="fs-cursor h2 mb-0 text-secondary" />
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default CustomEmojiPicker;
