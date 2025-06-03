import RideDAO from "./dataRide";

export default class GetRide {
    constructor(readonly rideDAO: RideDAO){
    }

    async execute(rideId:string) {
        const output = await this.rideDAO.getRideById(rideId);
        return output;
    } 
}