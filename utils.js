function generateUniqueOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${timestamp}${random}`;
}

module.exports = {
  generateUniqueOrderId
};
