async function FetchEventsByProject(project, { eventRepository }) {
  if (!project) {
    throw new Error("No project");
  }

  return eventRepository.getByProject(project);
}

export default FetchEventsByProject;
