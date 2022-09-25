module.exports = ({ letterService }) => {
  const getLetters = async () => await letterService.getLetters();

  return { getLetters };
};
