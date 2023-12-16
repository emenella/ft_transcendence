import { Module, forwardRef } from '@nestjs/common';
import { ChanModule } from './Chan/Chan.module';
import { UserModule } from '../User/User.module';
import { MessageModule } from './Message/Message.module';
import { ChatService } from './Chat.service';
import { AuthModule } from '../Auth/Auth.module';

@Module({
	imports: [
		forwardRef(() => UserModule),
		forwardRef(() => AuthModule),
		forwardRef(() => MessageModule),
		forwardRef(() => ChanModule),
	],
	providers: [ChatService],
	exports: [ChatService, MessageModule, ChanModule]
})
export class ChatModule {}