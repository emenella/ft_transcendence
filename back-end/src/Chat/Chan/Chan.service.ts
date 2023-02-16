import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chan } from "./Chan.entity";

@Injectable()
export class ChanService {}