import { Player, PlayerRow } from '../types'
import { databaseIo } from '../database/DatabaseIO'
import { playerAssembler } from './PlayerMapper'

type Values = number | string;

class PlayerRepo {
    findAll = async (): Promise<Player[]> => {
        const result = await databaseIo.query('SELECT * FROM player order by name');
        const rows: PlayerRow[] = result.rows;
        return rows.map( row  => playerAssembler.assemble(row));
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

    update = async(id: number, player: Player): Promise<Player> => {
        const values: Values[] = [
            id,
            player.name, player.typ, player.overall,
            player.skills.speed, player.skills.technik, player.skills.condition];

        const sql: string = 'UPDATE player set name=$2' +
            ' ,typ=$3, overall=$4, skill_speed=$5, skill_technik=$6, skill_condition=$7' +
            ' where id = $1 ';
        await databaseIo.queryWithParams(sql, values);
        return this.findOne(id);
    }
}

export const playerRepo = new PlayerRepo();