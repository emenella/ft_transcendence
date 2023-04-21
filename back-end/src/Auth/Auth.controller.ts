import { Controller, Inject, forwardRef, Get, Post, Delete, UseGuards, Req, Res, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./Auth.service";
import { serverOptions } from "./Auth.constants";
import { FortyTwoGuard } from "./guard/42.guard";
import { Public } from "./decorators/public.decoration";
import { User } from "../User/entity/User.entity";
import { UserService } from "../User/service/User.service";
import { ConnectionService } from "../User/service/Connection.service";

@Controller("auth")
export class AuthController {

	constructor(private readonly AuthService: AuthService,
				@Inject(forwardRef(() => UserService)) private readonly userService: UserService,
				private readonly connectionService: ConnectionService,) {}
	
	@Public()
	@Get("/get42URL")
	get42URL() {
		return this.AuthService.get42URL();
	}
	
	@Public()
	@UseGuards(FortyTwoGuard)
	@Get("/callback")
	async postAuth(@Req() req: Request, @Res() res: Response) {
		let token = await this.AuthService.login(req.user);
		let payload = await this.AuthService.verifyJWT(token.access_token);
		if (!payload.otp)
			return res.redirect(serverOptions.protocole + "://" + serverOptions.hostname + ":" + serverOptions.port + "/login2fa?token=" + token.access_token);
		else
			return res.redirect(serverOptions.protocole + "://" + serverOptions.hostname + ":" + serverOptions.port + "/login?token=" + token.access_token);
	}

	@Public()
	@Post("/2fa/login")
	async Af2Login(@Req() req: Request) {
		if (!req.headers.authorization)
			return false;
		let payload = await this.AuthService.verifyJWT(req.headers.authorization.split(" ")[1]);
		if (!payload)
			throw new HttpException("Invalid token", 401);
		let connection = await this.connectionService.getConnectionById(payload.connectionId);
		return await this.AuthService.otp(connection, req.body.code);
	}
	
	@Get("/2fa/qrcode")
	async getQrCode(@Req() req: Request) {
		return await this.AuthService.generateQR(req.user as User);
	}

	@Post("/2fa/save")
	async saveSecret(@Req() req: Request) {
		this.userService.change2FA(req.user as User, true);
		return await this.AuthService.saveSecret(req.user as User, req.body.code);
	}

	@Delete("/2fa/delete")
	async deleteSecret(@Req() req: Request) {
		await this.userService.change2FA(req.user as User, false);
		return await this.AuthService.deleteSecret(req.user as User);
	}

}