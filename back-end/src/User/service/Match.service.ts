import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Match } from "../entity/Match.entity";

@Injectable()
export class MatchService {
	constructor(@InjectRepository(Match) private readonly historyRepository: Repository<Match>) {}

	async addMatch(match: Match): Promise<Match> {
		return await this.historyRepository.save(match);
	}

	async getAllMatches(): Promise<Match[]> {
		return await this.historyRepository.find({ relations: ["winner", "looser"]});
	}

	async getAllMatchesByUser(id: number): Promise<Match[]> {
		const history: Match[] = await this.historyRepository.find({ where: [{ winner: { id: id } }, { loser: { id: id } }], relations: ["winner", "loser"]});
		history.sort((a,b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
		return history;
	}

}
