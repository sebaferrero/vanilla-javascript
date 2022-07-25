const Clickbutton = document.querySelectorAll(".button");
let carrito = [];
const tbody = document.querySelector(".tbody");
// Recorremos todos los botones de los productos
Clickbutton.forEach((btn) => {
  // Cuando escuche un evento click, obtiene el boton
  btn.addEventListener("click", addToCarritoItem);
});

function addToCarritoItem(e) {
  const button = e.target; //Obtenemos el item del que se hizo click
  const item = button.closest(".card"); //Obtengemos el contenedor que tenga la clase mas cercana "card"
  const itemTitle = item.querySelector(".card-title").textContent; // Obtenemos el nombre del producto, que se encuentra en el titulo.
  const itemPrice = item.querySelector(".precio").textContent; // Obtenemos el precio (por la clase "precio")
  const itemImg = item.querySelector(".card-img-top").src; //Obtenemos la URL a traves de la propiedad src de la imagen.

  const newItem = {
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1,
  };

  addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
  const alert = document.querySelector('.alert');  
  setTimeout(function (){
    alert.classList.add('hide')
  }, 2000)
  alert.classList.remove('hide');
  const InputElement = tbody.getElementsByClassName('input__elemento');
  for (let i = 0; i < carrito.length; i++) {
    //Verificamos si existe el producto en el carrito (trim saca todos los espacios)
    if (carrito[i].title.trim() == newItem.title.trim()) {
      carrito[i].cantidad++;
      InputElement[i].value++;
      CarritoTotal();
      return null; //Para que no pase por el push de abajo.
    }
  }

  carrito.push(newItem);
  renderCarrito();
}

function renderCarrito() {
  tbody.innerHTML = "";
  carrito.map((item) => {
    // Recorremos y creamos el elemento tr para el carrito
    const tr = document.createElement("tr");
    tr.classList.add("ItemCarrito");
    const Content = `
            <th scope="row">1</th>
            <td class="table__productos">
                <img src="${item.img}" alt="">
                <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__precio"><p>$${item.precio}</p></td>
            <td class="table__cantidad">
                <input class="input__elemento" type="number" min="1" value="${item.cantidad}">
                <button class="delete btn btn-danger">X</button>
            </td>
        `;
    tr.innerHTML = Content; //Dentro del TR que definimos, agregale todo el Content
    tbody.append(tr); // Rendizamos todo en el body
    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
    })
  CarritoTotal();
}

function CarritoTotal(){
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((item)=>{
        const precio = Number(item.precio.replace("$", ''))
        Total = Total + precio*item.cantidad;
    })

    itemCartTotal.innerHTML = `Total $${Total}`; 
    addLocalStorage();
}

function removeItemCarrito(e){
    const alert = document.querySelector('.remove');  
    setTimeout(function (){
      alert.classList.add('remove')
    }, 2000)
    alert.classList.remove('remove');
    const buttonDelete = e.target;
    const tr = buttonDelete.closest('.ItemCarrito') // Obtengo el componente padre del boton eliminar.
    console.log(tr);
    const title = tr.querySelector('.title').textContent;
    for(let i=0; i<carrito.length; i++){
        if(carrito[i].title.trim() === title.trim()){
            carrito.splice(i, 1) //Obtenemos la posicion del elemento a eliminar y lo eliminamos.
        }
    }
    tr.remove()
    CarritoTotal()
}

// Funcion para cambiar la cantidad
function sumaCantidad(e){
    const sumaInput = e.target
    const tr = sumaInput.closest('.ItemCarrito') // Obtenemos el componente padre.
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item=>{
        if(item.title.trim()==title.trim()){
            sumaInput<1 ? (sumaInput.value=1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            CarritoTotal();
        }
    })
}

function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// Cuando se refresque la pantalla o se ejecute la primerva vez, va a buscar en el localStorage la variable carrito
window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if(storage){
        carrito = storage;
        renderCarrito();
    }
}


