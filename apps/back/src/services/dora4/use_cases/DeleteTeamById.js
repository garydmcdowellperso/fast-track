async function DeleteTeamById(id, { teamRepository }) {
  if (!id) {
    throw new Error("No id");
  }

  return teamRepository.remove(id);
}

export default DeleteTeamById;
