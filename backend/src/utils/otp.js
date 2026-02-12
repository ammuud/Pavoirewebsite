export const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const generateOtpHash = (otp) => {
  const encoded = Buffer.from(`${otp}:${Date.now()}`).toString('base64url');
  return encoded;
};
