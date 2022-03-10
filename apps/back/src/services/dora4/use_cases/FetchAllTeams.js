async function FetchAllTeams({ teamRepository }) {
  return teamRepository.find();
}

export default FetchAllTeams;
