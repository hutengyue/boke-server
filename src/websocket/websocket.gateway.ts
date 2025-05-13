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
import {GmessageService} from "../gmessage/gmessage.service";
import { GroupService } from 'src/group/group.service';
import { ApplyService } from 'src/apply/apply.service';
import { PmessageService } from 'src/pmessage/pmessage.service';
import { Apply } from 'src/entities/apply.entity';
// @WebSocketGateway是一个装饰器，用于创建WebSocket网关类。WebSocket网关类是用于处理 WebSocket连接和消息的核心组件之一。
// 它充当WebSocket服务端的中间人，负责处理客户端发起的连接请求，并定义处理不同类型消息的逻辑
@WebSocketGateway(3001,{ cors: { origin: '*' } })
export class WebsocketGateway{
    constructor(private readonly gmessageService: GmessageService,
        private readonly groupService: GroupService,
        private readonly applyService: ApplyService,
        private readonly pmessageService: PmessageService
    ) {}
    @WebSocketServer()
    server: Server;
    private users:Map<string, any> = new Map();

    @SubscribeMessage('connection')
    async handleConnect(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
        const {userId} = body;
        this.users.set(userId, client)
        let gmessage = await this.gmessageService.getUserGroupsLatestMessages(userId)  
        let pmessage = await this.pmessageService.getLatestMessages(userId)
        client.emit('connection', {number: this.users.size, message: gmessage,pmessage})
    }

    @SubscribeMessage('quit')
    handleQuit(@MessageBody() body: any){
        const { userId } = body;
        this.users.delete(userId)
        this.server.emit('quit',this.users.size as any)
    }

    @SubscribeMessage('groupMessage')
    async groupMessage(@MessageBody() body: any) {
        const {userId, message,groupId} = body;
        let newGroupMessage = await this.gmessageService.send(userId,message,groupId)
        this.server.emit('groupMessage', newGroupMessage as any)
    }

    @SubscribeMessage('apply')
    async addFriend(@MessageBody() body: any) {
        const {fromId, toId} = body;
        let result = await this.applyService.createApply(fromId,toId)
        const toSocket = this.users.get(toId.toString());
        if(toSocket) {
            // 向目标用户发送新的好友申请通知
            toSocket.emit('apply', result);
        }
    }
    @SubscribeMessage('handle')
    async handleApply(@MessageBody() body: any) {
        const {fromId,toId,applyId, status} = body;
        let result = await this.applyService.handleApply(applyId,status)
        const toSocket = this.users.get(toId.toString());
        const fromSocket = this.users.get(fromId.toString());
        if(toSocket) {
            toSocket.emit('handle', result);
        }
        if(fromSocket) {
            fromSocket.emit('handle', result);
        }
    }
    @SubscribeMessage('privateMessage')
    async privateMessage(@MessageBody() body: any) {
        const {fromId, toId, message} = body;
        let result = await this.pmessageService.createMessage(fromId,toId,message)
        const toSocket = this.users.get(toId.toString());
        const fromSocket = this.users.get(fromId.toString());
        if(fromSocket) {
            fromSocket.emit('privateMessage', result);
        }
        if(toSocket) {
            toSocket.emit('privateMessage', result);
        }
    }
}