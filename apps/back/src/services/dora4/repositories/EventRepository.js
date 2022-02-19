class EventRepository {
  constructor(repository) {
    this.repository = repository;
  }

  persist(clubEntity) {
    return this.repository.persist(clubEntity);
  }

  merge(clubEntity) {
    return this.repository.merge(clubEntity);
  }

  remove(clubId) {
    return this.repository.remove(clubId);
  }

  get(leagueId, teamId) {
    return this.repository.get(leagueId, teamId);
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

  assign(fixtureEntity) {
    return this.repository.assign(fixtureEntity);
  }

  insert(eventEntity) {
    return this.repository.insert(eventEntity);
  }

  find() {
    return this.repository.find();
  }
}

export default EventRepository;
