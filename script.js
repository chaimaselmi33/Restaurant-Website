//API variables
const APP_ID="42057505";
const APP_key="8319578f01f413a927b68842dc41bdf9";

//search variables
var select = document.querySelector('#select');
var search_result = document.querySelector(".search-result");
var searchQuery;

var mealDetail = document.querySelector('.meal-details');
//cart variables
var cartArray = new Array();
var total;
var qte = 0;
var sum = 0;

function search(){
  searchQuery = select.options[select.selectedIndex].text;
  fetchAPI(searchQuery);
}

//used to fetch data froml API
async function fetchAPI(searchQuery) {
  const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=0&to=20`;
  const response = await fetch(baseURL);
  const data = await response.json();
  console.log("data fetched", data.hits);
  useApi(data.hits);
}

fetchAPI(searchQuery);

function populateSelect(){
  let catArray = ['Pizza','Tacos','Hamburger','Chicken','Pasta','Bread'];
  catArray.forEach( e => {
    option = document.createElement('option');
    option.textContent = e;
    select.append(option);
  })
}

populateSelect();

//used to build meal items 
function useApi(data){
let html ='';
data.forEach((element) => {
    html += ` 
    <div class="col-md-4 card">
    <img class="card-img-top" src=${element.recipe.image} alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${element.recipe.label}</h5>
      <p class="card-text">Price :<p class="card-text" >${Math.floor(Math.random() * 8)+3}</p>TND</p>
      <div class="d-flex justify-content-between">
      <button id="btn-recipe" class="btn btn-recipe" onclick="getMealDetails(event)">Details</button>
      <div class="d-flex justify-content-center align-items-center cart-btn" onclick="addToCart(event)"><i class="fas fa-shopping-cart"></i></div>
      </div>
    </div>
    </div>`;
});
search_result.innerHTML = html;
}
//used to get meal details
function getMealDetails(event){
  let card =  event.target.parentElement.parentElement;
  let cardTitle = card.children;
  console.log("title :",cardTitle[0].innerText);
  mealDetailsModal(cardTitle[0].innerText);
}

// meal details modal
async function mealDetailsModal(title){
const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&from=0&to=20`;
const response = await fetch(baseURL);
const data = await response.json();

mealDetail.style.display="block";
  
  data.hits.forEach(ele =>{
  if(ele.recipe.label == title)
  {
    let modalContent='';
    let ing ='';
    ele.recipe.ingredients.map(e =>
    { ing += e.food +' ,'; });
    modalContent = `
    <button class="colse-btn" onclick="colseModal()"><i class='fa fa-close'></i></button>
    <div class="row"><h3 class="col modal-label">Meal Type :</h3><p class="col modal-detail">${ele.recipe.mealType}</p></div>
    <div class="row"><h3 class="col modal-label">Meal Ingredients :</h3><p class="col modal-detail">${ing}</p></div>
    <div class="row"><h3 class="col modal-label">Meal Calories :</h3><p class="col modal-detail">${ele.recipe.calories.toFixed(3)}</p></div>
    `;
    mealDetail.innerHTML=modalContent;
  }
});
}

function colseModal(){
  mealDetail.style.display="none";
}

//Orders tab 
function addToCart(event){
  const cardbody = event.target.parentElement.parentElement.parentElement;
  let mealName = cardbody.children[0].innerHTML;
  let mealPrice = parseInt(cardbody.children[1].nextElementSibling.innerHTML);
  console.log("mealName",mealName);
  let img = cardbody.previousElementSibling.src;
  // test deplucats
  if(cartArray.length != 0){
  let test = cartArray.some( ele => ele.name == mealName);
  if(!test){
    {  cartArray.push({name:mealName, price:mealPrice, img:img});}
  }
  console.log(test);
  }
  else
  {  
  cartArray.push({name:mealName, price:mealPrice, img:img});}
  computeTotal(mealPrice);
  displayCart();  
  console.log("worked");
}
//used to compute cart total
function computeTotal(mealPrice){
  console.log("price passed",mealPrice);
  sum += mealPrice;
  return sum;
}
//used to display cart items
function displayCart(){
var cartContainer = document.getElementById('cartContainer');
cartContainer.style.display="block";
console.log("**jkh*",cartArray);
let html ='';
cartArray.forEach(element => {
html += `
<div class="d-flex m-2 cart-item">

<img src=${element.img} width="80px" height="80px" style="border-radius: 50%;">

<div style="min-width: 200px;max-width: 200px;padding: 10px;">

<h5 class="card-title">${element.name}</h5>

<div class="d-flex">
<p class="price-qte" >Price :</p><p class="price-qte">${element.price}</p></p>
<p class="price-qte" >QTE : ${qte+1}</p>
</div>
</div>

<div>
<p><i class='fa fa-plus cart-icon' onclick="addMealQte(event)"></i></p>
<p><i class='fa fa-trash cart-icon' onclick="deleteMeal(event)"></i></p>
</div>

</div>`;
});

if(cartArray.length != 0){
cartContainer.innerHTML = html + `<h4 id="totalPrice" class="text-center">Total : ${sum} Tnd</h4>`;
}
else
{
  cartContainer.style.display="none";
}
}

function closeCart(){
  cartContainer.style.display="none";
}
//used to delete items from cart
function deleteMeal(event){
  let parent = event.target.parentElement.parentElement;
  let siblingChild = parent.previousElementSibling.children;
  let cardTitle = siblingChild[0].innerHTML;
  cartArray = cartArray.filter(ele => ele.name != cardTitle);
  /**/
  let qteParent = siblingChild[1].children;
  let qteElement = qteParent[1];
  console.log("qte",qteElement);
  qteElement.innerHTML = `QTE : ${qte}`; 
  displayCart();
}




