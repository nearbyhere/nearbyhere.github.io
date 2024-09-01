import "./App.css";
import "leaflet/dist/leaflet.css";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function App() {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch("/data3.geojson")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched GeoJSON data:", data); // Log the fetched data
        setGeoJsonData(data);
      });
  }, []);

  // Convert GeoJSON features to CircleMarker components
  const geoJsonMarkers = geoJsonData?.features.map((feature, index) => {
    const [lng, lat] = feature.geometry.coordinates;
    console.log("Creating circle marker at:", [lat, lng]); // Log circle marker creation
    return (
      <CircleMarker
        key={index}
        center={[lat, lng]}
        radius={4}
        fillColor="white"
        color="black"
        weight={1}
        opacity={1}
        fillOpacity={1}
      >
        <Popup>{feature.properties.name}</Popup>
      </CircleMarker>
    );
  });

  // Define a dashed polyline (example coordinates)
  const ToC = [
    [-23.4394, -5000],
    [-23.4394, 5000],
  ];

  return (
    <div className="map-container">
      <MapContainer
        center={[0, 45]}
        zoom={3}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geoJsonMarkers}

        <Polyline
          positions={ToC}
          pathOptions={{ color: 'blue', dashArray: '2, 5', noClip: true, weight: 2 }}
        />
      </MapContainer>
      <div className="info-bar">
        <h2>Information Bar</h2>
        <p>Details about the map or selected marker will go here.</p>
      </div>
    </div>
  );
}
