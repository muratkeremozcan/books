const data = new Promise((resolve, reject) => {
  resolve({
    name: 'John Doe',
    age: 35,
    occupation: 'Software Engineer',
  })
})

data //?

// access the value in an async function

// access the value in an async function
const accessData = async () => {
  const value = await data
  return value.age
}
accessData() //?
