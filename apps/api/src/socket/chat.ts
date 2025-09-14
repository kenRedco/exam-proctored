import { Server } from 'socket.io';
import { Message } from '../models/Message';

export function attachChat(io: Server) {
  io.on('connection', (socket) => {
    socket.on('join', ({ bookingId }) => {
      if (!bookingId) return;
      socket.join(`booking:${bookingId}`);
    });

    socket.on('message', async (msg: { bookingId: string; from: 'user'|'proctor'|'admin'|'bot'; text: string }) => {
      if (!msg?.bookingId || !msg?.from) return;
      const doc = await Message.create({ bookingId: msg.bookingId, from: msg.from, text: msg.text });
      io.to(`booking:${msg.bookingId}`).emit('message', { ...msg, _id: doc.id, createdAt: doc.createdAt });
    });
  });
}

