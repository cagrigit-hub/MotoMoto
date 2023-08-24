import { env } from "./env";

export default {
    secret : env.jwt_secret,
    expiresIn : "1h"
}