import {
    beforeEach,
    describe,
    expect,
    it,
} from '@jest/globals';

const loadScript = require('../src/js/load-script');

describe('loadScript', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should load a script and call the callback on success', (done) => {
    const url = 'https://example.com/test-script.js';
    loadScript(url, (err, script) => {
      expect(err).toBeNull();
      expect(script).toBeInstanceOf(HTMLScriptElement);
      expect(script.src).toBe(url);
      done();
    });

    const script = document.head.querySelector('script');
    script.onload();
  });

  it('should call the callback with an error on failure', (done) => {
    const url = 'https://example.com/test-script.js';
    loadScript(url, (err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe(`Failed to load script: ${url}`);
      done();
    });

    const script = document.head.querySelector('script');
    script.onerror();
  });

  it('should load a script without a callback', () => {
    const url = 'https://example.com/test-script.js';
    loadScript(url);

    const script = document.head.querySelector('script');
    expect(script).toBeInstanceOf(HTMLScriptElement);
    expect(script.src).toBe(url);
  });
});
