const buildQueryContentFromBody = (body) => {
  const keys = Object.keys(body);
  const stringifiedKeys = keys.join(", ");
  const stringifiedValues = keys.map((key) => body[key]).join("', '");
  return { stringifiedKeys, stringifiedValues };
};

module.exports = { buildQueryContentFromBody };
