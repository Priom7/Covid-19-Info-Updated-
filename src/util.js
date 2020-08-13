import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const caseColor = {
  cases: {
    hex: "yellow",

    multiplier: 800,
  },
  recovered: {
    hex: "green",

    multiplier: 1200,
  },
  deaths: {
    hex: "red",

    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) =>
    a.cases > b.cases ? -1 : 1
  );
};

export const numStyle = (stat) =>
  stat ? ` ${numeral(stat).format("0.0a")}` : "0";

export const showDataOnMap = (data, caseType = "cases") =>
  data.map((country) => (
    <Circle
      center={[
        country.countryInfo.lat,
        country.countryInfo.long,
      ]}
      fillOpacity={0.4}
      color={caseColor[caseType].hex}
      fillColor={caseColor[caseType].hex}
      radius={
        Math.sqrt(country[caseType]) *
        caseColor[caseType].multiplier
      }
    >
      <Popup>
        <div className='info__popup'>
          <div
            className='info__popup-image'
            style={{
              backgroundImage: `url(${country.countryInfo.flag})`,
            }}
          ></div>
          <div className='info__popup-country'>
            {country.country}
          </div>
          <div className='info__popup-infected'>
            Infected: {numeral(country.cases).format("0,0")}
          </div>
          <div className='info__popup-recovered'>
            Recovered:{" "}
            {numeral(country.recovered).format("0,0")}
          </div>
          <div className='info__popup-deaths'>
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
