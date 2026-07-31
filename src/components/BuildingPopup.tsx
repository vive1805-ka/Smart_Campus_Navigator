import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface FlyToProps {
  position: [number, number] | null;
}

export default function FlyTo({ position }: FlyToProps) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.2 });
    }
  }, [position, map]);

  return null;
}
