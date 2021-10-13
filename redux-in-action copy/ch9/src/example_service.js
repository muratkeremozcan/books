export default function fakeAnalyticsApi(eventName, data) {
  return new Promise((resolve, reject) => {
    resolve('Success!');
  });
}
