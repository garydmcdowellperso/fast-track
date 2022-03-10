import moment from "moment-timezone";

async function FetchEventsByProjectAndDate(
  selectedProject,
  from,
  to,
  { eventRepository }
) {
  if (!from) {
    throw new Error("No from");
  }
  if (!to) {
    throw new Error("No to");
  }

  console.log("selectedProject", selectedProject);
  const newFrom = moment(from, "DD/MM/YYYY").startOf("day").unix();
  const newTo = moment(to, "DD/MM/YYYY").endOf("day").unix();

  return eventRepository.getByProjectAndDates(
    selectedProject,
    newFrom.toString(10),
    newTo.toString(10)
  );
}

export default FetchEventsByProjectAndDate;
