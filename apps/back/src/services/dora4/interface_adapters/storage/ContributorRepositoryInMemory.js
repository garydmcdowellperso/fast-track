class ContributorRepositoryInMemory {
  _dataAsArray() {
    return Object.keys(this.data).map((key) => this.data[key]);
  }

  constructor() {
    this.index = 1;
    this.data = {};
  }

  persist(icEntity) {
    const row = { ...icEntity };
    const rowId = (this.index += 1);
    row.id = rowId;
    this.data[rowId] = row;
    return Promise.resolve(row);
  }

  merge(icEntity) {
    const row = this.data[icEntity.id];
    Object.assign(row, icEntity);
    return Promise.resolve(row);
  }

  getByIdentifier(identifier, identifierType) {
    const ics = this._dataAsArray();
    return Promise.resolve(
      ics.find(
        (ic) =>
          ic.identifier === identifier && ic.identifierType === identifierType
      )
    );
  }

  find() {
    return Promise.resolve(this._dataAsArray());
  }
}

export default ContributorRepositoryInMemory;
