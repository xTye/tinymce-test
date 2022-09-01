import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import React from "react";
import FileIcon, { defaultStyles } from "react-file-icon";

function DocIcon() {
  return <FileIcon size={32} extension={"doc"} {...defaultStyles.doc} />;
}

export const iconFile = <DocIcon />;
export const starBorderIcon = <StarBorderIcon style={{ color: "#868a8d" }} />;
export const startIconYellow = <StarIcon style={{ color: "#fcc934" }} />;
