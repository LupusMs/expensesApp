/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-undef */
describe('obtain API Key', function () {
  it('return API Key in case the local storage value is not empty', function () {
    localStorage.setItem('apiKey', 'testKey');
    assert.equal(obtainAPIKey(), 'testKey');
  });
});

describe('get month and year parameters', function () {
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];
  const today = new Date();
  const year = today.getFullYear();
  const month = monthNames[today.getMonth()];
  it('if undefined parameter passed it must return current month and year', function () {
    assert.equal(getMonthYearParameter(), `${month}-${year}`);
  });
  it('returns same string as parameter if format is correct', function () {
    assert.equal(getMonthYearParameter('january-2020'), 'january-2020');
  });
  it('returns current month-year if format/string is not correct', function () {
    assert.equal(getMonthYearParameter('dsfsdfsdf'), `${month}-${year}`);
  });
});
