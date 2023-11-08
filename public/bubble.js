
// muestra una burbuja de mensaje en el chat y discrimina si es un mensaje mio o de otro usuario
export const bubble = ( { text, isMyMessage, username }) => {

  return (
    `<div class="message ${isMyMessage && "my-message"}">
      ${!isMyMessage ? `<span class="user">${username}</span>` : ''}
      <div class="${isMyMessage ? "my-bubble" : "bubble"}">${text}</div>
    </div>`
  )
}