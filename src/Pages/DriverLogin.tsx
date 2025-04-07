import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import instance from '../config/_axios';
import { Row, Col, Form, Button, Card } from "antd";
import { TextField, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { MapContainer, TileLayer, Marker, Popup ,useMap} from 'react-leaflet';
import Header from '../Components/Header';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BusIcon from "../assets/Group 1.png";
import PreLoader from '../Components/PreLoader';
const busIcon = new L.Icon({
  iconUrl: BusIcon,
  iconSize: [40,40],
  iconAnchor: [12, 41],
});
const DriverComponent = () => {
  const [form] = Form.useForm();
  const socketRef = useRef<Socket | null>(null);
  const watcherRef = useRef<number | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [driverPosition, setDriverPosition] = useState<[number, number]>([ 12.985207, 80.2333618 ]);
  const [isLoggedIn,setIsLoggedIn]=useState(false);
  const [hasCenteredMap, setHasCenteredMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  useEffect(() => {
	const sessionFlag = localStorage.getItem("sessionExpired");
	if (sessionFlag === "true") {
		window.alert("Session Expired Kindly Relogin");
	}
}, []);
  const CenterMapButton = ({ center }: { center: [number, number] }) => {
	const map = useMap();
  
	const handleClick = () => {
	  map.setView(center, 30); 
	};
  
	return (
	  <button
		onClick={handleClick}
		style={{
		  position: 'absolute',
		  bottom: '20px',
		  right: '20px',
		  zIndex: 1000,
		  backgroundColor: '#fff',
		  border: '1px solid #ccc',
		  borderRadius: '5px',
		  padding: '10px',
		  cursor: 'pointer',
		  color:"#000"
		}}
	  >
		Center Map
	  </button>
	);
  };
    const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const values = await form.validateFields();
      
      const response = await instance.post('/login-driver', {
        username: values.username,
        password: values.password
      });

      if (response.status === 201) {
        console.log('Login successful');
        const { token } = response.data;
        setIsLoggedIn(true);
		localStorage.setItem("authToken",token);
        const newSocket = io('http://localhost:4000', {
          auth: { token },
        });

        socketRef.current = newSocket;

        newSocket.on('connect', () => {
          console.log('WebSocket connected');
          
          // Initial position update
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const initialPos: [number, number] = [
                position.coords.latitude,
                position.coords.longitude
              ];
              setDriverPosition(initialPos);
              setIsLoggedIn(true)
              newSocket.emit('positionUpdate', initialPos);
            },
            (error) => console.error('Initial position error:', error),
            { enableHighAccuracy: true }
          );

          watcherRef.current = navigator.geolocation.watchPosition(
            (position) => {
              const updatedPos: [number, number] = [
                position.coords.latitude,
                position.coords.longitude
              ];
              setDriverPosition(updatedPos);
              newSocket.emit('positionUpdate', updatedPos);
			  if (!hasCenteredMap) {
				setHasCenteredMap(true); 
			  }
            },
            (error) => console.error('Geolocation error:', error),
            { enableHighAccuracy: true, maximumAge: 5000 }
          );
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watcherRef.current) {
        navigator.geolocation.clearWatch(watcherRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <>
	{isLoggedIn && mapLoading && <PreLoader/>}
    {!isLoggedIn && 
    <Row justify="center"   style={{ width:"100vw", maxWidth: "400px", margin:"0 auto" }}>
				<Col span={24}>
					<Card
						style={{
							backgroundColor: "#ffffff",
							borderRadius: "15px",
							boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
							padding: "30px",
							margin:"0 20px 0 20px"
						}}
					>
						<h2
							style={{
								fontSize: "1.5rem",
								fontWeight: "600",
								textAlign: "center",
								color: "#333",
								marginBottom: "20px",
							}}
						>
							Login
						</h2>

						<Form form={form} name="login" layout="vertical" onFinish={handleSubmit}>
							<Form.Item
								name={"username"}
								rules={[
									{
										required: true,
										message: "Please enter your user name",
									},
								]}
								label={
									<span style={{ fontWeight: "600", color: "#555" }}>
										Enter your Credentials:
									</span>
								}
							>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="username"
									label="User Name"
									name="username"
									margin="normal"
									autoFocus
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "10px",
											"& fieldset": { borderColor: "#ccc" },
											"&:hover fieldset": { borderColor: "#888" },
											"&.Mui-focused fieldset": { borderColor: "#6a11cb" },
										},
										"& .MuiInputBase-input": {
											padding: "18px 14px",
										},
									}}
								/>
							</Form.Item>

							<Form.Item name={"password"} rules={[{ required: true }]}>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									label="Password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									sx={{
										"& .MuiOutlinedInput-root": {
											borderRadius: "10px",
											"& fieldset": { borderColor: "#ccc" },
											"&:hover fieldset": { borderColor: "#888" },
											"&.Mui-focused fieldset": { borderColor: "#6a11cb" },
										},
										"& .MuiInputBase-input": {
											padding: "18px 14px",
										},
									}}
									InputProps={{
										endAdornment: (
											<IconButton
												onClick={() => setShowPassword(!showPassword)}
												sx={{ padding: "10px" }}
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										),
									}}
								/>
							</Form.Item>
							<Form.Item style={{ textAlign: "center" }}>
								<Button
									type="primary"
									htmlType="submit"
									block
									style={{
										background: "black",
										border: "none",
										borderRadius: "8px",
										padding: "10px 0px",
										fontWeight: "bold",
										display: "flex",
										alignItems: "center",
										width: "60%",
										justifyContent: "center",
										color: "#ccfeef",
										fontSize: "1rem",
									}}
									disabled={isLoading}
								>
									Login !!
									{isLoading && (
										<div
											style={{
												width: "16px",
												height: "16px",
												border: "2px solid #ffffff",
												borderTop: "2px solid #6a11cb",
												borderRadius: "50%",
												animation: "spin 1s linear infinite",
												marginLeft: "10px",
											}}
										></div>
									)}
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Col>
			</Row>
}	
{isLoggedIn && (
  <Row
    justify="center"
    align="middle"
    style={{ height: '100vh', width: '100vw',gap:'0' }}
  >
	<Header isNormalUser={false}/>
    <Col style={{ height: '80%', width: '90%', marginTop:"5rem"}}>
      <MapContainer
        center={driverPosition}
        zoom={20}
        style={{ height: '100%', width: '100%' }}
		whenReady={() => setMapLoading(false)} 
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {driverPosition && (
          <Marker position={driverPosition} icon={busIcon}>
            <Popup>You are here!</Popup>
          </Marker>
        )}
        {driverPosition && <CenterMapButton center={driverPosition} />}
      </MapContainer>
    </Col>
  </Row>
)}

      	{/* CSS for Spinner */}
			<style>{`
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}</style>
    </>
  )
};

export default DriverComponent;