import jwt from "jsonwebtoken"

const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret)
    return {
      success: true,
      data: decoded,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
      error,
    }
  }
}

const decodedToken = (token: string) => {
  const decoded = jwt.decode(token)
  return decoded
}

export const jwtUtils = {
  verifyToken,
  decodedToken,
}
