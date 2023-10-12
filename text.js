const url = 'https://jsonplaceholder.typicode.com/users';


fetch(url)

.then((response) => {
   return response.json();
}) 
.then(renderUser) 

.catch((error) => {
    console.log("veri çekerken hata oluştu" + error);
});

// kullanıcılar dönüp ekrana basar

function renderUser(data){
    data.forEach((user) => document.write(user.name + '<br>'));
}

