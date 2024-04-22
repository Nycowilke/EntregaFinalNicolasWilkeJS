console.table(products);
let cart = [];
let productContainer = document.getElementById('products');
let cartItems = document.getElementById("cartItems");
let lastShownProductIndex = 12; 
const numProductsToShow = 12; 
const numProductsToAdd = 4;   
const loadMoreBtn = document.getElementById('loadMoreBtn');
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-warning m-1',
        cancelButton: 'btn btn-success m-1'
    },
    buttonsStyling: false
})

document.addEventListener('DOMContentLoaded', () => {
    updateCartFromLocalStorage();
    updateCartAndUserFromLocalStorage(); 
    productRendering(lastShownProductIndex);
    
    loadMoreBtn.addEventListener('click', () => {
        loadMoreProducts();
    });
});

function productRendering(numToShow) {
    productContainer.innerHTML = ""; 
    let counter = 0; 
    for (let i = 0; i < numToShow; i++) {
        if (counter >= numToShow) {
            break;
        }
        const product = products[i];
        productContainer.innerHTML += `
        <div class="card position-relative" style="width: 17.5rem;">
            <img class="card-img-top" src=${product.photo} alt="Card image cap">
            <div class="overlay">
                <div class="overlay-content">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Precio $ ${product.price}.00 ARG</p>
                    <button id=${product.id} class="btn btn-light buy"><i class="bi bi-cart-plus-fill"></i></button>
                </div>
            </div>
        </div>
        `;
        counter++;
    }
    // Events
    let buttons = document.getElementsByClassName("buy");
    for (const button of buttons) {
        button.addEventListener('click', () => {
            console.log('there is a click on the button id: ' + button.id);
            const itemToCart = products.find((product) => product.id == button.id)
            console.log(itemToCart);
            addToCart(itemToCart);
            Toastify({
                text: `${itemToCart.name} agregado al carrito`,
                duration: 2000,
                className: "tst",
                style: {
                    background: "#ffc107",
                },
                gravity: 'top',
                position: 'right'
            }).showToast()
        })
        button.onmouseover = () => button.classList.replace('btn-light', 'btn-warning');
        button.onmouseout = () => button.classList.replace('btn-warning', 'btn-light');
    }
    console.log('Products rendered:', counter);
}


function loadMoreProducts() {
    const remainingProducts = products.length - lastShownProductIndex;
    const numToShowNext = Math.min(remainingProducts, numProductsToAdd);

    if (numToShowNext > 0) {
        lastShownProductIndex += numToShowNext;
        productRendering(lastShownProductIndex);
    } else {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = "No hay más productos";
    }
}


function addToCart(product) {
    const existingCartItem = cart.find(item => item.product.id === product.id);
    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push({ product: product, quantity: 1 });
    }
    console.table(cart);
    updateTotalPrice();
    updatePaymentButton();
    saveCartToLocalStorage();
    updateCartTable();
}

function calculateTotalPrice() {
    let totalPrice = 0;
    for (const cartItem of cart) {
        const product = cartItem.product;
        const quantity = cartItem.quantity;
        totalPrice += product.price * quantity;
    }
    return totalPrice;
}

function updateTotalPrice() {
    const totalPrice = calculateTotalPrice();
    cartTotal.innerHTML = `$${totalPrice.toFixed(2)} ARG`;
}


function calculateTotalItemCount() {
    return cart.length;
}


function updatePaymentButton() {
    const totalQuantity = calculateTotalQuantity();
    const btnPayment = document.getElementById('btnPayment');
    btnPayment.innerHTML = `<i class="bi bi-cart"></i> Proceder al pago (${totalQuantity})`;


    btnPayment.addEventListener('click', () => {
        $('#createAccountModal').modal('show');
    });
}



function calculateTotalQuantity() {
    let totalQuantity = 0;
    for (const item of cart) {
        totalQuantity += item.quantity;
    }
    return totalQuantity;
}



function updateCartTable() {
    cartItems.innerHTML = '';
    cart.forEach((cartItem, index) => {
        const product = cartItem.product;
        const quantity = cartItem.quantity;

        cartItems.innerHTML += `
            <tr>
                <td>
                    <button class="btn btn-sm btn-light minus-item" data-index="${index}">
                        <i class="bi bi-dash"></i>
                    </button>
                    <button class="btn btn-sm btn-danger remove-item ${quantity === 1 ? '' : 'd-none'}" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                    ${quantity}
                    <button class="btn btn-sm btn-light plus-item" data-index="${index}">
                        <i class="bi bi-plus"></i>
                    </button>
                </td>
                <td><img src="${product.photo}" alt="${product.name}" class="cart-size"></td>
                <td>${product.name}</td>
                <td>$ ${product.price}.00 ARG</td>
            </tr>
        `;

        
        const minusButton = document.getElementsByClassName('minus-item')[index];
        if (quantity === 1) {
            minusButton.classList.add('d-none');
        } else {
            minusButton.classList.remove('d-none');
        }

        
        const trashButton = document.getElementsByClassName('remove-item')[index];
        if (quantity === 1) {
            trashButton.classList.remove('d-none');
        } else {
            trashButton.classList.add('d-none');
        }
    });

    updateTotalPrice();
    attachCartButtonListeners();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartTable();
    saveCartToLocalStorage();
    updatePaymentButton();
}

function decreaseQuantity(index) {
    const cartItem = cart[index];
    if (cartItem.quantity > 1) {
        cartItem.quantity--;
        updateCartTable();
        saveCartToLocalStorage();
        updatePaymentButton();
    }
}

function increaseQuantity(index) {
    const cartItem = cart[index];
    cartItem.quantity++;
    updateCartTable();
    saveCartToLocalStorage();
    updatePaymentButton();
}

attachCartButtonListeners();


function attachCartButtonListeners() {
    const removeButtons = document.getElementsByClassName('remove-item');
    const minusButtons = document.getElementsByClassName('minus-item');
    const plusButtons = document.getElementsByClassName('plus-item');


    const removeButtonArray = Array.from(removeButtons);
    const minusButtonArray = Array.from(minusButtons);
    const plusButtonArray = Array.from(plusButtons);

    removeButtonArray.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            showDeleteConfirmation(index);
        });
    });

    minusButtonArray.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            decreaseQuantity(index);
        });
    });

    plusButtonArray.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            increaseQuantity(index);
        });
    });
}

function showDeleteConfirmation(index) {
    swalWithBootstrapButtons.fire({
        title: 'Quitar del carrito?',
        text: 'Quitar el producto del carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si.',
        cancelButtonText: 'No.',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            removeFromCart(index);
            Swal.fire(
                'Listo!',
                'El producto se ha quitado del carrito.',
                'Listo!'
            );
        }
    });
}

const btnClearCart = document.getElementById('btnClearCart');
btnClearCart.addEventListener('click', () => {
    swalWithBootstrapButtons.fire({
        title: 'Está seguro de querer vaciarlo?',
        text: "No podrá revertirlo!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si.'
    }).then((result) => {
        if (result.isConfirmed) {
            clearCart(); 
            Swal.fire(
                'Su carrito está vacío.',
                'Nuevo carrito',
                'Listo'
            );
        }
    });
});

function clearCart() {
    cart = [];
    saveCartToLocalStorage();
    updateCartTable();
    updatePaymentButton();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
}

function updateCartFromLocalStorage() {
    cart = getCartFromLocalStorage();
    updateCartTable();
    updatePaymentButton();
}

const createAccountBtn = document.getElementById('createAccountBtn');
createAccountBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const user = { name, email };
    localStorage.setItem('user', JSON.stringify(user));

    
    $('#createAccountModal').modal('hide');

    
    updatePaymentButton();
});


function updateCartAndUserFromLocalStorage() {
    cart = getCartFromLocalStorage();
    user = getUserFromLocalStorage();
    updateCartTable();
    updatePaymentButton();
}


function getUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
}




let emailNewsletter = document.getElementById('email');

emailNewsletter.onkeyup = () => {
    if (emailNewsletter.value.length < 13 || ((!emailNewsletter.value.includes('@') || !emailNewsletter.value.includes('.')))) {
        console.log('e-mail no válido')
        emailNewsletter.style.color = '#bb0f0f';
        document.getElementById('emailHelp').innerText = "Ingrese un e-mail válido.";
    } else {
        emailNewsletter.style.color = 'black';
        document.getElementById('emailHelp').innerText = " Buen e-mail! :)";
    }
}

emailNewsletter.onchange = () => {
    document.getElementById('emailHelp').innerText = "Este sitio no comparte tu información con nadie.";
}
let formNewsletter = document.getElementById('formNewsletter');
formNewsletter.addEventListener('submit', validate);
function validate(ev) {
    if (emailNewsletter.value == '') {
        ev.preventDefault();
        alert('Ingresar un e-mail válido')
    }
}

const modeButton = document.getElementById('modeButton');
const container = document.getElementById('mainBody');

console.log('Modo ' + localStorage.getItem('modeButton'));


const currentMode = localStorage.getItem('modeButton') || 'light';

// Conditional
if (currentMode === 'dark') {
    // If it is set to dark
    document.body.className = 'dark';
    container.classList.replace('light', 'dark');
    modeButton.innerText = 'Modo claro';
} else {

    localStorage.setItem('modeButton', 'light');
}


modeButton.onclick = () => {
    if (localStorage.getItem('modeButton') === 'light') {
        toDark();
    } else {
        toLight();
    }
}

function toDark() {
    document.body.className = 'dark';
    container.classList.replace('light', 'dark');
    modeButton.innerText = 'Modo claro';
    localStorage.setItem('modeButton', 'dark');
}

function toLight() {
    document.body.className = 'light';
    container.classList.replace('dark', 'light');
    modeButton.innerText = 'Modo oscuro';
    localStorage.setItem('modeButton', 'light');
}


