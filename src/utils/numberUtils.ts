// This function generates random digits of a specified length
exports.genRandomChars = function (lenDigits = 6) {
  const shuffle = (arr: string[]) => {
    for (
      var j, x, i = arr.length;
      i;
      j = Math.floor(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x
    );
    return arr;
  };

  const chars =
    '1ab<Bcd2eC>RfAD!QPOg3hE?NiFS@Mj4kG$LlHT-Km5I:YnJU^opZ&qr7sV*t8uvwW=xX(y9+z0'.split('');
  const first = shuffle(chars).pop();

  // prettier-ignore
  const result = first + shuffle(chars).join('').substring(0, lenDigits - 1);
  // console.log(result);
  return result;
  // return parseInt(result, 10);
};
