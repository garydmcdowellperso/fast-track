class ContributorRepository {
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

  getByIdentifier(identifier, identifierType) {
    return this.repository.getByIdentifier(identifier, identifierType);
  }

  insert(eventEntity) {
    return this.repository.insert(eventEntity);
  }

  find() {
    return this.repository.find();
  }
}

export default ContributorRepository;
