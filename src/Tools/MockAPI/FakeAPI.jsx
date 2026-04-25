import { fakeApiEvents, fakeApiUsers, fakeApiClubs } from "./FakeAPIData";

function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getUserObject(userId) {
  return fakeApiUsers.find(user => user.id === Number(userId)) ?? null;
}

function getClubObject(clubId) {
  return fakeApiClubs.find(club => club.id === Number(clubId)) ?? null;
}

function hydrateEvent(event) {
  const club = getClubObject(event.clubId);

  return {
    ...event,
    club: club?.name ?? "",
    users: event.users
      .map(getUserObject)
      .filter(Boolean)
  };
}

function hydrateClub(club) {
  return {
    ...club,
    users: club.users
      .map(getUserObject)
      .filter(Boolean),

    admins: club.admins
      .map(getUserObject)
      .filter(Boolean),

    events: club.events
      .map(eventId => fakeApiEvents.find(event => event.id === Number(eventId)))
      .filter(Boolean)
      .map(hydrateEvent)
  };
}

export async function getEvents() {
  await delay();
  return fakeApiEvents.map(hydrateEvent);
}

export async function getEvent(eventId) {
  await delay();

  const event = fakeApiEvents.find(e => e.id == eventId);

  return { ...event, users: event.users.map(u => fakeApiUsers.find(user => user.id == u))};
}

export async function getUsers() {
  await delay();
  return fakeApiUsers;
}

export async function getUserById(userId) {
  await delay();

  if (!userId) return null;

  return getUserObject(userId);
}

export async function rsvpToEvent(eventId, userId) {
  await delay();

  const event = fakeApiEvents.find(event => event.id === Number(eventId));

  if (!event) {
    throw new Error("Event not found");
  }

  const numericUserId = Number(userId);

  if (!event.users.includes(numericUserId)) {
    event.users.push(numericUserId);
  }

  return hydrateEvent(event);
}

export async function cancelRsvpToEvent(eventId, userId) {
  await delay();

  const event = fakeApiEvents.find(event => event.id === Number(eventId));

  if (!event) {
    throw new Error("Event not found");
  }

  const numericUserId = Number(userId);
  event.users = event.users.filter(id => id !== numericUserId);

  return hydrateEvent(event);
}

export async function getClubs() {
  await delay();
  return fakeApiClubs.map(hydrateClub);
}

export async function getClubById(clubId) {
  await delay();

  const club = getClubObject(clubId);

  return club ? hydrateClub(club) : null;
}

export async function getClubAdmins(clubId) {
  await delay();

  const club = getClubObject(clubId);

  return club
    ? club.admins.map(getUserObject).filter(Boolean)
    : [];
}

export async function createEvent(eventData) {
  await delay();

  const newEvent = {
    id: fakeApiEvents.length + 1,
    name: eventData.name,
    description: eventData.description,
    clubId: Number(eventData.clubId),
    date: eventData.date,
    time: eventData.time,
    location: eventData.location,
    tag: eventData.tag,
    users: eventData.users?.map(Number) ?? [],
    stage: 0
  };

  fakeApiEvents.push(newEvent);

  const club = getClubObject(newEvent.clubId);

  if (club && !club.events.includes(newEvent.id)) {
    club.events.push(newEvent.id);
  }

  return hydrateEvent(newEvent);
}

export async function submitDraft(eventId) {
  const event = fakeApiEvents.find(e => e.id == eventId);

  if (!event) return null;

  event.stage = 1;

  return { ...event, users: event.users.map(u => fakeApiUsers.find(user => user.id == u)) };
}

export async function goLive(eventId) {
  const event = fakeApiEvents.find(e => e.id == eventId);
  
  if (!event) return null;
  
  event.stage = 2;
  
  return { ...event, users: event.users.map(u => fakeApiUsers.find(user => user.id == u)) };
}

export async function checkUserIn(eventId, userId) {

}