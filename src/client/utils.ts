export const truncateToken = (token: string) => {
  if (token.length <= 60) return token;
  return `${token.substring(0, 30)}...${token.substring(token.length - 30)}`;
};
