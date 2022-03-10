import Project from "../entities/Project";

import moment from "moment-timezone";

async function CreateProject(projectName, { projectRepository }) {
  if (!projectName) {
    throw new Error("No projectName");
  }

  const project = new Project(projectName, moment().format("X"));

  return projectRepository.persist(project);
}

export default CreateProject;
