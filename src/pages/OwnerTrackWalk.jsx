import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { socket } from "../socket";
import toast from "react-hot-toast";

const getAddressFromCoords = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch {
    return "Unable to fetch address";
  }
};
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
  const [path, setPath] = useState([]);
  const [address, setAddress] = useState("Fetching address...");
  useEffect(() => {
    // join room
    socket.emit("join-walk", { bookingId });
  
    // 📍 LOCATION UPDATES
    socket.on("receive-location", async ({ lat, lng }) => {
      console.log("📍 Owner received:", lat, lng);
  
      setPosition([lat, lng]);
      setPath((prev) => [...prev, [lat, lng]]);
  
      const addr = await getAddressFromCoords(lat, lng);
      setAddress(addr);
    });
  
    // 🔔 WALK START / END NOTIFICATIONS
    socket.on("notify-owner", ({ message }) => {
      toast.success(message);
    });
  
    // 🛑 WALK ENDED
    socket.on("walk-ended", () => {
      toast("Walk ended 🏁", { icon: "🐾" });
      setPosition(null);
      setPath([]);
    });

  
    // 🧹 CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off("receive-location");
      socket.off("notify-owner");
      socket.off("walk-ended");
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
      ) : 
      
      (
       <>

{/* 📍 ADDRESS */}
          <div className="mb-4 p-4 border rounded-xl bg-gray-50">
            <p className="text-sm text-gray-500">Current Location</p>
            <p className="font-medium text-gray-800">{address}</p>
          </div>
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
{/* 🔵 WALK ROUTE LINE */}
  {path.length > 1 && (
    <Polyline positions={path} color="blue" />
  )}
          <Marker position={position}>
            <Popup>🐶 Your pet is here</Popup>
          </Marker>
        </MapContainer>
       
       </>
      )}
    </div>
  );
}
