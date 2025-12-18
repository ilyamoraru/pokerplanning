import type { NitroApp } from 'nitropack'
import { Server as Engine } from 'engine.io'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'
import type { GamerMessage } from '#shared/types/user'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  const getRoomSize = (room: string) => {
    return io.of('/').adapter.rooms.get(room)?.size || 0
  }

  // работа с присоединением юзера
  const userConnectionEvent = (socket: Socket) => {
    socket.on(SocketMessage.connection, (data: ConnectionMessage) => {
      const { room, gamer, type } = data
      switch (type) {
        case 'connect':
          {
            //подключаем юзера к комнате
            socket.join(room)
            //сообщаем всем, что пришел новый юзер
            socket.broadcast
              .to(room)
              .emit(SocketMessage.connectUser, { gamer, room } as GamerMessage)
          }
          break
        case 'disconnect':
          {
            // отключаем юзера из команты
            socket.leave(room)
            //говорим всем, что юзеры ушли
            socket.broadcast.to(room).emit(SocketMessage.disconnectUser, { gamer } as GamerMessage)
            const roomSize = getRoomSize(room)

            console.log('client leave. room size: ', roomSize)
          }
          break
      }
    })

    socket.on(SocketMessage.pingUser, ({ gamer, room }: GamerMessage) => {
      socket.broadcast.to(room).emit(SocketMessage.pingUser, { gamer, room } as GamerMessage)
    })
  }

  //работа с голосованием
  const userVoteEvent = (socket: Socket) => {
    socket.on(SocketMessage.vote, (data: VoteMessage) => {
      socket.broadcast.to(data.room).emit(SocketMessage.vote, data as VoteMessage)
    })
  }

  const revealCardsEvent = (socket: Socket) => {
    socket.on(SocketMessage.revealCards, (room: string) => {
      socket.broadcast.to(room).emit(SocketMessage.revealCards)
    })
  }

  const resetVoteEvent = (socket: Socket) => {
    socket.on(SocketMessage.resetVote, (room: string) => {
      socket.broadcast.to(room).emit(SocketMessage.resetVote)
    })
  }

  const endVoteMessage = (socket: Socket) => {
    socket.on(SocketMessage.endVote, (data: EndVoteMessage) => {
      const { room } = data
      socket.broadcast.to(room).emit(SocketMessage.endVote)
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
    revealCardsEvent(socket)
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
