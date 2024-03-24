module.exports = (firstNumber, lastNumber) => {
  const randomNumber =
    Math.floor(Math.random() * (lastNumber - firstNumber)) + firstNumber;
  return randomNumber;
};
