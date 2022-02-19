const _serializeSingleResult = (result) => {
  return {
    id: result.id,
    version: result.version,
    ticket: result.ticket,
    project: result.project,
    author: result.author,
    leadTimeToProduction: {
      seconds: result.seconds,
      minutes: result.minutes,
      hours: result.hours,
      days: result.days,
      weeks: result.weeks,
      months: result.months,
    },
  };
};

class TicketSerializer {
  serialize(data) {
    if (!data) {
      throw new Error("Expect data to be not undefined nor null");
    }
    if (Array.isArray(data)) {
      return data.map(_serializeSingleResult);
    }
    return _serializeSingleResult(data);
  }
}

export default TicketSerializer;
