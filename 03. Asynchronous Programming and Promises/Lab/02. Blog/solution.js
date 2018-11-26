function attachEvents() {
  const kinveyAppId = 'kid_rkkvf190X';
  const serviceUrl = 'https://baas.kinvey.com/appdata/' + kinveyAppId;
  const kinveyUsername = 'peter';
  const kinveyPassword = 'p';
  const base64auth = btoa(kinveyUsername + ':' + kinveyPassword);
  const authHeaders = {'Authorization': 'Basic ' + base64auth};

  const $posts = $('#posts');

  $('#btnLoadPosts').click(loadPostsClick);
  $('#btnViewPost').click(viewPostClick);

  function loadPostsClick() {
    const loadPostsRequest = {
      url: serviceUrl + '/posts',
      headers: authHeaders,
    };
    $.ajax(loadPostsRequest)
      .then(displayPosts)
      .catch(displayError);
  }

  function viewPostClick() {
    const selectedPostId = $posts.val();
    if (!selectedPostId) {
      return;
    }
    const requestPosts = $.ajax({
      url: serviceUrl + '/posts/' + selectedPostId,
      headers: authHeaders
    });
    const requestComments = $.ajax({
      url: `${serviceUrl}/comments/?query={"post_id":"${selectedPostId}"}`,
      headers: authHeaders
    });
    Promise.all([requestPosts, requestComments])
      .then(displayPostWithComments)
      .catch(displayError);
  }

  function displayPostWithComments([post, comments]) {
    $('#post-title').text(post.title);
    $('#post-body').text(post.body);
    const $post = $('#post-comments');
    $post.empty();
    comments.forEach(comment => $post.append($('<li>').text(comment.text)));
  }

  function displayPosts(posts) {
    $posts.empty();
    posts.forEach(post => $posts.append($('<option>').text(post.title).val(post._id)));
  }

  function displayError(err) {
    const errorDiv = $('<div>').text('Error: ' + err.status + ' (' + err.statusText + ')');
    $(document.body).prepend(errorDiv);
    setTimeout(function () {
      $(errorDiv).fadeOut(function () {
        $(errorDiv).remove();
      });
    }, 3000);
  }
}
