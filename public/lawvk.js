//const { application } = require("express");

function myFun(){
    let searchVal = document.getElementById("inp").value.toUpperCase() ;
    let table = document.getElementsByTagName("table")
    let tr = document.getElementsByTagName("tr");

    let front = document.querySelector(".main")

    for(let i=0; i<tr.length; i++){
        let td = tr[i].getElementsByTagName("td")[0];
        if(td){
            let text = td.innerText;
            if(text.toLocaleUpperCase().indexOf(searchVal) > -1){
                tr[i].style.display="";
                front.style.display="none"
            }else{
                tr[i].style.display="none"
            }
        }
    }

    if(searchVal == ""){
        front.style.display="flex"
    }
    console.log(searchVal);
}



function nav(){
    let nav = document.querySelector(".nav");
    nav.style.display="block"
    let login = document.querySelector(".login");
    login.style.display="none";

}

function login(){
    let login = document.querySelector(".login");
    login.style.display="block";

    let nav = document.querySelector(".nav");
    nav.style.display="none"

}


// Slide bar

let slide = document.querySelectorAll(".customer");
let count = 0;
console.log(slide);

slide.forEach(function(customer, index){
    customer.style.left=`${index * 100}%`
})

function next(){
    count ++;
    if(count == slide.length){
        count=0;
    }
    bar()
}

function pre(){
    count--;
    if(count == -1){
        count = slide.length-1
    }
    bar()
}


function bar(){
    slide.forEach(function(customer){
        customer.style.transform = `translateX(-${count * 100}%)`
    })
}

let a = {
    greet:"HI"
}
let c;
c=a;
a.age=11;

console.log(c.age);

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('order-btn')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}
        
        
        function purchaseClicked() {
            var stripeHandler = StripeCheckout.configure({
                key: stripePublicKey,
                locale: 'en',
                token: function(token) {
                    var items = [];
                    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
                    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
                    var price = parseFloat(document.getElementsByClassName('cart-total-price')[0].innerText.replace('Rs ', ''));
        
                    // Loop through each item in the cart and collect its ID and quantity
                    for (var i = 0; i < cartRows.length; i++) {
                        var cartRow = cartRows[i];
                        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
                        var quantity = quantityElement.value;
                        var id = cartRow.dataset.itemId;                               
                        items.push({
                            id: id,
                            quantity: quantity
                        });
                    }
        
                    // Send a POST request to the server with the token and items
                    fetch('/checkout-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            stripeTokenId: token.id,
                            items: items,
                            price: price
                        })
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(data) {
                        // Redirect to the Stripe Checkout page
                        // stripeHandler.open({
                        //     sessionId: data.sessionId
                        // });
                        alert("Order placed successfully");
                        var cartItems = document.getElementsByClassName('cart-items')[0];
                        while (cartItems.hasChildNodes()) {
                            cartItems.removeChild(cartItems.firstChild);
                        }
                        updateCartTotal();
                    })
                    .catch(function(error) {
                        console.error(error);
                        alert("Error processing payment. Please try again.");
                    });
                }
            });
        
            var priceElement = document.getElementsByClassName('cart-total-price')[0];
             var price = parseFloat(priceElement.innerText.replace('₹', ''));
        
            stripeHandler.open({
                amount: price * 100  // Convert to smallest currency unit (e.g., cents for USD)
            });
        }

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement
    var title = shopItem.getElementsByClassName('food-title')[0].innerText
    var price = shopItem.getElementsByClassName('food-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('food-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('₹', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    // total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = 'Rs' + total
}