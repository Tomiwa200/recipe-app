    const mealsEl = document.getElementById('meals');
    const favContainer = document.getElementById('fav-meals');
    const searchTerm = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const mealInfo = document.getElementById('meal-info');
    const mealPopup = document.getElementById('meal-popup');
    const popUpClose = document.getElementById('close-popup');
  getRandomMeal();
 //setInterval(getRandomMeal, 3000); 
  fetchFavMeals();
 
 async function getRandomMeal() {
    const resp =  await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const respData =  await resp.json();
    const randomMeal = respData.meals[0];

    
    
    addMeal(randomMeal, true);
   

}

async function getMealById(id) {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php?i=`+id);
   

    const respData = await resp.json();
    const meal = respData.meals[0];
    
    return meal;
}

async function getMealsBySearch(term) {
    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`+term);
       
    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}


function addMeal(mealData, random = false) {
        const meal = document.createElement('div');
        meal.classList.add('meal');
        meal.innerHTML = `
            
        <div class="meal-header">
            ${random?`<span class="random"> Random Recipe</span>`:''}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button  class="fav-btn"><i class="fas fa-heart"></i></button>
        </div>
         `
        
         const btn = meal.querySelector('.meal-body .fav-btn');
         btn.addEventListener('click', () => {
            if(btn.classList.contains('active')){
                removeMealLS(mealData.IdMeal);
                btn.classList.remove('active');
            } else {
                addMealLS(mealData.IdMeal);
                btn.classList.add('active');
            }

               fetchFavMeals();
         });
          
         
         meal.addEventListener('click', ()=>{
          loadMealInfo(mealData);
         });

                    
         mealsEl.appendChild(meal); 
         
}

  function addMealLS(mealId) {
    const mealIds = getMealLS();   
    
    localStorage.setItem(
        'mealIds', JSON.stringify([...mealIds, mealId])
    );
  }
  function removeMealLS(mealId) {
    const mealIds = getMealLS();  
    
    localStorage.setItem(
        'mealIds', JSON.stringify(mealIds.filter(id=> id!==mealId))
    );
  }

  function getMealLS() {
     const mealIds = JSON.parse(localStorage.getItem('mealIds'));
     return mealIds===null?[]:mealIds;
  } 

   async function fetchFavMeals() {
      const mealIds = getMealLS();
      
      for(let i=0; i<mealIds.length; i++) {
          const mealId = mealIds[i];

          meal= await getMealById(mealId);
          
          }
          addFavMeal(meal);
  }

  function addFavMeal(mealData)  {
                
    const favMeal = document.createElement('li');
    favMeal.innerHTML = `
      <img src='${mealData.strMealThumb}'alt="${mealData.strMeal}"> <span>${mealData.strMeal}</span>
         <button class="clear"><i class="fas fa-times"></i></button> ` ;
       const btn = favMeal.querySelector('.clear');
        btn.addEventListener( 'click', () => {
         removeMealLS(mealData.IdMeal);
         
       });
       favMeal.addEventListener('click', ()=>{
        loadMealInfo(mealData);
       });
     favContainer.appendChild(favMeal);
  }


   searchBtn.addEventListener('click', async ()=> {
         
      // clean meals container
       mealsEl.innerHTML = '';
         const search = searchTerm.value;
             
          const meals =  await getMealsBySearch(search);
         
          if(meals) {
            meals.forEach(meal => {
              addMeal(meal);
            });
          }

          

   });
      
      function loadMealInfo(mealData) {
        mealInfo.innerHTML='';
        const infoEl = document.createElement('div');
          
      //get ingredient measures
        const ingredients = [];
          for(i=1; i<=20; i++){
            if(mealData['strIngredient'+i]){
                 ingredients.push(
                   `${mealData['strIngredient' + i]} - ${mealData['strMeasure'+i]}`
                 );
            }else {
              break;
            } 
          }

         infoEl.innerHTML= `
            <h1>${mealData.strMeal}</h1>
            <img src="${mealData.strMealThumb}" alt="">
        
          
            <p> ${mealData.strInstructions}
            </p>
            <h3>Ingredients:</h3>
             <ul>
               ${ingredients.map(
                 (ing)=>`<li>${ing}</li>`).join('')}
             </ul>
              `

        mealInfo.appendChild(infoEl);
        
           mealPopup.classList.remove('hidden'); 
            
      }

    popUpClose.addEventListener('click', ()=> {
        mealPopup.classList.add('hidden');

    });

       
   
