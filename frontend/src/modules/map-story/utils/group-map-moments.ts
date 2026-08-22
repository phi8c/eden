import type { MapMoment } from "../types";

export interface MapMomentGroup {
  id: string;
  latitude: number;
  longitude: number;
  moments: MapMoment[];
}

const GROUP_RADIUS_METERS = 5;
const EARTH_RADIUS_METERS = 6371000;

export function groupMapMoments(moments: MapMoment[]): MapMomentGroup[] {
  const groups: MapMomentGroup[] = [];

  moments.forEach((moment) => {
    const group = groups.find(
      (item) =>
        getDistanceMeters(
          item.latitude,
          item.longitude,
          moment.latitude,
          moment.longitude,
        ) <= GROUP_RADIUS_METERS,
    );

    if (!group) {
      groups.push({
        id: `moment-group-${moment.id}`,
        latitude: moment.latitude,
        longitude: moment.longitude,
        moments: [moment],
      });
      return;
    }

    group.moments.push(moment);
    group.latitude = average(group.moments.map((item) => item.latitude));
    group.longitude = average(group.moments.map((item) => item.longitude));
  });

  return groups;
}

function getDistanceMeters(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
) {
  const dLat = toRadians(latB - latA);
  const dLng = toRadians(lngB - lngA);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latA)) *
      Math.cos(toRadians(latB)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}
