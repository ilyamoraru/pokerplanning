import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import { Server, Socket } from 'socket.io'
import { defineEventHandler } from 'h3'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  const getRoomSize = (room: string) => {
    return io.of('/').adapter.rooms.get(room)?.size || 0
  }

  const userConnectionEvent = (socket: Socket) => {
    socket.on(SocketMessage.connection, (data: ConnectionMessage) => {
      const { room, user, type } = data
      switch (type) {
        case 'connect':
          {
            //подключаем юзера к комнате
            socket.join(room)
            //сообщаем всем, что пришел новый юзер
            socket.broadcast.emit(SocketMessage.connectUser, { user } as UserMessage)

            // io.to(room).emit(SocketMessage.connectUser, {user} as UserMessage)
          }
          break
        case 'disconnect':
          {
            // отключаем юзера из команты
            socket.leave(room)
            //говорим всем, что юзеры ушли
            socket.broadcast.emit(SocketMessage.disconnectUser, { user } as UserMessage)
            const roomSize = getRoomSize(room)

            console.log('client leave. room size: ', roomSize)
          }
          break
      }
    })
  }

  const userVoteEvent = (socket: Socket) => {
    socket.on(SocketMessage.vote, (data: VoteMessage) => {
      socket.broadcast.emit(SocketMessage.vote, data as VoteMessage)
    })
  }

  const resetVoteEvent = (socket: Socket) => {
    socket.on(SocketMessage.resetVote, () => {
      socket.broadcast.emit(SocketMessage.resetVote)
    })
  }

  const endVoteMessage = (socket: Socket) => {
    socket.on(SocketMessage.endVote, (data: EndVoteMessage) => {
      const { room, user } = data
      socket.broadcast.emit(SocketMessage.endVote, { user } as UserPingMessage)
    })
  }

  const endGameMessage = (socket: Socket) => {
    socket.on(SocketMessage.endGame, (room: EndGameMessage) => {
      io.to(room).emit(SocketMessage.endGame)
    })
  }

  io.on('connection', (socket) => {
    userConnectionEvent(socket)
    userVoteEvent(socket)
    resetVoteEvent(socket)
    endVoteMessage(socket)
    endGameMessage(socket)
  })

  nitroApp.router.use(
    '/socket.io/',
    defineEventHandler({
      handler(event) {
        // @ts-expect-error private method and property
        engine.handleRequest(event.node.req, event.node.res)
        event._handled = true
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq)
          // @ts-expect-error private method and property
          engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket)
        }
      }
    })
  )
})
