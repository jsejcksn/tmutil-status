const {exec} = require('child_process');

const parse = statusString => {
  const castValue = str => {
    if (isNaN(Number(str))) return str;
    return Number(str);
  };
  const stripQuotes = str => {
    if (str.startsWith('"') && str.endsWith('"')) return str.slice(1, -1);
    return str;
  };
  const hasProperty = line => line.includes(' = ');
  const hasValue = line => (
    hasProperty(line)
    && line.endsWith(';')
  );
  const isNested = line => line.startsWith('        ');

  const lines = statusString.split('\n');
  const obj = {};
  let lastProp = '';
  let lastValue = {};
  for (const line of lines) {
    if (!hasProperty(line)) continue;
    const parts = line.slice(0, -1).split(' = ').map(value => value.trim());
    const key = stripQuotes(parts[0]);
    if (!isNested(line)) {
      if (Object.keys(lastValue).length) obj[lastProp] = lastValue;
      lastProp = key;
      lastValue = {};
    }
    if (hasValue(line)) {
      const value = castValue(stripQuotes(parts[1]));
      if (isNested(line)) lastValue[key] = value;
      else obj[key] = value;
    }
  }
  return obj;
};

const tmutilStatus = callback => new Promise((resolve, reject) => {
  try {
    if (process.platform !== 'darwin') {
      throw new Error('This module is only supported on macOS');
    }
    exec('tmutil status', (err, stdout, stderr) => {
      if (err) throw err;
      if (stderr) throw new Error(stderr);
      const trimmed = stdout.trim();
      const data = parse(trimmed);
      if (callback) callback(null, data);
      resolve(data);
    });
  }
  catch (err) {
    if (callback) callback(err);
    reject(err);
  }
});

module.exports = tmutilStatus;
