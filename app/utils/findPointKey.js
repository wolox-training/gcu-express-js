const isBetweenTwoNumbers = (num, min, max) => num >= min && num <= max;

module.exports = (userPositions, userPoints) =>
  Object.entries(userPositions).find(position => {
    /**
     * position[0] = the obj key, for example: DEVELOPER
     * position[1][0] = The first number of the array.
     * position[1][1] = The second number of the array.
     */
    if (isBetweenTwoNumbers(userPoints, position[1][0], position[1][1])) return position[0];
    return false;
  })[0];
