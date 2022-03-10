class EventRepositoryInMemory {
  _dataAsArray() {
    return Object.keys(this.data).map((key) => this.data[key]);
  }

  constructor() {
    this.index = 1;
    this.data = {};
  }

  persist(eventEntity) {
    const row = { ...eventEntity };
    const rowId = (this.index += 1);
    row.id = rowId;
    this.data[rowId] = row;
    return Promise.resolve(row);
  }

  merge(eventEntity) {
    const row = this.data[eventEntity.id];
    Object.assign(row, eventEntity);
    return Promise.resolve(row);
  }

  getByHash(hash) {
    const events = this._dataAsArray();
    return Promise.resolve(events.find((event) => event.hashValue === hash));
  }

  getByDate(from, to) {
    const events = this._dataAsArray();
    return Promise.resolve(
      events.find((event) => event.from >= from && event.to <= to)
    );
  }

  getByProject(project) {
    const events = this._dataAsArray();
    return Promise.resolve(events.find((event) => event.project === project));
  }

  getByTicket(ticket) {
    const events = this._dataAsArray();
    return Promise.resolve(events.find((event) => event.ticket === ticket));
  }

  find() {
    return Promise.resolve(this._dataAsArray());
  }
}

export default EventRepositoryInMemory;
