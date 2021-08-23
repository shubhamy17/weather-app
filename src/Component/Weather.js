import React, { useEffect, useState } from "react";
import "./Style/Style.css";
import { ThemeProvider, createGlobalStyle } from "styled-components";



function Weather() {
  const [theme, setTheme] = useState({mode:'dark'});
  const [search, setSearch] = useState("Mumbai");
  const [current, setCurrent] = useState(null);
  const [city, setCity] = useState("");
  const [hourly, setHourly] = useState(null);
  const [daily, setDaily] = useState(null);
  const [data, setData] = useState(null);

  
  // Weekly day function
  let setDayOfWeek = function (dayNum) {
  
    var weekday = new Array(7);

    
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date();
    var dayName = days[d.getDay()];
    var s=(d.getDay()+1+dayNum)%7;
    return days[s];
  };
  // console.log(setDayOfWeek());

  // timeing function
  let settimes = function (timeNum) {
    var hour = new Array(47);
    var date = new Date();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "pm" : "am";
    // time conversion function am pm
    function nexthourampm(hour, ampm){
      let nexthour, nextampm;
      if (hour === 11) {
        nexthour = 12;
        if (ampm === "am") {
          nextampm = "pm";
        } else {
          nextampm = "am";
        }
      } else if (hour === 12) {
        nexthour = 1;
        if (ampm === "am") {
          nextampm = "am";
        } else {
          nextampm = "pm";
        }
      } else {
        nexthour = hour + 1;
        nextampm = ampm;
      }
      return [nexthour , nextampm];
    }

    hour[0] = nexthourampm(hours, am_pm);
    for (let i = 1; i < 48; i++) {
      hour[i] = nexthourampm(hour[i-1][0], hour[i-1][1])
    }
    return hour[timeNum];
  };




// light mode dark mode function
const GlobalStyle = createGlobalStyle`
body {
  background-color: ${props=>props.theme.mode ==='dark'?'#111  !important':'#EEE  !important'};
  color: ${props=>props.theme.mode==='dark'?'#EEE  !important':'#111 !important'};
  
  
}`;

// fetching data using api
  useEffect(() => {
    const fetchApi = async () => {
      const API_KEY = "b0e89df602025b1b2525a9bd5f0c21d8";
      //   const current = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=b0e89df602025b1b2525a9bd5f0c21d8`;
      //   const hourly = `http://pro.openweathermap.org/data/2.5/forecast/hourly?q=${search}&appid=b0e89df602025b1b2525a9bd5f0c21d8`;
      const exclude = "minutely,alerts";
      const latlonuri = `http://api.positionstack.com/v1/forward?access_key=fab80d93ef21989e45e301fbf8f51ca2&query=${search}`;
      const latlonres = await fetch(latlonuri);
      const latlondata = await latlonres.json();
      // console.log(latlondata, "test");

      if ( latlondata?.data && latlondata.data.length>0 ) {

        const { latitude=0, longitude=0, name="no data" } = latlondata?.data[0];
       
        setCity(name);

        const uri = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${latitude}&lon=${longitude}&exclude=${exclude}&appid=${API_KEY}`;
        const weatherres = await fetch(uri);
        const data = await weatherres.json();
        setData(data);
        const { daily, hourly, current } = data;
        setCurrent(data.current);
        // console.log(data.current);
        console.log(data.hourly);
        setHourly(data.hourly);
        setDaily(data.daily);
        // console.log(data.daily);
      } else {
        setData(false);
      }
    };
    fetchApi();
  }, [search]);
  
  return (
    
    
    <ThemeProvider theme={theme}>
      
    <div className="main">
      
      {/* <pre>{JSON.stringify(data.current, null, 4)}</pre> */}
    
      <GlobalStyle />
      <div className="box" id="box">
        {/*dark mode button*/}
        <button className="mode"onClick={e=>setTheme(theme.mode ==='dark' ? {mode:'light'}: {mode:'dark'})}>Theme change</button>
   
        <div className="input_search">
          {/*input of city*/}
          <div className="input">
            <input
              type="Search"
              value={search}
              
              placeholder="Enter name of city"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              
            />
            


          </div>
          {/* <i class="fas fa-search"></i> */}
        </div>

        {!data ? (
          <p>NO DATA FOUND</p>
        ) : (
          <>
            <div className="nextpage">
              <div className="info">
                <h2 className="temp">{current?.temp}°C</h2>

                <h2 className="Location">
                  <i className="fas fa-street-view"></i>
                  {search}
                </h2>
              </div>
            </div>

            <h3 className="InfoName">INFORMATION</h3>

            <div className="hourly">
            <h3>HOURLY FORECAST</h3>
              
              <ol>
                {data.hourly.map((x, key) => (
                  <div className="card">
                    {settimes(key)}
                    <br />
                    <i class="fas fa-cloud"></i>
                    <br/>
                    {x.temp}°<span className="celcius">C</span>
                  </div>
                ))}
              </ol>
            </div>

            <div className="daily">
              <h3>DAILY FORECAST</h3>

              <ol>
                {data.daily.slice(1).map((y, key) => (
                  <div className="card">
                    {y.temp.day}°<span className="celcius">C</span> <br /><i class="fas fa-cloud"></i><br/>
                    {setDayOfWeek(key)}
                  </div>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
    
    </ThemeProvider>
    
  );
               
  
};



export default Weather;

