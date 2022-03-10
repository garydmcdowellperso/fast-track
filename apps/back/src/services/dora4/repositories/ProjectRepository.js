class ProjectRepository {
  constructor(repository) {
    this.repository = repository;
  }

  persist(projectEntity) {
    return this.repository.persist(projectEntity);
  }

  merge(projectEntity) {
    return this.repository.merge(projectEntity);
  }

  getByName(name) {
    return this.repository.getByName(name);
  }

  find() {
    return this.repository.find();
  }
}

export default ProjectRepository;
