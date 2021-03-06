class TeamRepository {
  constructor(repository) {
    this.repository = repository;
  }

  persist(eventEntity) {
    return this.repository.persist(eventEntity);
  }

  merge(eventEntity) {
    return this.repository.merge(eventEntity);
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

  remove(id) {
    return this.repository.remove(id);
  }

  find() {
    return this.repository.find();
  }
}

export default TeamRepository;
