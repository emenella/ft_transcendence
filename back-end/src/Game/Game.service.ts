import { Injectable } from "@nestjs/common";

@Injectable()
export class GameService {
    private games: Map<string, any> = new Map();

    public getGame(id: string): any {
}