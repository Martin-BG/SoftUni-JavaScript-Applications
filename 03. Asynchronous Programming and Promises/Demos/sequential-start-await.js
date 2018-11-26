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

const sequentialStartAwait = async function () {
  console.log(new Date());
  console.log('==SEQUENTIAL START==');
  const slow = await resolveAfter2Seconds();
  const fast = await resolveAfter1Second();
  console.log(slow);
  console.log(fast);
  console.log(new Date());
};

sequentialStartAwait();
