async function FetchAllCollaborators({ contributorRepository }) {
  return contributorRepository.find();
}

export default FetchAllCollaborators;
