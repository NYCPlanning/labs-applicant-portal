export const extractJWT = (response): string => {
  const { access_token } = response.body;

  try {
    return access_token;
  } catch (e) {
    console.log(e);

    throw new Error(`Could not destructure. Is the server response working?`);
  }
};
