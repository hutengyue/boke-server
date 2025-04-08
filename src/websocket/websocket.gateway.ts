import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
import {GroupService} from "../group/group.service";
// @WebSocketGateway是一个装饰器，用于创建WebSocket网关类。WebSocket网关类是用于处理 WebSocket连接和消息的核心组件之一。
// 它充当WebSocket服务端的中间人，负责处理客户端发起的连接请求，并定义处理不同类型消息的逻辑
@WebSocketGateway(3001,{ cors: { origin: '*' } })
export class WebsocketGateway{
    constructor(private readonly groupService: GroupService) {}
    @WebSocketServer()
    server: Server;
    private users:Map<string, any> = new Map();

    @SubscribeMessage('come')
    async handleConnect(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        const {username} = body;
        this.users.set(username, client)
        let groups = await this.groupService.find(1, 50)
        client.emit('come', {number: this.users.size, groups})
    }

    @SubscribeMessage('quit')
    handleDisconnect(@MessageBody() body: any){
        const { username } = body;
        this.users.delete(username)
        this.server.emit('quit',this.users.size as any)
    }

    @SubscribeMessage('groupMessage')
    async groupMessage(@MessageBody() body: any) {
        const {userId, message} = body;
        let result = await this.groupService.send(userId,message)
        this.server.emit('groupMessage', result as any)
    }

    @SubscribeMessage('add')
    async addFriend(@MessageBody() body: any) {
        const {userId, message} = body;
        let result = await this.groupService.send(userId,message)
        this.server.emit('group', result as any)
    }

}