import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserComponent from './Pages/MapComponent';
import DriverComponent from './Pages/DriverLogin';
const App: React.FC = () => {
	return (
		<Router basename="/bustracker">
			<Routes>
				<Route path="/login" element={<DriverComponent />} />
				<Route path="/home" index element={<UserComponent />} />
			</Routes>
		</Router>
	);
};

export default App;
