import React from "react";
import {
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import "./InfoBox.css";
import skullIcon from "./icons/skull.png";
import healthyIcon from "./icons/patient.png";
import virusIcon from "./icons/virus.png";

function InfoBox({ title, cases, total, ...props }) {
  let iconStyle =
    title === "Infected"
      ? "infoBox__iconI"
      : title === "Recovered"
      ? "infoBox__iconR"
      : "infoBox__iconD";
  let textStyle =
    title === "Infected"
      ? "infoBox__titleI"
      : title === "Recovered"
      ? "infoBox__titleR"
      : "infoBox__titleD";
  let boxStyle =
    title === "Infected"
      ? "infoBoxI"
      : title === "Recovered"
      ? "infoBoxR"
      : "infoBoxD";

  return (
    <Card onClick={props.onClick} className={boxStyle}>
      <img
        className={iconStyle}
        src={
          title === "Infected"
            ? virusIcon
            : title === "Recovered"
            ? healthyIcon
            : skullIcon
        }
      ></img>
      <CardContent>
        <Typography className={textStyle}>
          {title}
          <h2 className={textStyle}>+ {cases}</h2>
        </Typography>
        <Typography className={textStyle}>
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
