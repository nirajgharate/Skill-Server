import http from 'http';

const data = JSON.stringify({
  name: 'Test Worker',
  email: 'testworker@example.com',
  password: 'Test1234',
  phone: '+911234567890',
  profession: 'electrician',
  experienceYears: 5,
  serviceArea: 'Mumbai',
  bio: 'Hello',
  hourlyRate: 500,
});

const options = {
  hostname: 'localhost',
  port: 5004,
  path: '/api/auth/signup-worker',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('BODY', body);
  });
});

req.on('error', (err) => {
  console.error('REQ ERROR', err.message);
});

req.write(data);
req.end();
