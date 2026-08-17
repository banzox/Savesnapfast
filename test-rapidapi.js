// Set RAPIDAPI_KEY in the environment before running.
const url = "https://tiktok-data-srapper.p.rapidapi.com/api/v1/tiktok/video?url=https%3A%2F%2Fwww.tiktok.com%2F%40tiktok%2Fvideo%2F7106594312292453675";
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': process.env.RAPIDAPI_KEY,
		'x-rapidapi-host': 'tiktok-data-srapper.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

fetch(url, options)
	.then(res => res.text())
	.then(text => console.log(text))
	.catch(console.error);
