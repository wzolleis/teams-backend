import { Player } from '../types'
import { playerRepo } from './PlayerRepo'


class PlayerApi {
    findAll = async (): Promise<Player[]> => {
        return playerRepo.findAll();
    }

    findOne = async (id: number): Promise<Player> => {
        return playerRepo.findOne(id);
    }

    update = async (id: number, player: Player): Promise<Player> => {
        return playerRepo.update(id, player);
    }
}

export const playerApi = new PlayerApi();





