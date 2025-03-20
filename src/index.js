'use strict';

const URL = 'http://localhost:3000/pups';
const dogBar = document.querySelector('#dog-bar');
const dogInfo = document.querySelector('#dog-info');
const goodDogFilter = document.querySelector('#good-dog-filter');

async function myFunc() {
	const response = await fetch(URL);
	const arr = await response.json();
	arr.forEach((pup) => {
		const span = document.createElement('span');
		span.textContent = pup.name;
		// if (pup.isGoodDog === 'true') span.classList.toggle('hidden')
		span.addEventListener('click', (e) => {
			dogInfo.innerHTML = `
                <img src="${pup.image}" />
                <h2>${pup.name}</h2>
                <button>${pup.isGoodDog === 'true' ? 'Good' : 'Bad'} Dog!</button>
                `;
			dogInfo.querySelector('button').addEventListener('click', (e) => {
				e.target.textContent = e.target.textContent === 'Good Dog!' ? 'Bad Dog!' : 'Good Dog!';
				pup.isGoodDog = pup.isGoodDog === 'true'? 'false' : 'true';
				fetch(URL + `/${pup.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
					body: JSON.stringify({ isGoodDog: `${pup.isGoodDog}` }),
				}).then(res => console.log(res.ok))
				filterFunc(e);
			});
		});
		dogBar.appendChild(span);
	});
	goodDogFilter.addEventListener('click', filterFunc);
	function filterFunc(e) {
		let current;
		if (e.target.id === 'good-dog-filter') {
			current = goodDogFilter.textContent.split(' ').at(-1) === 'OFF' ? 'ON' : 'OFF';
			goodDogFilter.textContent = `Filter good dogs: ${current}`;
		} else {
			current = goodDogFilter.textContent.split(' ').at(-1);
		}

		const children = dogBar.querySelectorAll('span');
		if (current === 'ON') {
			children.forEach((element) => {
				let pup = arr.find((pup) => pup.name === element.textContent);
				if (pup.isGoodDog === 'false') element.classList.add('hidden');
				else if (pup.isGoodDog === 'true') element.classList = ''
			});
		} else {
			children.forEach((element) => {
				element.classList = '';
			});
		}
	}
}

myFunc();
