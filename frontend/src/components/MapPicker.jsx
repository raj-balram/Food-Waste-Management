import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationMarker = ({ setPosition }) => {
  const [position, setLocalPosition] = useState(null);

  useMapEvents({
    click(e) {
      setLocalPosition(e.latlng);
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const MapPicker = ({ setCoordinates }) => {
  return (
    <MapContainer
      center={[23.5937, 78.9629]} // India center
      zoom={5}
      className="h-64 w-full rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker setPosition={setCoordinates} />
    </MapContainer>
  );
};

export default MapPicker;