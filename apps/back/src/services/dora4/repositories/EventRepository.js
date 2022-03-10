class EventRepository {
  constructor(repository) {
    this.repository = repository;
  }

  persist(eventEntity) {
    return this.repository.persist(eventEntity);
  }

  merge(eventEntity) {
    return this.repository.merge(eventEntity);
  }

  getByHash(hash) {
    return this.repository.getByHash(hash);
  }

  getByDate(from, to) {
    return this.repository.getByDate(from, to);
  }

  getByProject(project) {
    return this.repository.getByProject(project);
  }

  getByTicket(ticket) {
    return this.repository.getByTicket(ticket);
  }

  insert(eventEntity) {
    return this.repository.insert(eventEntity);
  }

  find() {
    return this.repository.find();
  }

  getByProjectAndDates(selectedProject, from, to) {
    return this.repository.getByProjectAndDates(selectedProject, from, to);
  }
}

export default EventRepository;
