
const search1 = document.querySelector('#search1');
const search2 = document.querySelector('#search2');
const list1 = document.querySelector('#list1');
const list2 = document.querySelector('#list2');



const searchHeroes =  async searchHeroName =>{
    const res = await fetch('heroes.json')
    const heroes = await res.json();
    console.log(searchHeroName);
    //Get match to current text input
    let matches = heroes.filter(hero => {
        const regex = new RegExp(`^${searchHeroName}`, 'gi')
        return hero.name.match(regex);
    })


    //Clear out div if search bar is empty
    if(searchHeroName.length === 0){
        matches = [];
    }

    if(search1.value === ''){
        list1.style.visibility = 'hidden';
    }
    if(search2.value === ''){
        list2.style.visibility = 'hidden';
    }

    outputHtml(matches, searchHeroName)
}




const outputHtml = (matches, searchValue) => {
    if(matches.length > 0){
        const html = matches.map(match => `
        <div  class="heroCard card text-white card-body bg-info mb-3">
        <h4>${match.id} ${match.name}</h4></div>`).join('');

      if(searchValue === search1.value){
          list1.style.visibility = 'visible';
          list1.innerHTML = html
      }  
      if(searchValue === search2.value){
          list2.style.visibility = 'visible';
          list2.innerHTML = html;
      }
    }
    const heroCard = document.querySelectorAll('.heroCard');

    //Create Events on all hero cards
for (i in heroCard) {
    let hero = heroCard[i];
    //Add hero card text to search bar on click
    hero.addEventListener('click', () => {
        if(hero.parentNode.id === 'list1'){
            search1.value = hero.innerText;
        }
        if(hero.parentNode.id === 'list2'){        
            search2.value = hero.innerText;
        }
    })

    //Create a toggle when a user hovers over a hero card
    hero.addEventListener('mouseenter', () => {
        setTimeout(() => {
            hero.style.opacity = '0.5';
        }, 100);
    })
    hero.addEventListener('mouseleave', () => {
        setTimeout(() => {
            hero.style.opacity = '1';
        }, 100);
    })

  
}
}

search1.addEventListener('input', () =>searchHeroes(search1.value));
search2.addEventListener('input', () => searchHeroes(search2.value));
