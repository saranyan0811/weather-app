import { useEffect, useState } from "react";

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);
  const [bg, setBg] = useState("#87ceeb");

  const apiKey = "3b3a700abde71a6b5dd17f2272292805";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    });
  }, []);

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const data = await res.json();

      if (data.cod !== 200) {
        setError("City not found");
        setWeather(null);
        setLoading(false);
        return;
      }

      setWeather(data);

      const condition = data.weather[0].main;
      if (condition === "Clear") setBg("#ffe066");
      else if (condition === "Clouds") setBg("#adb5bd");
      else if (condition === "Rain") setBg("#74b9ff");
      else if (condition === "Thunderstorm") setBg("#636e72");
      else setBg("#87ceeb");

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      const forecastData = await forecastRes.json();

      const daily = forecastData.list.filter((_, index) => index % 8 === 0);
      setForecast(daily);

    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        ...styles.container,
        background: bg,
        color: dark ? "#fff" : "#000"
      }}
    >
      {/* 🌌 ANIMATED BACKGROUND */}
      <div className="bg-animation"></div>

      {/* 🌙 DARK MODE */}
      <button style={styles.toggle} onClick={() => setDark(!dark)}>
        {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
      </button>

      <h1>🌦️ Pro Weather App</h1>

      <input
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button style={styles.button} onClick={getWeather}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && weather.main && (
        <div style={styles.card}>
          <h2>{weather.name}</h2>
          <h1>{weather.main.temp}°C</h1>
          <p>{weather.weather[0].main}</p>
        </div>
      )}

      <div style={styles.forecast}>
        {forecast.map((f, i) => (
          <div key={i} style={styles.day}>
            <p>{new Date(f.dt_txt).toDateString()}</p>
            <h3>{f.main.temp}°C</h3>
            <p>{f.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

const styles = {
  container: {
    textAlign: "center",
    minHeight: "100vh",
    padding: "20px",
    transition: "all 0.5s"
  },
  input: {
    padding: "10px",
    margin: "10px",
    borderRadius: "8px"
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    background: "black",
    color: "white"
  },
  toggle: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: "8px"
  },
  card: {
    marginTop: "20px",
    padding: "20px",
    background: "rgba(255,255,255,0.3)",
    borderRadius: "12px"
  },
  forecast: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "20px",
    flexWrap: "wrap"
  },
  day: {
    padding: "10px",
    background: "rgba(0,0,0,0.1)",
    borderRadius: "10px"
  }
};