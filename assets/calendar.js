// Load & parse ICS → FullCalendar events
async function loadICS(url) {
  const response = await fetch(url);
  const text = await response.text();

  const jcalData = ICAL.parse(text);
  const comp = new ICAL.Component(jcalData);
  const events = comp.getAllSubcomponents("vevent");

  return events.map(ev => {
    const e = new ICAL.Event(ev);

    // OPTION 1: fully anonymised
    const bookingTitle = "Booked";

    // OPTION 2: keep original name but prepend "Booked - "
    // const bookingTitle = `Booked - ${e.summary || ""}`.trim();

    return {
      title: bookingTitle,
      start: e.startDate.toJSDate(),
      end: e.endDate.toJSDate(),
      allDay: true
    };
  });
}

// Initialise calendar
document.addEventListener("DOMContentLoaded", async function () {
  //const icsUrl = "https://www.simplyowners.net/ical/cb56a354b405ec1815abfbab372c6f802452adff/22988571.ics";
  const originalICS =
  "https://www.simplyowners.net/ical/cb56a354b405ec1815abfbab372c6f802452adff/22988571.ics";
  const icsUrl =
  "https://api.allorigins.win/raw?url=" + encodeURIComponent(originalICS);

  const parsedEvents = await loadICS(icsUrl);
  const calendarEl = document.getElementById("calendar");

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: parsedEvents,
  });

  calendar.render();
});
