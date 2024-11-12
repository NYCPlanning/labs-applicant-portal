export default function validateFileUpload(options = {}) {
  return (key, newValue) => {
    if (!newValue || newValue.length === 0) {
      return options.message || `${key} one or more document uploads is required.`;
    }

    return true;
  };
}
