const _serializeSingleResult = (result) => {
  return {
    from: result.from,
    to: result.to,
    total: result.total,
    deployments: result.deployments,
  };
};

class DeploymentFrequencySerializer {
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

export default DeploymentFrequencySerializer;
