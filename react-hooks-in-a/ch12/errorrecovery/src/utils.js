export function getStatusChecker(promiseIn) {
  let status = "pending";
  let result;

  const promise = promiseIn
    .then((response) => {
      status = "success";
      result = response;
    })
    .catch((error) => {
      status = "error";
      result = error;
    });

  return () => ({ promise, status, result });
}

export function makeThrower(promiseIn) {
  const checkStatus = getStatusChecker(promiseIn);

  return function () {
    const { promise, status, result } = checkStatus();
    if (status === "pending") throw promise;
    if (status === "error") throw result;
    return result;
  };
}
