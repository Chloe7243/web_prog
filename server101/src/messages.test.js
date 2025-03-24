import { nextMessage } from './messages.mjs';

const messagesReceived = new Map();
for (let i = 0; i < 100; i++) {
  messagesReceived.set(nextMessage(), 0);
}

messagesReceived.forEach((value, key) => {
  console.log(key);
});