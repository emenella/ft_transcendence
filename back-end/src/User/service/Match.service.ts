import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../entity/Match.entity';

@Injectable()
export class HistoryService {
	constructor(@InjectRepository(Match) private readonly historyRepository: Repository<Match>) {}

	async addMatch(history: Match): Promise<Match> {
		return this.historyRepository.save(history);
	}

	async getAllMatches(): Promise<Match[]> {
		return this.historyRepository.find({ relations: ['winner', 'looser']});
	}

	async getAllMatchesByUser(id: number): Promise<Match[]> {
		return this.historyRepository.find({ where: [{ winner: { id: id } }, { loser: { id: id } }], relations: ['winner', 'loser']});
	}

}
