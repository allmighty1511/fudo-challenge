if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (!process.env.VITE_API_BASE_URL) {
  const fs = require('fs');
  const path = require('path');
  try {
    const envFile = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(/^(\w+)=(.*)$/);
      if (match) process.env[match[1]] = match[2];
    }
  } catch { /* .env file is optional in CI */ }
}
