import { Player } from '../types'
import { playerRepo } from './PlayerRepo'


class PlayerApi {
    findAll = async (): Promise<Player[]> => {
        return playerRepo.findAll();
    }

    findOne = async (id: number): Promise<Player> => {
        return playerRepo.findOne(id);
    }
}

export const playerApi = new PlayerApi();





