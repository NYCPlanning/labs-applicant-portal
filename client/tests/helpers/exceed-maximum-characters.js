export default function exceedMaximum(maxLength, inputType) {
  let inputText;

  if (inputType === 'String') {
    inputText = 'a'.repeat(maxLength + 1);
  }

  if (inputType === 'Number') {
    inputText = '5'.repeat(maxLength + 1);
  }

  return inputText;
}
