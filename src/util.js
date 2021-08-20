// console.log(fib(4));

module.exports = function fibNumber(number) {
  if (number < 2) return 1;
  return number * fibNumber(number - 1);
};
