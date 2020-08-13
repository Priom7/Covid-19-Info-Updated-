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
import { sortData, numStyle } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import virus from "./icons/virus.png";

function App() {
  const [caseType, setCaseType] = useState("cases");
  const [countries, setCounties] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState();
  const [tableData, setTableData] = useState([]);
  const [centerMap, setCenterMap] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [zoomMap, setZoomMap] = useState(3);

  const [mapCountries, setMapCountries] = useState([]);
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
          setMapCountries(data);
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
        countryCode === "worldwide"
          ? setCenterMap([34.80746, -40.4796]) &&
            setZoomMap(3)
          : setCenterMap([
              data.countryInfo.lat,
              data.countryInfo.long,
            ]) && setZoomMap(5);
      });
  };

  return (
    <>
      <div className='app'>
        <div className='app__left'>
          <div className='app__header'>
            <div className='app__headerIcon'>
              <img
                src={virus}
                style={{ height: "50px", width: "50px" }}
              ></img>
              <h1>Covid-19 Info.</h1>
            </div>
            <FormControl className='app__dropdown'>
              <Select
                variant='outlined'
                onChange={onCountryChange}
                value={country}
                className='app__select'
              >
                <MenuItem
                  className='app__item'
                  value='worldwide'
                >
                  Worldwide
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem
                    className='app__item'
                    key={country.name}
                    value={country.value}
                  >
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Map
            caseType={caseType}
            countries={mapCountries}
            center={centerMap}
            zoom={zoomMap}
          ></Map>
          {countryInfo && (
            <div className='app__infoData'>
              <InfoBox
                onClick={(e) => setCaseType("cases")}
                title='Infected'
                cases={numStyle(countryInfo.todayCases)}
                total={numStyle(countryInfo.cases)}
              ></InfoBox>
              <InfoBox
                onClick={(e) => setCaseType("recovered")}
                title='Recovered'
                cases={numStyle(countryInfo.todayRecovered)}
                total={numStyle(countryInfo.recovered)}
              ></InfoBox>
              <InfoBox
                onClick={(e) => setCaseType("deaths")}
                title='Deaths'
                cases={numStyle(countryInfo.todayDeaths)}
                total={numStyle(countryInfo.deaths)}
              ></InfoBox>
            </div>
          )}
        </div>
        <Card className='app__right'>
          <CardContent className='card__content'>
            <h3 style={{ color: "wheat" }}>
              World Wide {caseType}
            </h3>
            <LineGraph caseType={caseType}></LineGraph>
            <br></br>
            <hr></hr>

            <div className='app__caseType'>
              <h3
                style={{
                  color: "wheat",
                }}
              >
                Live Cases By Country
              </h3>
              <p>
                <strong style={{ color: "wheat" }}>
                  Country
                </strong>
              </p>
              <p>
                <strong style={{ color: "yellow" }}>
                  Cases
                </strong>
              </p>

              <p>
                <strong style={{ color: "#66ff00" }}>
                  Recovered
                </strong>
              </p>

              <p>
                {" "}
                <strong style={{ color: "red" }}>
                  Deaths
                </strong>
              </p>
            </div>
            <Table countries={tableData}></Table>
          </CardContent>
        </Card>
      </div>
      <div>
        <footer>
          <small>
            {" "}
            Icons made by{" "}
            <a
              href='http://www.freepik.com/'
              title='Freepik'
            >
              Freepik
            </a>
            <a
              href='https://www.flaticon.com/'
              title='Flaticon'
            ></a>
            <a
              href='https://www.flaticon.com/authors/icongeek26'
              title='Icongeek26'
            >
              Icongeek26
            </a>{" "}
            from{" "}
            <a
              href='https://www.flaticon.com/'
              title='Flaticon'
            >
              www.flaticon.com
            </a>{" "}
            app made by{" "}
            <a href='https://vigorous-mirzakhani-1c2a13.netlify.app/'>
              Md. Sharif Alam
            </a>
          </small>
        </footer>
      </div>
    </>
  );
}

export default App;
