import React from "react";
import "./Table.css";
function Table({ countries }) {
  return (
    <div className='table'>
      {countries.map(
        ({
          country,
          cases,
          recovered,
          deaths,
          countryInfo,
        }) => (
          <tr>
            <span
              className='table__flag'
              style={{
                backgroundImage: `url(${countryInfo.flag})`,
              }}
            ></span>
            <td>{country}</td>

            <td>
              <strong style={{ color: "yellow" }}>
                {cases}
              </strong>
            </td>
            <td>
              <strong style={{ color: "#66ff00" }}>
                {recovered}
              </strong>
            </td>
            <td>
              <strong style={{ color: "red" }}>
                {deaths}
              </strong>
            </td>
          </tr>
        )
      )}
    </div>
  );
}

export default Table;
