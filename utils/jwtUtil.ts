// utils/jwtUtil.ts
import jwt from 'jsonwebtoken';

const SECRET =
  '4a3b6f4b2fbcfc7d03832aca1173a2e34ed248ecca538aab0b9d393e3e3f94b601d1b4337aeca2c43b5cc5186360e6af6a50bd94959bff0ba8e5b9037d2c8645bfee17dab960b04c41dfb54a6847b01043a8b63d46a5689e7f248cfbecde50f417f70affb473db7c4c4598a74bf1aee961bf8f9c33f282408d42a0167a43d16eb590dfedf064dc1e6fb6cd14157c07a7eefa2d492d24c73f1386dc84e00166c1fa95dd3098b8d35f3dfb2c1bfc2d45d43e49219d0249fe19edbcd56e94001bf7a9c6c470095acd7221b6f61648684e57c63542b804755b5dec564fa6c2b15bf213833f05a679fd71cd480221c35edc0758a441c791d6b7981652b53bf6fa59eb';

export const JwtUtil = {
  generateUserJwt({
    displayName,
    email,
    uid,
  }: {
    displayName: string;
    email: string;
    uid: string;
  }): string {
    const payload = {
      fullName: displayName,
      email,
      firebaseUid: uid,
    };

    return jwt.sign(payload, SECRET, {
      issuer: 'offgrid_nation_app',
      expiresIn: '10000000000000m',
    });
  },
};
