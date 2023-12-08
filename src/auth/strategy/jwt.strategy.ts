import {
    PassportStrategy
} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {Strategy} from "passport-jwt";

@Injectable()
export class JwtGuard extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: 
        })
    }

    async validate() {

    }
}