const { createRequest, createResponse } = require('node-mocks-http');
const handlerModule = require('../pages/api/about');
const handler = handlerModule && handlerModule.default ? handlerModule.default : handlerModule;

// minimal test harness mimicking Jest API
function describe(desc, fn) {
  console.log(desc);
  fn();
}
function it(desc, fn) {
  try {
    fn();
    console.log('  ✓', desc);
  } catch (e) {
    console.error('  ✗', desc);
    console.error(e);
    process.exit(1);
  }
}
function expect(received) {
  return {
    toBe(expected) {
      if (received !== expected) throw new Error(`Expected ${expected}, got ${received}`);
    },
    toHaveProperty(prop, val) {
      if (!(prop in received)) throw new Error(`Missing property ${prop}`);
      if (val !== undefined && received[prop] !== val) throw new Error(`Property ${prop} expected ${val}, got ${received[prop]}`);
    }
  };
}

describe('/api/about handler', () => {
  it('returns 200 and the about text for GET requests', () => {
    const req = createRequest({ method: 'GET' });
    const res = createResponse();

    handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty('about');
    expect(typeof data.about).toBe('string');
  });

  it('returns 405 for non-GET methods', () => {
    const req = createRequest({ method: 'POST' });
    const res = createResponse();

    handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    const data = res._getJSONData();
    expect(data).toHaveProperty('error', 'Method not allowed');
  });
});
