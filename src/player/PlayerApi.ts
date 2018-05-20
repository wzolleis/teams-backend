import { Player } from '../types'
import { playerRepo } from './PlayerRepo'


class PlayerApi {
    findAll = async (): Promise<Player[]> => {
        return playerRepo.findAll();
    }
}

export const playerApi = new PlayerApi();





