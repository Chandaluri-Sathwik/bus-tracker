import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import L from 'leaflet';
import { useEffect } from 'react';
const PreBuiltTracks = ({ waypoints }: { waypoints: [number, number][] }) => {
  useEffect(() => {
    const map = L.map('map'); // Access Leaflet map instance

    L.Routing.control({
      waypoints: waypoints.map((point) => L.latLng(point[0], point[1])),
      routeWhileDragging: true,
    }).addTo(map);
  }, [waypoints]);

  return null;
};

const Tracks = () => {
  const preBuiltWaypoints: [number, number][] = [
    [12.9716, 77.5946], // Example: Bangalore
    [12.9750, 77.6050], // Example: Another point
    [12.9800, 77.6100], // Example: Destination
  ];

  return (
    <div style={{height:"90vh",width:"90vw"}}>
    <MapContainer center={[12.9716, 77.5946]} zoom={13} style={{ height: '80%', width: '50vw' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <PreBuiltTracks waypoints={preBuiltWaypoints} />
    </MapContainer></div>
  );
};

export default Tracks;