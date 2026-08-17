// Test a working video. Set RAPIDAPI_KEY in the environment before running.
const url = "https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video?url=https%3A%2F%2Fwww.tiktok.com%2F%40tiktok%2Fvideo%2F7106594312292453675";

fetch(url, {
  method: 'GET',
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': 'tiktok-data-srapper.p.rapidapi.com',
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(json => console.log(JSON.stringify(json, null, 2)))
.catch(console.error);
