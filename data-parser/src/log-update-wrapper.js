module.exports.getLogUpdate = async function() {
  const module = await import('log-update');

  return module.default;
};
