import { useLocation, useHistory } from "react-router-dom";
import "./styles/Footer.css";

const Footer = () => {
  const location = useLocation();
  const history = useHistory();
  return (
    <footer>
      {location.pathname !== "/" && (
        <button onClick={() => history.goBack()}>&larr; Go Back</button>
      )}
      <h4>&copy; {new Date().getFullYear()} - Triviality</h4>
    </footer>
  );
};

export default Footer;
