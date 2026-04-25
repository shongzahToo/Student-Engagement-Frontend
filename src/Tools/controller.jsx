let debug = false;
let urlBase = debug ? "http://192.168.1.156:8080" : "https://otc.nyxerinys.dev/api";

async function getData(path) {
    try {
        const response = await fetch(urlBase + path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error); you gonna be running it on the server so
    }
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);

  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear().toString().slice(-2);

  let hours = date.getHours();
  let minutes = date.getMinutes();

  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // convert 0 -> 12

  minutes = minutes.toString().padStart(2, '0');

  return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
}

async function postData(path, data) {
    try {
        const response = await fetch(urlBase + path, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function getUserById(userId) {
    return await getData(`/users/${userId}`) ?? null;
}

export async function getClubById(clubId) {
    return await getData(`/clubs/${clubId}`) ?? null;
}

export async function getFormatedEvent(eventId) {
    const tempEvent = await getEvent(eventId)
    const club = await getClubById(tempEvent.clubId)
    return {
        ...tempEvent,
        club: club?.name ?? ""
    }
}

export async function getEvents() {
    return await getData('/events')
}

export async function getEvent(eventId) {
    return await getData(`/events/${eventId}`) ?? null;
}

export async function getUsers() {
    return await getData('/users')
}

export async function rsvpToEvent(eventId, userId) {
    return await postData(`/events/${eventId}/rsvp`, {userId: userId})
}

export async function getClubs() {
    return await getData(`/clubs`)
}

export async function getClubAdmins(clubId) {
    const club = getClubById(clubId);

    return club.users.filter(u => u.admin)
}

export async function postCreateEvent(adminId, eventInfo) {
    const params = {
        adminId: adminId,
        name: eventInfo.name,
        description: eventInfo.description,
        location: eventInfo.location,
        dateTime: formatDateTime(eventInfo.dateTime),
        clubId: eventInfo.clubId,
        tag: eventInfo.tag,
        requirements: {
            facilities: eventInfo.facilities,
            it: eventInfo.it,
            finance: eventInfo.finance,
        }
    }

    return await postData(`/events/create`, params)
}

export async function submitDraft(eventId, adminId) {
    return await postData(`/events/${eventId}/submit`, {adminId: adminId})
}

export async function approveEvent(adminId, eventId) {
    return await postData(`/events/${eventId}/approve`, {adminId: adminId})
}

export async function publishEvent(adminId, eventId) {
    return await postData(`/events/${eventId}/publish`, {adminId: adminId})
}

export async function completeEvent(adminId, eventId) {
    return await postData(`/events/${eventId}/complete`, {adminId: adminId})
}

export async function userCheckin(eventId, adminId, userId) {
    return await postData(`/events/${eventId}`, {adminId: adminId, userId: userId })
}

export async function userJoinClub(clubId, userId) {
    return await postData(`/clubs/${clubId}/join`, {userId: userId})
}

export async function approveUserJoinClub(clubId, userId, adminId) {
    return await postData(`/clubs/${clubId}/approveJoin`, {userId: userId, adminId: adminId})
}


export async function getFeedbacks(eventId) {
    return await getData(`/feedback/${eventId}`)
}

export async function submitFeedback(userId, eventId, rating, comment) {
    return await postData(`/feedback/create`, {
        userId: userId,
        eventId: eventId,
        rating: rating - 1,
        comment: comment
    })
}