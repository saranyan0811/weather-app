import { useState } from "react";

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [bg, setBg] = useState(
    "linear-gradient(135deg,#74ebd5,#ACB6E5)"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const apiKey = "3b3a700abde71a6b5dd17f2272292805";

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const data = await res.json();

      if (data.cod !== 200 && data.cod !== "200") {
        setError(data.message || "City not found!");
        setWeather(null);
        setLoading(false);
        return;
      }

      setWeather(data);

      setHistory((prev) => [city, ...prev.slice(0, 4)]);

      const condition = data.weather[0].main;

      // 🌈 Dynamic Background
      if (condition === "Clear")
        setBg("linear-gradient(135deg,#f6d365,#fda085)");
      else if (condition === "Clouds")
        setBg("linear-gradient(135deg,#bdc3c7,#2c3e50)");
      else if (condition === "Rain")
        setBg("linear-gradient(135deg,#74ebd5,#ACB6E5)");
      else if (condition === "Thunderstorm")
        setBg("linear-gradient(135deg,#373B44,#4286f4)");
      else if (condition === "Snow")
        setBg("linear-gradient(135deg,#e6dada,#274046)");
      else if (condition === "Mist")
        setBg("linear-gradient(135deg,#606c88,#3f4c6b)");
    } catch (err) {
      setError("Something went wrong!");
      setWeather(null);
    }

    setLoading(false);
  };

  return (
    <div style={{ ...styles.container, background: bg }}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌦️ Weather App</h1>

        <input
          style={styles.input}
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
        />

        <button
          style={styles.button}
          onClick={getWeather}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Get Weather
        </button>

        {loading && <p>⏳ Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && weather.main && (
          <div style={styles.result}>
            <h2>📍 {weather.name}</h2>

            <h1 style={{ fontSize: "42px", margin: "10px 0" }}>
              {weather.main.temp.toFixed(1)}°C
            </h1>

            <h1 style={{ fontSize: "60px" }}>
              {weather.weather[0].main === "Clouds"
                ? "☁️"
                : weather.weather[0].main === "Clear"
                ? "☀️"
                : weather.weather[0].main === "Rain"
                ? "🌧️"
                : weather.weather[0].main === "Thunderstorm"
                ? "⚡"
                : weather.weather[0].main === "Snow"
                ? "❄️"
                : weather.weather[0].main === "Mist"
                ? "🌫️"
                : "🌍"}
            </h1>

            <p>{weather.weather[0].main}</p>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: "15px" }}>
            <h4>Recent Searches</h4>
            {history.map((item, i) => (
              <p key={i}>📍 {item}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    transition: "0.5s ease",
    padding: "20px",
  },

  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    textAlign: "center",
  },

  title: {
    marginBottom: "15px",
  },

  input: {
    width: "90%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    marginBottom: "10px",
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },

  result: {
    marginTop: "20px",
    animation: "fadeIn 0.5s ease",
  },
};