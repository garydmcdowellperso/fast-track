class Contributor {
  constructor(
    identifier,
    identifierType,
    firstName,
    lastName,
    fullName,
    avatarUrl,
    creation_date,
    id = null
  ) {
    this.identifier = identifier;
    this.identifierType = identifierType;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = fullName;
    this.id = id;
    this.avatarUrl = avatarUrl;
    this.creation_date = creation_date;
  }
}

export default Contributor;
