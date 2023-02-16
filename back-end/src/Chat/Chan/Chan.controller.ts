import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { Chan } from "./Chan.entity";
import { ChanService } from "./Chan.service";

@Controller("Chan")
export class ChanControllers {}