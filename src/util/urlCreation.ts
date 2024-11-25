const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const port = process.env.PORT || 8080;

export function urlCreate() {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function createLink(
    maskedUrl: string,
  ) {
    return `http://localhost:${port}/l/` + maskedUrl;
  }