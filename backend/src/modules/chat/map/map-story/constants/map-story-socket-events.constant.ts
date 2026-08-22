export const MapStorySocketEvents = {
  SHARE_REQUESTED: 'map.share.requested',
  SHARE_ACCEPTED: 'map.share.accepted',
  SHARE_REJECTED: 'map.share.rejected',
  SESSION_STARTED: 'map.session.started',
  SESSION_ENDED: 'map.session.ended',
  SESSION_EXPIRED: 'map.session.expired',
  LOCATION_UPDATED: 'map.location.updated',
  MOMENT_CREATED: 'map.moment.created',
  MOMENT_EXPIRED: 'map.moment.expired',
  NOTIFICATION_CREATED: 'notification.created',
} as const;
