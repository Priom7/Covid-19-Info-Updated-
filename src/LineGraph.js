import React, { useState, useEffect } from "react";
import { numeral } from "numeral";
import { Line } from "react-chartjs-2";

function LineGraph() {
  const [data, setData] = useState({});

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
          return numeral(tooltipItem.value).format("+0.0");
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
            callback: function (value, index, values) {
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

    for (let data in data.cases) {
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

  useEffect(() => {
    const getData = async () => {
      await fetch(
        "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      )
        .then((response) => response.json())
        .then((data) => {
          const chartData = chatDataBuilder(data);
          setData(chartData);
        });
    };
    getData();
  }, []);

  return (
    <div>
      <h1>LineGraph</h1>
      <Line
        options={options}
        data={{
          datasets: [
            {
              data: data,
              backgroundColor: "rgba(204, 16, 52, 0.5)",
              borderColor: "#CC1034",
            },
          ],
        }}
      ></Line>
    </div>
  );
}

export default LineGraph;
