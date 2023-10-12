// ! html den gelenler

const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const basketBtn = document.querySelector("#basket-btn");
const closeBtn = document.querySelector("#close-btn");
const basketList = document.querySelector("#list");
const totalInfo = document.querySelector("#total");

// ! olay izleyicileri 

// html'nin yüklenme anını izlemek için ;

document.addEventListener("DOMContentLoaded", () => {
   fetchCategories();
   fetchProducts();
});




const baseUrl = 'https://fakestoreapi.com';

function fetchCategories(){

fetch(`${baseUrl}/products/categories`)
   .then((response) => response.json())
   .then(renderCategories)
   .catch((err) => alert('kategorileri alırken bir hata oluştu'));
}

// her bir kategori için ekrana kart oluşturur.
function renderCategories(categories){

    categories.forEach((category) => {

      // console.log(categories)

       const categoryDiv = document.createElement("div");

       categoryDiv.classList.add("category");

       const randomNum = Math.round(Math.random() * 1000)

       categoryDiv.innerHTML = `
    
                <img src="https://picsum.photos/300/300?r=${randomNum}" />
                <h2>${category}</h2>
           
       `;

       categoryList.appendChild(categoryDiv);


    });
}

// data değişkenini global scope da tanımladık
// bu sayede bütün fonksiyonlar bu değere erişebilcek
let data;

// ürünler verisini çeken fonksiyon
async function fetchProducts(){

   try {
      const response = await fetch(`${baseUrl}/products`);

      data = await response.json();

      renderProducts(data);
      
   } catch (err) {

      alert("ürünleri alırken bir hata oluştu");
   }

}

// ürünleri ekrana basma
function renderProducts(products){

   // her bir ürün için ürün kartı oluşturma
  const cardsHTML = products.map(
   (product) => `
   <div class="card">
            <div class="img-wrapper">
            <img src="${product.image}"/>
            </div>
            <h4>${product.title}</h4>
            <h4>${product.category}</h4>
            <div class="info">
                <span>${product.price}₺</span>
                <button onclick="addToBasket(${product.id})">Sepete Ekle</button>
            </div>
        </div>
   `
   )
   .join(' ');

// hazırladığımız html'i ekrana bas
   productList.innerHTML = cardsHTML;

}


// ! sepet işlemleri

let basket = []
let total = 0

// modal'ı açar

basketBtn.addEventListener('click', () => {
   modal.classList.add('active');
   renderBasket();
   calculateTotal();
 });
 
 // dışarıya veya çarpıya tıklanırsa modal'ı kapatır

 document.addEventListener('click', (e) => {
   if (
     e.target.classList.contains('modal-wrapper') ||
     e.target.id === 'close-btn'
   ) {
     modal.classList.remove('active');
   }
 });


function addToBasket(id) {

   // id sinden yola çıkarak objenin değerini bulma
   const product = data.find((i) => i.id === id);

   // sepete ürün daha önce eklendiyse bulma
   const found = basket.find(i => i.id == id);

   if(found){
      // miktarını arttırır
      found.amount ++; 
   }else{

       // sepete ürünü ekler
   basket.push({...product,amount:1});

   }

   // bildirim verme
   Toastify({
      text: "ürün sepete eklendi",
      duration: 3000,
      close : true ,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },

    }).showToast();
   
  
}


// sepete elemanları listeler
function renderBasket(){

   console.log(basket);
  basketList.innerHTML = basket.map((item) =>`
   <div class="item">
                <img src="${item.image}" >
                <h3 class="title">${item.title.slice(0,20) + "..."}</h3>
                <h4 class="price">${item.price}₺</h4>
                <p>miktar: ${item.amount}</p>
                <img onclick="handleDelete(${item.id})"  id="delete-img" src="./images/e-trash.png" >
            </div>
   `
   ).join(" ");

}

// toplam ürün sayı ve fiyatını hesaplar
function calculateTotal(){

   const total = basket.reduce((sum,i) => sum+i.price* i.amount , 0);

   // toplam miktar hesaplama
   const amount = basket.reduce((sum,i) => sum + i.amount,0);
   
   // hesapladığımız bilgileri ekrana basma
   totalInfo.innerHTML = `
   <span id="count">${amount} ürün</span>
   toplam:
   <span id="price">${total.toFixed(2)}</span>₺
   `;
}


// elemanı siler
function handleDelete(deleteId){

// kaldırılacak ürünü diziden çıkarma
const newArray = basket.filter((i) => i.id !== deleteId)
basket = newArray ;

// listeyi günceller
renderBasket();

// toplamı günceller
calculateTotal();

}
