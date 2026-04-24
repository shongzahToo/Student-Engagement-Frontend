import { fakeApiEvents, fakeApiUsers, fakeApiGroups } from "./FakeAPIData";

function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getEvents() {
  await delay();
  return fakeApiEvents;
}

export async function getUsers() {
  await delay();
  return fakeApiUsers;
}

export async function getUserById(userId) {
  await delay();

  if (!userId) return null;

  return fakeApiUsers.find(user => user.id === Number(userId)) ?? null;
}

export async function rsvpToEvent(eventId, userId) {
  console.log(`RSVPing user ${userId} to event ${eventId}`);
  await delay();
  const event = fakeApiEvents.find(e => e.id == eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (!event.users.includes(userId)) {
    event.users.push(userId);
  }
}

export async function cancelRsvpToEvent(eventId, userId) {
  await delay();

  const event = fakeApiEvents.find(e => e.id === Number(eventId));

  if (!event) {
    throw new Error("Event not found");
  }

  const userIndex = event.users.indexOf(userId);
  if (userIndex !== -1) {
    event.users.splice(userIndex, 1);
  }
}

export async function getGroups() {
  await delay();
  return fakeApiGroups;
}