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
      <div>&copy; {new Date().getFullYear()} - Triviality</div>
    </footer>
  );
};

export default Footer;
