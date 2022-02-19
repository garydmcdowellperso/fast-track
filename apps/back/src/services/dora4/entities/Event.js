class Event {
  constructor(
    type,
    data,
    creation_date,
    branch,
    ticket,
    project,
    author,
    id = null
  ) {
    this.type = type;
    this.data = data;
    this.branch = branch;
    this.ticket = ticket;
    this.project = project;
    this.author = author;
    this.id = id;
    this.creation_date = creation_date;
  }
}

export default Event;
