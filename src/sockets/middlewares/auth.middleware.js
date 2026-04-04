import jwt from "jsonwebtoken";

/**
 * in the client - side we pass the token in a header for API tools...
 * When dealing with front this needs to be changed..
 */
export default (socket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader) {
        return next(new Error("Unauthorized"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;
    console.log(socket.user);

    next();
  } catch (err) {
    console.log("JWT error:", err.message);
    return next(new Error("Unauthorized"));
  }
}