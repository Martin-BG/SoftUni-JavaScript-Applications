function loadCommits() {
  const $commits = $('#commits');
  $commits.empty();
  const username = $('#username').val();
  const repository = $('#repo').val();

  const displayCommits = (commits) => {
    commits.forEach(c => $commits.append($('<li>').text(`${c.commit.author.name}: ${c.commit.message}`))
    );
  };

  const displayError = (err) => {
    $commits.append($('<li>').text(`'Error: ${err.status} (${err.statusText})`));
  };

  $.get(`https://api.github.com/repos/${username}/${repository}/commits`)
    .then(displayCommits)
    .catch(displayError);
}
