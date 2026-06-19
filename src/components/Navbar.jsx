import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/about">About</Link> |{" "}
      <Link to="/project">Project</Link>
    </nav>
  );
}

export default Navbar;
<nav style={{ padding: "10px", background: "#222" }}>
  <Link style={{ color: "white", margin: "10px" }} to="/">Home</Link>
  <Link style={{ color: "white", margin: "10px" }} to="/about">About</Link>
  <Link style={{ color: "white", margin: "10px" }} to="/project">Project</Link>
</nav>