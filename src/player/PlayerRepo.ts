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
}

export const playerRepo = new PlayerRepo();