import { Player, PlayerRow } from '../types'

class PlayerAssembler {
    assemble = (row: PlayerRow):Player => {
        const player: Player = {
            id: row.id,
            name: row.name,
            typ: row.typ,
            overall: row.overall,
            skills: {
                speed: row.skill_speed,
                technik: row.skill_technik,
                condition: row.skill_condition
            }
        }
        return player;
    }
}

export const playerAssembler = new PlayerAssembler();