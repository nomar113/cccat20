import GetRide from "../../application/usecase/GetRide";
import { RequestRide } from "../../application/usecase/RequestRide";
import { inject } from "../dependency-injection/Registry";
import HttpServer from "../http/HttpServer";

export default class RideController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("requestRide")
    requestRide!: RequestRide;
    @inject("getRide")
    getRide!: GetRide;


    constructor() {
        this.httpServer.register("post", "/request-ride", async (params: any, body: any) => {
            const input = body;
            const output = await this.requestRide.execute(input);
            return output;
        }); 

        this.httpServer.register("get", "/ride/:{rideId}", async (params: any, body: any) => {
            const rideId = params.rideId;
            const output = await this.getRide.execute(rideId);
            return output;
        });
    }

}