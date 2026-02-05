import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { socket } from "../socket";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function OwnerTrackWalk() {
  const { bookingId } = useParams();
 
  const [position, setPosition] = useState(null);
  useEffect(() => {
    socket.emit("join-walk", { bookingId });

    socket.on("receive-location", ({ lat, lng }) => {
      console.log("📍 Owner received:", lat, lng);
      setPosition({ lat, lng });
    });

    return () => {
      socket.off("receive-location");
    };
  }, [bookingId]);

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Live Walk Tracking</h1>
      <p className="text-gray-500 mb-6">
        Track your pet in real time 🐾
      </p>

      {!position ? (
        <div className="p-6 border rounded-xl text-center text-gray-500">
          Waiting for sitter location…
        </div>
      ) : (
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: "400px", width: "100%" }}
          className="rounded-xl border"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>🐶 Your pet is here</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}
