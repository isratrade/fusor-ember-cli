import {
  PresenceValidator,
  EqualityValidator,
  LengthValidator,
  PasswordValidator,
  RequiredPasswordValidator,
  UniquenessValidator,
  RegExpValidator,
  AlphaNumericDashUnderscoreValidator,
  IpRangeValidator,
  IpAddressValidator,
  CidrValidator,
  IpSubnetValidator,
  MacAddressValidator,
  HostnameValidator,
  HostAddressValidator
} from '../../../utils/validators';


import { module, test } from 'qunit';

module('Unit | Utility | validators');

test('PresenceValidator accepts valid values', function (assert) {
  let presenceValidator = PresenceValidator.create({});
  let validValues = [
    {},
    '\n\t Hello',
    'Hello world',
    [1, 2, 3]
  ];
  validValues.forEach((value) => {
    assert.ok(presenceValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(presenceValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(presenceValidator.getMessages(value).length, 0);
  });
});

test('PresenceValidator rejects invalid values', function (assert) {
  let presenceValidator = PresenceValidator.create({});
  let invalidValues = [
    null,
    undefined,
    '',
    [],
    '\n\t',
    '  '
  ];
  invalidValues.forEach((value) => {
    assert.ok(presenceValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(presenceValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(presenceValidator.getMessages(value).length, 1);
    assert.equal(presenceValidator.getMessages(value)[0], 'This field cannot be blank.');
  });
});

test('EqualityValidator accepts valid values', function (assert) {
  let equalityValidator = EqualityValidator.create({equals: 'test equals'});
  const value = 'test equals';
  assert.ok(equalityValidator.isValid(value), `"${value}" was not accepted as valid`);
  assert.notOk(equalityValidator.isInvalid(value), `"${value}" was rejected as invalid`);
  assert.equal(equalityValidator.getMessages(value).length, 0);
});

test('EqualityValidator rejects invalid values', function (assert) {
  let equalityValidator = EqualityValidator.create({equals: 'test equals'});
  const value = 'should fail';
  assert.ok(equalityValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
  assert.notOk(equalityValidator.isValid(value), `"${value}" was accepted as valid`);
  assert.equal(equalityValidator.getMessages(value).length, 1);
  assert.equal(equalityValidator.getMessages(value)[0], 'This value does not match.');
});

test('LengthValidator accepts valid minimum length', function (assert) {
  let lengthValidator = LengthValidator.create({min: 5});
  let validValues = [
    null,
    undefined,
    '',
    'test5',
    'test 6',
    'test test test test test test test test test test test test test test'
  ];

  validValues.forEach((value) => {
    assert.ok(lengthValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(lengthValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(lengthValidator.getMessages(value).length, 0);
  });
});

test('LengthValidator rejects invalid minimum length', function (assert) {
  let lengthValidator = LengthValidator.create({min: 5});
  const value = 'fail';
  assert.ok(lengthValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
  assert.notOk(lengthValidator.isValid(value), `"${value}" was accepted as valid`);
  assert.equal(lengthValidator.getMessages(value).length, 1);
  assert.equal(lengthValidator.getMessages(value)[0], 'This field must be 5 or more characters.');
});

test('LengthValidator accepts valid maximum length', function (assert) {
  let lengthValidator = LengthValidator.create({max: 6});
  let validValues = [
    'test5',
    'test 6'
  ];

  validValues.forEach((value) => {
    assert.ok(lengthValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(lengthValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(lengthValidator.getMessages(value).length, 0);
  });
});

test('LengthValidator rejects invalid maximum length', function (assert) {
  let lengthValidator = LengthValidator.create({max: 5});
  const value = 'failure';
  assert.ok(lengthValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
  assert.notOk(lengthValidator.isValid(value), `"${value}" was accepted as valid`);
  assert.equal(lengthValidator.getMessages(value).length, 1);
  assert.equal(lengthValidator.getMessages(value)[0], 'This field must be 5 characters or less.');
});

test('PasswordValidator accepts valid passwords', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  let validValues = [
    null,
    undefined,
    '',
    'minimum8',
    'specialchars@#$%specialchars'
  ];

  validValues.forEach((value) => {
    assert.ok(passwordValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(passwordValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(passwordValidator.getMessages(value).length, 0);
  });
});

test('PasswordValidator rejects invalid passwords', function (assert) {
  let passwordValidator = PasswordValidator.create({});
  const value = 'shortpw';
  assert.ok(passwordValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
  assert.notOk(passwordValidator.isValid(value), `"${value}" was accepted as valid`);
  assert.equal(passwordValidator.getMessages(value).length, 1);
  assert.equal(passwordValidator.getMessages(value)[0], 'This field must be 8 or more characters.');
});

test('RequiredPasswordValidator rejects blank values', function (assert) {
  let requiredPasswordValidator = RequiredPasswordValidator.create({});
  let invalidValues = [
    null,
    undefined,
    ''
  ];

  invalidValues.forEach((value) => {
    assert.ok(requiredPasswordValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(requiredPasswordValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(requiredPasswordValidator.getMessages(value).length, 1);
    assert.equal(requiredPasswordValidator.getMessages(value)[0], 'This field cannot be blank.');
  });
});

test('UniquenessValidator accepts values not in existingValues', function (assert) {
  let uniquenessValidator = UniquenessValidator.create({existingValues: ['other1', 'other2']});
  const value = 'valid';
  assert.ok(uniquenessValidator.isValid(value), `"${value}" was not accepted as valid`);
  assert.notOk(uniquenessValidator.isInvalid(value), `"${value}" was rejected as invalid`);
  assert.equal(uniquenessValidator.getMessages(value).length, 0);
});

test('UniquenessValidator rejects values already in existingValues', function (assert) {
  let uniquenessValidator = UniquenessValidator.create({existingValues: ['reject', 'other2', 2]});
  let invalidValues = [
    ' reject',
    'reject ',
    'reject',
    2
  ];

  invalidValues.forEach((value) => {
    assert.ok(uniquenessValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(uniquenessValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(uniquenessValidator.getMessages(value).length, 1);
    assert.equal(uniquenessValidator.getMessages(value)[0], 'This name is already in use.');
  });
});

test('UniquenessValidator accepts values in list only once if selfIncluded', function (assert) {
  const value = 'valid';
  let existingValues = ['other1', 'other2'];
  existingValues.pushObject(value);

  let uniquenessValidator = UniquenessValidator.create({selfIncluded: true, existingValues: existingValues});
  assert.ok(uniquenessValidator.isValid(value), `"${value}" was not accepted as valid`);
  assert.notOk(uniquenessValidator.isInvalid(value), `"${value}" was rejected as invalid`);
  assert.equal(uniquenessValidator.getMessages(value).length, 0);
});

test('UniquenessValidator rejects values in list with multiples if selfIncluded', function (assert) {
  let invalidValues = [
    ' reject',
    'reject ',
    'reject',
    2
  ];

  invalidValues.forEach((value) => {
    let existingValues = ['reject', 'other2', 2];
    existingValues.pushObject(value);

    let uniquenessValidator = UniquenessValidator.create({selfIncluded: true, existingValues: existingValues});
    assert.ok(uniquenessValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(uniquenessValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(uniquenessValidator.getMessages(value).length, 1);
    assert.equal(uniquenessValidator.getMessages(value)[0], 'This name is already in use.');
  });
});

test('RegExpValidator accepts matching values', function (assert) {
  let regExpValidator = RegExpValidator.create({
    regExp: new RegExp(/A/),
    message: 'invalid chars'
  });
  const value = 'A';
  assert.ok(regExpValidator.isValid(value), `"${value}" was not accepted as valid`);
  assert.notOk(regExpValidator.isInvalid(value), `"${value}" was rejected as invalid`);
  assert.equal(regExpValidator.getMessages(value).length, 0);
});

test('RegExpValidator rejects non-matching values', function (assert) {
  let regExpValidator = RegExpValidator.create({
    regExp: new RegExp(/A/),
    message: 'invalid chars'
  });
  const value = 'F';
  assert.ok(regExpValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
  assert.notOk(regExpValidator.isValid(value), `"${value}" was accepted as valid`);
  assert.equal(regExpValidator.getMessages(value).length, 1);
  assert.equal(regExpValidator.getMessages(value)[0], 'invalid chars');
});

test('AlphaNumericDashUnderscoreValidator accepts valid values', function (assert) {
  let anduValidator = AlphaNumericDashUnderscoreValidator.create({});
  let validValues = [
      'UpperAndLowerCase',
      'Underscores_are_ok',
      'Dashes-are-ok',
      'Upper-Lower_and_Dashes-and_Underscores'
    ];

  validValues.forEach((value) => {
    assert.ok(anduValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(anduValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(anduValidator.getMessages(value).length, 0);
  });
});

test('AlphaNumericDashUnderscoreValidator rejects invalid values', function (assert) {
  let anduValidator = AlphaNumericDashUnderscoreValidator.create({});
  let invalidValues = [
    'BadSymbol!',
    'BadSymbol#',
    'BadSymbol^',
    'Spaces NotAllowed'
  ];
  invalidValues.forEach((value) => {
    assert.ok(anduValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(anduValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(anduValidator.getMessages(value).length, 1);
    assert.equal(anduValidator.getMessages(value)[0], "This field must contain only 'A-Z', 'a-z', '0-9', '_' or '-' characters.");
  });
});

test('IpAddressValidator accepts valid values', function (assert) {
  let ipAddressValidator = IpAddressValidator.create({});
  let validValues = [
    null,
    undefined,
    '192.168.2.0',
    '192.168.153.0'
  ];

  validValues.forEach((value) => {
    assert.ok(ipAddressValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(ipAddressValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(ipAddressValidator.getMessages(value).length, 0);
  });
});

test('IpAddressValidator rejects invalid values', function (assert) {
  let ipAddressValidator = IpAddressValidator.create({});
  let invalidValues = [
    '192.168.2.2000',
    '192.162.257',
    'garbage192.168.1.2',
    '192.168.1.2/24',
    '192.168.1.2/',
    '192.168.1.2postfix'
  ];
  invalidValues.forEach((value) => {
    assert.ok(ipAddressValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(ipAddressValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(ipAddressValidator.getMessages(value).length, 1);
    assert.equal(ipAddressValidator.getMessages(value)[0], 'This is an invalid ip address.');
  });
});

test('IpRangeValidator accepts valid values', function (assert) {
  let ipRangeValidator = IpRangeValidator.create({});
  let validValues = [
    null,
    undefined,
    '192.168.2.0',
    '192.168.2.0/3',
    '192.168.2.0/32',
    '192.168.153.0',
    '192.168.153.0/3',
    '192.168.153.0/32'
  ];

  validValues.forEach((value) => {
    assert.ok(ipRangeValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(ipRangeValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(ipRangeValidator.getMessages(value).length, 0);
  });
});

test('IpRangeValidator rejects invalid values', function (assert) {
  let ipRangeValidator = IpRangeValidator.create({});
  let invalidValues = [
    '192.168.2.2000',
    '192.168.2.257',
    'garbage'
  ];
  invalidValues.forEach((value) => {
    assert.ok(ipRangeValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(ipRangeValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(ipRangeValidator.getMessages(value).length, 1);
    assert.equal(ipRangeValidator.getMessages(value)[0], 'This is an invalid network range.');
  });
});

test('CidrValidator accepts valid values', function (assert) {
  let cidrValidator = CidrValidator.create({});
  let validValues = [
    null,
    undefined,
    '192.168.153.0/1',
    '192.168.153.0/32',
    '0.0.0.0/1',
    '255.255.255.255/32'
  ];

  validValues.forEach((value) => {
    assert.ok(cidrValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(cidrValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(cidrValidator.getMessages(value).length, 0);
  });
});


test('CidrValidator rejects invalid values', function (assert) {
  let cidrValidator = CidrValidator.create({});
  let invalidValues = [
    'garbage',
    '8.8.8.0',
    '8.8.8.x/24',
    '8.8.8.0/33',
    '8.8.8.256/24',
    '8.8.256.8/24',
    '8.256.8.8/24',
    '256.8.8.8/24',
    '8.8.8.0/./24',
    '8.8.8/24',
    '8.8.8.8//24',
    '8.8.8.8.8/24'
  ];
  invalidValues.forEach((value) => {
    assert.ok(cidrValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(cidrValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(cidrValidator.getMessages(value).length, 1);
    assert.equal(cidrValidator.getMessages(value)[0], 'This is an invalid CIDR notation.');
  });
});

test('IpSubnetValidator accepts valid values', function (assert) {
  let ipSubnetValidator = IpSubnetValidator.create({subnet: '8.8.8.0/23'});
  let validValues = [
    '8.8.8.0',
    '8.8.9.255'
  ];

  validValues.forEach((value) => {
    assert.ok(ipSubnetValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(ipSubnetValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(ipSubnetValidator.getMessages(value).length, 0);
  });
});


test('IpSubnetValidator rejects invalid values', function (assert) {
  let ipSubnetValidator = IpSubnetValidator.create({subnet: '8.8.8.0/23'});
  let invalidIpAddresses = [
    null,
    undefined,
    '',
    '8.8.8.256',
    '8.8.8',
    'garbage8.8.8.8',
    '8.8.8.8/24',
    '8.8.8.8/',
    '8.8.8.8postfix'
  ];
  let invalidSubnetAddresses = [
    '8.8.7.255',
    '8.8.10.0'
  ];
  invalidIpAddresses.forEach((value) => {
    assert.ok(ipSubnetValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(ipSubnetValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(ipSubnetValidator.getMessages(value).length, 1);
    assert.equal(ipSubnetValidator.getMessages(value)[0], 'This is an invalid ip address.');
  });

  invalidSubnetAddresses.forEach((value) => {
    assert.ok(ipSubnetValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(ipSubnetValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(ipSubnetValidator.getMessages(value).length, 1);
    assert.equal(ipSubnetValidator.getMessages(value)[0], 'This must belong to subnet 8.8.8.0/23.');
  });
});

test('MacAddressValidator accepts valid values', function (assert) {
  let macAddressValidator = MacAddressValidator.create({});
  let validValues = [
    '12:AA:B2:9C:d4:ef',
    '12-AA-B2-9C-d4-ef',
    '12:AA-B2:9C-d4:ef'
  ];

  validValues.forEach((value) => {
    assert.ok(macAddressValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(macAddressValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(macAddressValidator.getMessages(value).length, 0);
  });
});

test('MacAddressValidator rejects invalid values', function (assert) {
  let macAddressValidator = MacAddressValidator.create({});
  let invalidValues = [
    '1:AA:B2:9C:d4:ef',
    '12:AA:B2:9C:d:ef',
    '12:AA:B2:9C:d4',
    '12:AA:B2:9C:d4:def',
    '12:AA:B2:9C:D4:FG',
    '12_AA_B2_9C_d4_ef'
  ];
  invalidValues.forEach((value) => {
    assert.ok(macAddressValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(macAddressValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(macAddressValidator.getMessages(value).length, 1);
    assert.equal(macAddressValidator.getMessages(value)[0], 'This is an invalid MAC address.');
  });
});


test('HostnameValidator accepts valid values', function (assert) {
  let hostnameValidator = HostnameValidator.create({});
  let validValues = [
    'ValidHostName',
    'Valid-Host-Name'
  ];

  validValues.forEach((value) => {
    assert.ok(hostnameValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(hostnameValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(hostnameValidator.getMessages(value).length, 0);
  });
});

test('HostnameValidator rejects invalid values', function (assert) {
  let hostnameValidator = HostnameValidator.create({});
  let invalidValues = [
    'spaces invalid',
    'underscores_are_invalid',
    'special%chars',
    '.startsWithPeriod'
  ];
  invalidValues.forEach((value) => {
    assert.ok(hostnameValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(hostnameValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(hostnameValidator.getMessages(value).length, 1);
    assert.equal(hostnameValidator.getMessages(value)[0], 'This is an invalid hostname.');
  });
});

test('HostAddressValidator accepts valid values', function (assert) {
  let hostAddressValidator = HostAddressValidator.create({});
  let validValues = [    '',
    null,
    undefined,
    '192.168.2.0',
    '192.168.153.0',
    'ValidHostName',
    'Valid-Host-Name'
  ];

  validValues.forEach((value) => {
    assert.ok(hostAddressValidator.isValid(value), `"${value}" was not accepted as valid`);
    assert.notOk(hostAddressValidator.isInvalid(value), `"${value}" was rejected as invalid`);
    assert.equal(hostAddressValidator.getMessages(value).length, 0);
  });
});

test('HostAddressValidator rejects invalid values', function (assert) {
  let hostAddressValidator = HostAddressValidator.create({});
  let invalidValues = [
    '8.8.8.256/24',
    'spaces invalid',
    'underscores_are_invalid',
    'special%chars',
    '.startsWithPeriod'
  ];

  invalidValues.forEach((value) => {
    assert.ok(hostAddressValidator.isInvalid(value), `"${value}" was not rejected as invalid`);
    assert.notOk(hostAddressValidator.isValid(value), `"${value}" was accepted as valid`);
    assert.equal(hostAddressValidator.getMessages(value).length, 1);
    assert.equal(hostAddressValidator.getMessages(value)[0], 'This is an invalid host or ip address.');
  });
});
