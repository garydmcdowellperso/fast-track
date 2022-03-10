class Event {
  constructor(
    type,
    data,
    hashValue,
    creation_date,
    branch,
    ticket,
    project,
    author,
    id = null
  ) {
    this.type = type;
    this.data = data;
    this.hashValue = hashValue;
    this.creation_date = creation_date;
    this.branch = branch;
    this.ticket = ticket;
    this.project = project;
    this.author = author;
    this.id = id;
  }
}

export default Event;
