import React, { useState, useEffect } from "react";
import numeral from "numeral";
import { Line } from "react-chartjs-2";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callbacks: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const chatDataBuilder = (data, caseType = "cases") => {
  const chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[caseType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[caseType][date];
  }
  return chartData;
};

function LineGraph({ caseType = "cases" }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const getData = async () => {
      await fetch(
        "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      )
        .then((response) => response.json())
        .then((data) => {
          const chartData = chatDataBuilder(data, caseType);
          setData(chartData);
        });
    };
    getData();
  }, [caseType]);

  console.log(data);

  return (
    <div>
      {data?.length > 0 && caseType === "cases" && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "yellow",
                borderColor: "red",
                data: data,
              },
            ],
          }}
        ></Line>
      )}

      {data?.length > 0 && caseType === "recovered" && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "green",
                borderColor: "yellow",
                data: data,
              },
            ],
          }}
        ></Line>
      )}

      {data?.length > 0 && caseType === "deaths" && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "red",
                borderColor: "yellow",
                data: data,
              },
            ],
          }}
        ></Line>
      )}
    </div>
  );
}

export default LineGraph;
