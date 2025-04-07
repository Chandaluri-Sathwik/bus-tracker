import "./PreLoader.css"; // Import the CSS file for animations
import Logo from "../assets/Group 1.png"// Replace with your logo's path

const PreLoader = () => {
  return (
    <div className="preloader-container">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="preloader-logo" />

      {/* Circular Animation */}
      <div className="radial-circle"></div>
    </div>
  );
};

export default PreLoader;
