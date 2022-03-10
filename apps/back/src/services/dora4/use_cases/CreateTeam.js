import Team from "../entities/Team";

import moment from "moment-timezone";

async function CreateTeam(
  teamName,
  selectedProjects,
  teamCollaborators,
  teamColour,
  { teamRepository }
) {
  if (!teamName) {
    throw new Error("No teamName");
  }
  if (!selectedProjects) {
    throw new Error("No selectedProjects");
  }
  if (!teamCollaborators) {
    throw new Error("No teamCollaborators");
  }
  if (!teamColour) {
    throw new Error("No teamColour");
  }

  const team = new Team(
    teamName,
    selectedProjects,
    teamCollaborators,
    teamColour,
    moment().format("X")
  );

  return teamRepository.persist(team);
}

export default CreateTeam;
