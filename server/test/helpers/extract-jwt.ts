export const extractJWT = (response): string => {
  try {
    const { header: { 'set-cookie': [token] } } = response;

    return token;
  } catch (e) {
    console.log(e);

    throw new Error(`Could not destructure. Is the server response working?`);
  }
};
