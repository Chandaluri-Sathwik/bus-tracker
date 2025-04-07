import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserComponent from './Pages/MapComponent';
import DriverComponent from './Pages/DriverLogin';
import DriverRegister from './Pages/DriverRegister';
const App: React.FC = () => {
	return (
		<Router basename="/bustracker">
			<Routes>
				<Route path="/login" element={<DriverComponent />} />
				<Route path="/home" index element={<UserComponent />} />
				<Route path="/register" index element={<DriverRegister/>}/>
			</Routes>
		</Router>
	);
};

export default App;
