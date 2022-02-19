const _serializeSingleResult = (result) => {
  return {
    from: result.from,
    to: result.to,
    total: result.total,
    failures: result.failures,
  };
};

class ChangeRateFailureSerializer {
  serialize(data) {
    if (!data) {
      throw new Error("Expect data to be not undefined nor null");
    }
    if (Array.isArray(data)) {
      return data.map(_serializeSingleResult);
    }
    return _serializeSingleResult(data);
  }
}

export default ChangeRateFailureSerializer;
