function attachEvents() {
  const baseServiceUrl = 'https://messenger-2731e.firebaseio.com/messenger';
  const $messages = $('#messages');
  const $author = $('#author');
  const $content = $('#content');

  const displayError = () => {
    $messages.text('ERROR');
  };

  const loadMessages = () => {
    $messages.text('');
    $.get(baseServiceUrl + '.json')
      .then((messages) =>
        $messages.text(Object.keys(messages)
          .map((key) => (messages[key]))
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(m => `${m.author}: ${m.content}`)
          .join('\n'))
      )
      .catch(displayError);
  };

  const postMessage = () => {
    const author = $author.val().trim();
    const content = $content.val().trim();
    const timestamp = Date.now();
    $author.val('');
    $content.val('');
    if (author && author.length && content && content.length) {
      const messageJSON = JSON.stringify({author, content, timestamp});
      $.post(baseServiceUrl + '.json', messageJSON)
        .then(loadMessages)
        .catch(displayError);
    }
  };

  $('#refresh').on('click', loadMessages);
  $('#submit').on('click', postMessage);

  loadMessages();
}
