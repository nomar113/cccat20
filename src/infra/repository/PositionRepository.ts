import Position from "../../domain/Position";
import DatabaseConnection, { PgPromiseAdapter } from "../database/DatabaseConnection";
import { inject } from "../dependency-injection/Registry";

export default interface PositionRepository {
    savePosition(position: Position): Promise<void>;
}

export class PositionRepositoryDatabase implements PositionRepository {
    @inject("databaseConnection")
    databaseConnection!: DatabaseConnection;

    async savePosition(position: Position): Promise<void> {
        await this.databaseConnection.query("insert into ccca.position (position_id, ride_id, lat, long) values $1, $2, $3, $4", 
            [position.getPositionId(), position.getRideId(), position.getCoord().getLat(), position.getCoord().getLong()]
        );
    }

}