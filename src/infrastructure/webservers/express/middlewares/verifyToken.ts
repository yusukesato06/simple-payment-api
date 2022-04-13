import jwt from 'jsonwebtoken';

export function verifyToken(req: any, res: any, next: any) {
  const token = req.headers['x-api-token'];

  if (token) {
    jwt.verify(
      token,
      // [MEMO] 本来はconfigファイル等で管理するが今回は一旦ハードコードしてます
      '6KKYxKS6e9ftLsNnnxFkDBMNTEQZt2a3APbaY6wgUSkHEDxk4yuwVC8FkN2zhg8V',
      (error: any, decoded: any) => {
        if (error) {
          return res.status(401).json({
            message: 'could not verify signature',
          });
        } else {
          req.decoded = decoded;
          next();
        }
      }
    );
  } else {
    return res.status(401).send({
      message: 'you should set access token.',
    });
  }
}
