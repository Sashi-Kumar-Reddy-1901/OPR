import React from "react";
import { components } from "react-select";
import { Tooltip , Zoom } from "@mui/material";

const CustomOption = (props) => {
  return (
    <Tooltip title={props.data.label} arrow TransitionComponent={Zoom} placement="right">
      <div>
        <components.Option {...props}>{props.children}</components.Option>
      </div>
    </Tooltip>
  );
};

export default CustomOption;
