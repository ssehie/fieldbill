const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = process.cwd();

const PASS = 'PASS';
const WARN = 'WARN';
const FAIL = 'FAIL';

const appConfig = readJson('app.json').expo;
const easConfig = readJson('eas.json');
const packageJson = readJson('package.json');
const localEnv = readEnvFile('.env');

const results = [];

checkNativeVersions();
checkBuildProfiles();
checkDependencies();
checkLocalEnv();
checkGitState();

const failures = results.filter((result) => result.level === FAIL);
const warnings = results.filter((result) => result.level === WARN);

console.log('FieldBill tester-release preflight\n');

for (const result of results) {
  console.log(`${result.level.padEnd(4)} ${result.label}`);
  if (result.detail) {
    console.log(`     ${result.detail}`);
  }
}

console.log('');

if (failures.length > 0) {
  console.log(`Preflight failed with ${failures.length} blocking issue(s).`);
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(`Preflight passed with ${warnings.length} warning(s).`);
  process.exit(0);
}

console.log('Preflight passed with no warnings.');

function checkNativeVersions() {
  const iosBuildNumber = appConfig?.ios?.buildNumber;
  const androidVersionCode = appConfig?.android?.versionCode;

  if (!isPositiveIntegerString(iosBuildNumber)) {
    push(FAIL, 'iOS buildNumber is missing or invalid in app.json.', `Current value: ${String(iosBuildNumber)}`);
  } else {
    push(PASS, `iOS buildNumber baseline is ${iosBuildNumber}.`);
  }

  if (!Number.isInteger(androidVersionCode) || androidVersionCode < 1) {
    push(FAIL, 'Android versionCode is missing or invalid in app.json.', `Current value: ${String(androidVersionCode)}`);
  } else {
    push(PASS, `Android versionCode baseline is ${androidVersionCode}.`);
  }
}

function checkBuildProfiles() {
  const versionSource = easConfig?.cli?.appVersionSource;
  const internal = easConfig?.build?.internal;
  const releaseApk = easConfig?.build?.['release-apk'];
  const production = easConfig?.build?.production;

  if (versionSource !== 'local' && versionSource !== 'remote') {
    push(FAIL, 'EAS appVersionSource is missing or invalid.', `Current value: ${String(versionSource)}`);
  } else {
    push(PASS, `EAS appVersionSource is ${versionSource}.`);
  }

  checkAndroidApkProfile('internal', internal);
  checkAndroidApkProfile('release-apk', releaseApk);

  if (!production) {
    push(FAIL, 'Missing EAS production build profile.');
  } else if (production.distribution !== 'store' || production.android?.buildType !== 'app-bundle') {
    push(FAIL, 'Production profile is not configured for Play upload.', 'Expected distribution=store and android.buildType=app-bundle.');
  } else if (production.autoIncrement !== true) {
    push(FAIL, 'Production profile is missing autoIncrement.', 'Store builds should auto-increment native versions.');
  } else {
    push(PASS, 'Production profile is configured for Play AAB builds with autoIncrement.');
  }

  if (versionSource === 'local') {
    push(
      WARN,
      'Local EAS versioning is active.',
      'After every EAS tester/store build, commit the bumped app.json so the next machine does not reuse stale native versions.'
    );
  }
}

function checkAndroidApkProfile(name, profile) {
  if (!profile) {
    push(FAIL, `Missing EAS ${name} build profile.`);
    return;
  }

  if (profile.distribution !== 'internal' || profile.android?.buildType !== 'apk') {
    push(FAIL, `${name} profile is not configured for tester APK delivery.`, 'Expected distribution=internal and android.buildType=apk.');
    return;
  }

  if (profile.autoIncrement !== true) {
    push(WARN, `${name} profile does not auto-increment native versions.`, 'Testers may hit install/update collisions on repeated APK builds.');
    return;
  }

  push(PASS, `${name} profile is configured for installable tester APKs with autoIncrement.`);
}

function checkDependencies() {
  const purchasesVersion = packageJson?.dependencies?.['react-native-purchases'];

  if (!purchasesVersion) {
    push(FAIL, 'react-native-purchases is missing from dependencies.');
  } else {
    push(PASS, `react-native-purchases is installed (${purchasesVersion}).`);
  }
}

function checkLocalEnv() {
  if (!localEnv.exists) {
    push(
      WARN,
      'No local .env file found.',
      'This is fine for a plain tester APK, but purchase testing needs RevenueCat keys in EAS and usually in a local .env too.'
    );
    return;
  }

  const revenueCatKeys = [
    'EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY',
    'EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY',
    'EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID',
    'EXPO_PUBLIC_REVENUECAT_OFFERING_ID',
  ];

  const missingKeys = revenueCatKeys.filter((key) => !localEnv.values[key]);
  if (missingKeys.length > 0) {
    push(
      WARN,
      'Local .env is missing some RevenueCat values.',
      `Missing: ${missingKeys.join(', ')}`
    );
  } else {
    push(PASS, 'Local .env has the core RevenueCat values.');
  }
}

function checkGitState() {
  try {
    const statusOutput = execSync('git status --short', {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    }).trim();

    if (!statusOutput) {
      push(PASS, 'Git working tree is clean.');
      return;
    }

    const lines = statusOutput.split(/\r?\n/).filter(Boolean);
    push(
      WARN,
      'Git working tree has uncommitted changes.',
      `${lines.length} changed path(s). Make sure the tester build matches the exact state you want to hand out.`
    );
  } catch (error) {
    push(WARN, 'Could not inspect git working tree.', normalizeError(error));
  }
}

function readJson(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function readEnvFile(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return { exists: false, values: {} };
  }

  const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/);
  const values = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    values[key] = value;
  }

  return { exists: true, values };
}

function isPositiveIntegerString(value) {
  return typeof value === 'string' && /^[1-9]\d*$/.test(value);
}

function normalizeError(error) {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return String(error);
}

function push(level, label, detail = '') {
  results.push({ level, label, detail });
}
