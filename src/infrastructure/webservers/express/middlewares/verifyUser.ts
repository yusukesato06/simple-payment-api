import jwt from 'jsonwebtoken';

export function verifyUser(req: any, res: any, next: any) {
  const requestUserId = req.params.userId;
  const decodedUserId = req.decoded.userId;

  if (requestUserId === decodedUserId) {
    next();
  } else {
    return res.status(403).send({
      message: "you don't have permission",
    });
  }
}
