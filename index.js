const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

const tmutilStatus = async () => {
  try {
    const status = await exec('tmutil status');
    const {stdout} = status;
    const trimmed = stdout.trim();
    return parse(trimmed);
  }
  catch (err) {
    console.error(err.stderr);
    throw err;
  }
};

module.exports = tmutilStatus;
