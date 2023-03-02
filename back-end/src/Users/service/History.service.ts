import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './User.service';
import { MatchHistory } from '../entity/History.entity';
import { User } from '../entity/User.entity';

@Injectable()
export class HistoryService {

    constructor( @InjectRepository(MatchHistory)
        private readonly historyRepository: Repository<MatchHistory>,
        private readonly userService: UserService) {}

    async addHistory(history: MatchHistory): Promise<MatchHistory> {
        return this.historyRepository.save(history);
    }

}