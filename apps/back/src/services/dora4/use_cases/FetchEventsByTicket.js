async function FetchEventsByTicket(ticket, { eventRepository }) {
  if (!ticket) {
    throw new Error("No ticket");
  }

  return eventRepository.getByTicket(ticket);
}

export default FetchEventsByTicket;
