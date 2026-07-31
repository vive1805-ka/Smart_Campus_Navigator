import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";

interface MapContainerProps {
  center: [number, number];
  zoom?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function MapContainer({
  center,
  zoom = 15,
  className = "h-full w-full",
  children,
}: MapContainerProps) {
  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      className={className}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {children}
    </LeafletMapContainer>
  );
}
