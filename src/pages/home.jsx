import { useState } from "react";

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [bg, setBg] = useState("#ffffff");

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
      console.log("API DATA:", data);

      // ❗ SAFE CHECK (IMPORTANT FIX)
      if (data.cod !== 200 && data.cod !== "200") {
        setError(data.message || "City not found!");
        setWeather(null);
        setLoading(false);
        return;
      }

      setWeather(data);

      // history
      setHistory((prev) => [city, ...prev.slice(0, 4)]);

      const condition = data.weather[0].main;
      console.log("Condition:", condition);

      // 🌈 BACKGROUND CONDITIONS
      if (condition === "Clear") setBg("#ffe066");
      else if (condition === "Clouds") setBg("#9E9E9E");
      else if (condition === "Rain") setBg("#74b9ff");
      else if (condition === "Thunderstorm") setBg("#636e72");
      else if (condition === "Snow") setBg("#dfe6e9");
      else if (condition === "Mist") setBg("#b2bec3");


    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
      setWeather(null);
    }

    setLoading(false);
  };

  return (
    <div style={{ ...styles.container, backgroundColor: bg }}>
      <h1 style={styles.title}>🌦️ Weather App</h1>

      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button style={styles.button} onClick={getWeather}>
          Get Weather
        </button>

        {/* LOADING */}
        {loading && <p>⏳ Loading...</p>}

        {/* ERROR */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* WEATHER */}
        {weather && weather.main && weather.weather && (
          <div style={styles.result}>
            <h2>{weather.name}</h2>
            <h1>{weather.main.temp}°C</h1>

            {/* ICONS */}
            <h1 style={{ fontSize: "80px", margin: "10px 0" }}>
  {weather.weather[0].main === "Clouds" ? "☁️" :
   weather.weather[0].main === "Clear" ? "☀️" :
   weather.weather[0].main === "Rain" ? "🌧️" :
   weather.weather[0].main === "Thunderstorm" ? "⚡" :
   weather.weather[0].main === "Snow" ? "❄️" :
   weather.weather[0].main === "Mist" ? "🌫️" : "🌍"}
</h1>

            <p>{weather.weather[0].main}</p>
          </div>
        )}

        {/* HISTORY */}
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
    textAlign: "center",
    padding: "50px",
    minHeight: "100vh",
    fontFamily: "Arial",
    transition: "all 0.5s ease"
  },
  title: {
    marginBottom: "20px"
  },
  card: {
    width: "350px",
    margin: "auto",
    padding: "30px",
    borderRadius: "20px",
    backgroundColor: "rgba(255,255,255,0.9)",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)"
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer"
  },
  result: {
    marginTop: "20px"
  }
};