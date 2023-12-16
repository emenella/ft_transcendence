import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const ip = client.conn.remoteAddress;
    const key = this.generateKey(context, ip);
    const { totalHits } = await this.storageService.increment(key, ttl);
    const socket = context.switchToWs();
    const packet = socket.getData();

    if (totalHits > limit) {
        throw new ThrottlerException();
    }

    if (packet !== undefined) {
        const packetSize = Buffer.byteLength(JSON.stringify(packet), 'utf-8');
        const maxPacketSize = 4096;
        if (packetSize > maxPacketSize) {
            socket.getClient().disconnect();
            throw new ThrottlerException("Packet too large");
        }
    }

    return true;
  }
}
