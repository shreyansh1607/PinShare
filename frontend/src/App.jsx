import "./app.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Star, FilterAlt } from "@mui/icons-material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from "./utils/axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import NewPinForm from "./components/NewPinForm";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const violetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function SetViewOnClick({ coords, shouldUpdate }) {
  const map = useMap();
  useEffect(() => {
    if (shouldUpdate) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, shouldUpdate, map]);
  return null;
}

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [showOnlyUserPins, setShowOnlyUserPins] = useState(false);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [center, setCenter] = useState({
    lat: 28.65195,
    lng: 77.23149,
  });
  const [shouldUpdateView, setShouldUpdateView] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = useCallback((id, lat, lng) => {
    console.log("Marker clicked:", { id, lat, lng });
    setCurrentPlaceId(id);
    setCenter({ lat, lng });
    setShouldUpdateView(true);
  }, []);

  const handleNewPin = useCallback(async (pinData) => {
    try {
      const newPin = {
        username: currentUsername,
        ...pinData,
        lat: newPlace.lat,
        long: newPlace.long,
      };

      console.log("Attempting to add pin:", { ...newPin });
      const response = await axios.post("/pins", newPin);
      console.log("Pin response:", response.data);
      
      setPins(prev => [...prev, response.data]);
      setNewPlace(null);
      setCurrentPlaceId(response.data._id);
      setShouldUpdateView(false);
    } catch (err) {
      console.error("Error adding pin:", err);
      alert(err.response?.data?.message || "Failed to add pin");
    }
  }, [currentUsername, newPlace]);

  // Memoize the MapEvents component
  const MapEventsComponent = useCallback(() => {
    const map = useMapEvents({
      dblclick: (e) => {
        if (currentUsername) {
          setNewPlace({
            lat: e.latlng.lat,
            long: e.latlng.lng,
          });
          setShouldUpdateView(false);
        } else {
          alert("Please login to add pins");
        }
      },
    });
    return null;
  }, [currentUsername]);

  // Filter pins based on the showOnlyUserPins state
  const filteredPins = useMemo(() => {
    if (!showOnlyUserPins || !currentUsername) return pins;
    return pins.filter(pin => pin.username === currentUsername);
  }, [pins, showOnlyUserPins, currentUsername]);

  // Memoize the pins rendering with filtered pins
  const renderedPins = useMemo(() => {
    return Array.isArray(filteredPins) && filteredPins.map((p) => (
      <Marker
        key={p._id}
        position={[p.lat, p.long]}
        icon={p.username === currentUsername ? violetIcon : redIcon}
        eventHandlers={{
          click: () => {
            console.log("Marker clicked, pin data:", p);
            handleMarkerClick(p._id, p.lat, p.long);
          },
        }}
      >
        <Popup
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
          className="custom-popup"
        >
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
              {Array.from({ length: p.rating }).map((_, i) => (
                <Star key={i} className="star" />
              ))}
            </div>
            <label>Information</label>
            <span className="username">
              Created by <b>{p.username}</b>
            </span>
            <span className="date">{format(p.createdAt)}</span>
          </div>
        </Popup>
      </Marker>
    ));
  }, [filteredPins, currentUsername, handleMarkerClick]);

  // Memoize the new place marker
  const newPlaceMarker = useMemo(() => {
    if (!newPlace) return null;
    return (
      <Marker 
        position={[newPlace.lat, newPlace.long]}
        icon={violetIcon}
      >
        <Popup
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
        >
          <NewPinForm onSubmit={handleNewPin} />
        </Popup>
      </Marker>
    );
  }, [newPlace, handleNewPin]);

  useEffect(() => {
    const getPins = async () => {
      try {
        console.log("Fetching pins...");
        const response = await axios.get("/pins");
        console.log("Received pins (detailed):", response.data);
        if (Array.isArray(response.data)) {
          console.log("First pin example:", response.data[0]);
          setPins(response.data);
        } else {
          console.error("Received non-array data for pins:", response.data);
          setPins([]);
        }
      } catch (err) {
        console.error("Error fetching pins:", err);
        setPins([]);
      }
    };
    getPins();
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  }, [myStorage]);

  // Toggle filter handler
  const handleFilterToggle = useCallback(() => {
    if (!currentUsername) {
      alert("Please login to filter pins");
      return;
    }
    setShowOnlyUserPins(prev => !prev);
  }, [currentUsername]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {(showLogin || showRegister) && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998
          }}
          onClick={() => {
            setShowLogin(false);
            setShowRegister(false);
          }}
        />
      )}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        minZoom={3}
        maxZoom={18}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsComponent />
        <SetViewOnClick coords={[center.lat, center.lng]} shouldUpdate={shouldUpdateView} />
        {renderedPins}
        {newPlaceMarker}
      </MapContainer>

      {currentUsername && (
        <button 
          className={`filter-button ${showOnlyUserPins ? 'active' : ''}`}
          onClick={handleFilterToggle}
        >
          <FilterAlt /> {showOnlyUserPins ? 'Show All Pins' : 'Show My Pins'}
        </button>
      )}

      {currentUsername ? (
        <button className="button logout" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Log in
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setCurrentUsername={setCurrentUsername}
          myStorage={myStorage}
        />
      )}
    </div>
  );
}

export default App;