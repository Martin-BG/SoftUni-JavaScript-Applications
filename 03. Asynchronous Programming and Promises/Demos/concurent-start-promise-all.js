const resolveAfter2Seconds = function () {
  console.log('starting slow promise');
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(20);
      console.log('slow promise is done');
    }, 2000);
  });
};

const resolveAfter1Second = function () {
  console.log('starting fast promise');
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(10);
      console.log('fast promise is done');
    }, 1000);
  });
};

const stillConcurrent = function () {
  console.log(new Date());
  console.log('==PROMISE ALL START==');
  Promise
    .all([
      resolveAfter2Seconds(),
      resolveAfter1Second()
    ])
    .then((messages) => {
      console.log(messages[0]); // slow
      console.log(messages[1]); // fast
      console.log(new Date());
    });
};

stillConcurrent();
