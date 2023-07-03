import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common["x-api-key"] = "live_wC1rU3OBc9dBRS28lJYyBBYlsXwTP7PXYISNfYf93cIrOqk41Zn0qgKVNUKn1lVp";

const selectEl = document.querySelector('.breed-select');
const divInfo = document.querySelector('.cat-info');
const pLoader = document.querySelector('.loader');
const pError = document.querySelector('.error');
const dodyEl = document.querySelector('body')

dodyEl.style.backgroundColor = 'rgb(106, 186, 196)'
selectEl.style.display = 'none';
pError.style.display = 'none';

fetchBreeds()
    .then((data) => {

        selectEl.style.display = 'block';
        pLoader.style.display = 'none';

        data.map(item => {
            
            const opt = document.createElement("option");
            opt.setAttribute("value", `${item.id}`);
            opt.textContent = item.name;
            
            return selectEl.appendChild(opt);
        })
    })
    .catch(err => {
        onError();
        
    });

selectEl.addEventListener('change', onSelect);

function onSelect(evt) {
    
    const catId = evt.currentTarget.value;

    pLoader.style.display = 'block';
    divInfo.style.display = "none"
    
    fetchCatByBreed(catId)
    .then((data) => {
            
        fetch(`https://api.thecatapi.com/v1/images/${data[0].id}`)
            .then((resp) => {
                 
                if (!resp.ok) {
                throw new Error(resp.statusText);
                }
               
                return resp.json();
            })
            .then((data) => {
                
                pLoader.style.display = 'none';
                divInfo.style.display = "block"
                
                const infoCat = data.breeds[0];
                              
                const info = `
                <img src="${data.url}" alt="${infoCat.name}" width ="640"/>
                <h2>${infoCat.name}</h2>
                <p>${infoCat.description}</p>
                <p>${infoCat.temperament}</p>
                `
                divInfo.innerHTML = info;

            })
            .catch(err => {
                onError();
                
            })
       
    })
    .catch(err => {
        
        onError();
        
    })
}

function onError() {
     Notify.failure('Oops! Something went wrong! Try reloading the page!');
        pLoader.style.display = 'none';
        divInfo.style.display = 'none';
}

