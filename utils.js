const fs = require('fs');
const csv = require('csv-parser');

function generateUniqueOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${timestamp}${random}`;
}

async function findRowsByEmail(csvPath, email) {
  if (!fs.existsSync(csvPath)) return null;
  const rows = [];

  return new Promise((resolve) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.email === email) {
          rows.push(row);
        }
      })
      .on('end', () => {
        resolve(rows);
      });
  });
}

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.AUTH_TOKEN;

  if (!authHeader || authHeader !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports = {
  generateUniqueOrderId,
  findRowsByEmail,
  checkAuth
};
