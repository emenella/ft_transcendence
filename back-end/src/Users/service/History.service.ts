import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchHistory } from '../entity/History.entity';

@Injectable()
export class HistoryService {

    constructor( @InjectRepository(MatchHistory)
        private readonly historyRepository: Repository<MatchHistory>) {}

    async addHistory(history: MatchHistory): Promise<MatchHistory> {
        return this.historyRepository.save(history);
    }

}