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

const concurrentStart = async function () {
  console.log(new Date());
  console.log('==CONCURRENT START==');
  const slow = resolveAfter2Seconds();
// starts timer immediately
  const fast = resolveAfter1Second();
  console.log(await slow);
  console.log(await fast);
// waits for slow to finish, even though fast is already done!
  console.log(new Date());
};

concurrentStart();
