function attachEvents() {
  const $towns = $('#towns');
  const $root = $('#root');
  const $ul = $('<ul>');
  $root.append($ul); // Correct HTML semantic - add <li>'s into <ul> instead into <div>
  const $source = $('#towns-template');
  const template = Handlebars.compile($source.html());

  const addTowns = (event) => {
    const towns = $towns.val()
      .trim()
      .split(', ') // Split by ',' instead of ', ' would be more flexible solution
      .map(name => name.trim())
      .filter(name => name);
    $towns.val('');

    if (towns.length) {
      const data = {towns};
      const $container = event.data.container;
      $container.empty(); // Remove this line to preserve current data on new data load
      $container.append(template(data));
    }
  };

  // Pass in $root instead of $ul to add <li>'s directly to root <div>
  $('#btnLoadTowns').on('click', {container: $ul}, addTowns);
}
