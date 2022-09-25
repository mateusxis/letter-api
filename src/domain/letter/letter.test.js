const letterDomain = require('./letter');

const letterService = {
  getLetters: jest.fn()
};

describe('letterDomain()', () => {
  it('should call letterDomain.getLetters', () => {
    letterDomain({ letterService }).getLetters('debug');

    expect(letterService.getLetters).toHaveBeenCalled();
  });
});
