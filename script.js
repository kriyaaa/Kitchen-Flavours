gsap.registerPlugin(ScrollTrigger);


gsap.from('#z1 a', {
    duration:2,
    x:-30,
    stagger:0.2,
    opacity:0,   
    ease:Expo.easeInOut
})

gsap.from("#welcomel h1", {
    duration:2,
    x:-100,
    stagger:0.2,
    opacity:0
},"=-1.5")

gsap.from("#z2",{
    duration:3,
    x:100,
    // stagger:0.2,
    opacity:0
},"=-1")

const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");  
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementsByClassName("result-heading");
const single_mealEl = document.getElementById("single-meal");

// Search meals function 
function searchMeal(e) {
    e.preventDefault();
  
    // Clear single Meal
    single_mealEl.innerHTML = "";
  
    //get search Term
    const term = search.value;
  
    //Check for empty
    if (term.trim()) {
      fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
        )
        .then((res) => res.json())
        .then((data) => {
          resultHeading.innerHTML = `<h2> Search Result For ${term} : </h2>`;
  
          if (data.meals === null) {
            resultHeading.innerHTML = `<h2> There are no search results for ${term}</h2>`;
          } else {
            mealsEl.innerHTML = data.meals
              .map(
                (meal) => `
                   <div class="meal">
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                      <div class="meal-info" data-mealID="${meal.idMeal}">
                          <h3>${meal.strMeal}</h3>
                      </div>
                   </div>
                  `
              )
              .join("");
          }
        });
  
      //Clear Search Term
      search.value = "";
    } else {
      alert("Please enter a search value!");
    }
  }
  
  //Fetch Meal By Id
  
  function getMealById(mealID) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    )
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];
        addMealToDOM(meal);
      });
  }
  
  //fetch  random Meal 
  function randomMeal(){
      //Clear Meals and Heading
      mealsEl.innerHTML='';
      resultHeading.innerHTML='';
  
      fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(res => res.json())
      .then(data => {
          const meal = data.meals[0];
          addMealToDOM(meal);
      })
  
  }
  
  //Add meal to DOM
  
  function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        }else{
          break;
      }
    }
  
    single_mealEl.innerHTML = `
  <div class="single-meal">
  <h1>${meal.strMeal}</h1>
  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
  <div class="single-meal-info">
  ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
  ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
  </div>
  <div class="main">
  <p>${meal.strInstructions}</p>
  <h2>Ingredients</h2>
  <ul>
  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
  </ul>
  </div>
  </div>
  `
  }
  
  //Event Listerner
  submit.addEventListener("submit", searchMeal);
  random.addEventListener('click',randomMeal);
  mealsEl.addEventListener("click", (e) => {
    let mealInfo = e.target;
    while (mealInfo !== null && !mealInfo.classList.contains("meal-info")) {
      mealInfo = mealInfo.parentNode;
    }
    if (mealInfo) {
      const mealID = mealInfo.getAttribute("data-mealID");
      getMealById(mealID);
    }
  });
