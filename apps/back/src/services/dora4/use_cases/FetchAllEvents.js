async function FetchAllEvents({ eventRepository }) {
  return eventRepository.find();
}

export default FetchAllEvents;
