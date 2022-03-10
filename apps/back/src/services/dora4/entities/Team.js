class Team {
  constructor(
    teamName,
    selectedProjects,
    teamCollaborators,
    teamColour,
    creation_date,
    id = null
  ) {
    this.teamName = teamName;
    this.selectedProjects = selectedProjects;
    this.teamCollaborators = teamCollaborators;
    this.teamColour = teamColour;
    this.creation_date = creation_date;
    this.id = id;
  }
}

export default Team;
