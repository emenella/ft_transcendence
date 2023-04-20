import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../User/User.module';
import { AuthModule } from '../Auth/Auth';
import { ChatModule } from '../Chat/Chat.module';
import { GameModule } from '../Game/Game.module';
import { SocketService } from './Socket.service';
import { SocketGateway } from './Socket.gateway';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		forwardRef(() => ChatModule),
		forwardRef(() => GameModule),
	],
	providers: [SocketGateway, SocketService],
	exports: [SocketService],
})
export class SocketModule {}