import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Row, Col } from 'antd';
import BusIcon from "../assets/Group 1.png";
import Header from '../Components/Header';
// Create custom icons
const userLocationIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background-color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    ">
      <div style="
        width: 15px;
        height: 15px;
        background-color: blue;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const busIcon = new L.Icon({
  iconUrl: BusIcon,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
});

interface BusPosition {
  busNumber: string;
  position: [number, number];
  timestamp: number;
}

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
        color: "#000"
      }}
    >
      Center Map
    </button>
  );
};

const UserComponent = () => {
  const [busPositions, setBusPositions] = useState<BusPosition[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number]>([12.9851912, 80.2333214]);
  const [hasCenteredMap, setHasCenteredMap] = useState(false);

  // Track user's position
  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude
        ]);
        console.log("Position updated");
        if (!hasCenteredMap) {
          setHasCenteredMap(true);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Please enable location permissions to see your position');
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [hasCenteredMap]);

  // Track bus positions
  useEffect(() => {
    const socket = io('http://localhost:4000');

    socket.on('busPosition', (data: BusPosition) => {
      setBusPositions(prev => [
        ...prev.filter(b => b.busNumber !== data.busNumber),
        data
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: '100vh', width: '100vw' }}
    >
      <Header isNormalUser={true}/>
      <Col style={{ height: '80%', width: '90%',marginTop:"5rem" }}>
        <MapContainer
          center={userPosition || [12.9716, 77.5946]}
          zoom={20}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {userPosition && (
            <Marker position={userPosition} icon={userLocationIcon}>
              <Popup>You are here!</Popup>
            </Marker>
          )}

          {busPositions.map((bus) => (
            <Marker key={bus.busNumber} position={bus.position} icon={busIcon}>
              <Popup>
                Bus {bus.busNumber}<br />
                Last update: {new Date(bus.timestamp).toLocaleTimeString()}
              </Popup>
            </Marker>
          ))}

          {userPosition && <CenterMapButton center={userPosition} />}
        </MapContainer>
      </Col>
    </Row>
  );
};

export default UserComponent;
