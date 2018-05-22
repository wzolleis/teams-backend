import { Player, PlayerRow } from '../types'
import { databaseIo } from '../database/DatabaseIO'
import { playerAssembler } from './PlayerMapper'

class PlayerRepo {
    findAll = async (): Promise<Player[]> => {
        const result = await databaseIo.query('SELECT * FROM player order by name');
        const rows: PlayerRow[] = result.rows;
        const players: Player[] = rows.map( row  => playerAssembler.assemble(row));
        return players;
    }

    findOne = async(id: number): Promise<Player> => {
        const values: number[] = [id];
        const result = await databaseIo.queryWithParams('SELECT * FROM player where id = $1', values);
        const rows: PlayerRow[] = result.rows;
        if (rows.length == 1) {
            return playerAssembler.assemble(rows[0]);
        }
        return Promise.reject("id '" + id + "' not found");
    }
}

export const playerRepo = new PlayerRepo();