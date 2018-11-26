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

const parallel = function () {
  console.log(new Date());
  console.log('==PARALLEL with Promise.then==');
  resolveAfter2Seconds().then((message) => console.log(message + ' - ' + new Date()));
  resolveAfter1Second().then((message) => console.log(message + ' - ' + new Date()));
};

parallel();
