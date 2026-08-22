import type { MapShareSession } from "../types";

export function getMapShareRemainingLabel(session: MapShareSession | null) {
  if (!session) {
    return "Dang chia se";
  }

  const expiresAt =
    session.expiresAt ??
    (session.acceptedAt
      ? new Date(
          new Date(session.acceptedAt).getTime() +
            session.durationMinutes * 60000,
        ).toISOString()
      : null);

  if (!expiresAt) {
    return "Dang chia se";
  }

  const remainingMs = new Date(expiresAt).getTime() - Date.now();

  if (remainingMs <= 0) {
    return "Sap het han";
  }

  const totalMinutes = Math.ceil(remainingMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes}p`;
  }

  return `${hours}h ${minutes}p`;
}

export function getMapShareStatusText(params: {
  session: MapShareSession | null;
  canShowDecision: boolean;
}) {
  const { session, canShowDecision } = params;

  if (session?.status === 1 || session?.acceptedAt) {
    return getMapShareRemainingLabel(session);
  }

  if (canShowDecision) {
    return "Co yeu cau chia se vi tri";
  }

  if (session?.status === 0) {
    return "Dang cho doi phuong";
  }

  return "Gui yeu cau chia se vi tri";
}
