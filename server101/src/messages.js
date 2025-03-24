/**
 * @module messages
 * @description A module for generating messages.
 * @see {@link nextMessage}
 */

/**
 * Define how to say hello in different languages.
 */
const messages = ['🇬🇧 Hi!', '🇫🇷 Salut!', '🇨🇿 Ahoj!', '🇵🇱 Cześć!', '🇪🇸 ¡Hola!', '🇮🇹 Ciao!', '🇩🇪 Servus!', '🇫🇮 Hei!', "🇦🇺 G'day!", '🇯🇵 こんにちは', '🇹🇭 สวัสดี!'];

// The index of the last message returned.
let lastIndex = 0;

/**
 * Returns a message from the defined list of messages.
 * @returns {string} The next message.
 */
export function nextMessage() {
  lastIndex = (lastIndex + 1) % messages.length;
  return messages[lastIndex];
}

