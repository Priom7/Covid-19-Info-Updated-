import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCounties] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState();
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch(
        "https://disease.sh/v3/covid-19/countries"
      )
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCounties(countries);
        });
    };
    getCountries();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };
  console.log(countryInfo);

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid-19 Info</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem
                  key={country.name}
                  value={country.value}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {countryInfo && (
          <div className='app__infoData'>
            <InfoBox
              title='Infected'
              cases={countryInfo.todayCases}
              total={countryInfo.cases}
            ></InfoBox>
            <InfoBox
              title='Recovered'
              cases={countryInfo.todayRecovered}
              total={countryInfo.recovered}
            ></InfoBox>
            <InfoBox
              title='Deaths'
              cases={countryInfo.todayDeaths}
              total={countryInfo.deaths}
            ></InfoBox>
          </div>
        )}
        <Map></Map>
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Case By Country</h3>
          <Table countries={tableData}></Table>
          <h3> World Wide New Cases</h3>
        </CardContent>
      </Card>
      <LineGraph></LineGraph>
    </div>
  );
}

export default App;
