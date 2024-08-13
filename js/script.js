// Initialize EmailJS
(function() {
    emailjs.init('T75g8iN7hFzON_zU-');
})();

// Global Variables
let userName = '';
let userEmail = '';
let cart = [];
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeModal = document.querySelector('.close-modal');
const checkoutButton = document.getElementById('checkout-button');

// Smooth Scroll Function
function smoothScroll(target, duration) {
    var targetElement = document.querySelector(target);
    var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Add click event for smooth navigation
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = this.getAttribute('href');
        smoothScroll(target, 800);
    });
});

// "Hamburger" Menu
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Handle Temporary Login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    userName = document.getElementById('username').value;
    userEmail = document.getElementById('useremail').value;

    Swal.fire({
        icon: 'success',
        title: 'Welcome, ' + userName + '!',
        text: 'You can now add products to your cart.',
    });

    // Clear login fields
    document.getElementById('username').value = '';
    document.getElementById('useremail').value = '';

    // Hide the login area after login
    document.querySelector('.login-area').style.display = 'none';

    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
});

// Function to add items to the cart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        if (!userName || !userEmail) {
            Swal.fire({
                icon: 'warning',
                title: 'Please login first!',
                text: 'You need to enter your name and email before adding products to the cart.',
            });
            return;
        }

        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        const img = this.dataset.img;

        const item = { name, price, img };
        cart.push(item);
        updateCart();
    });
});

// Update the cart content
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    cartCount.innerText = cart.length;
    cartTotal.innerText = `Total: $${total.toFixed(2)}`;
}

// Open the cart modal
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

// Close the cart modal
closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// "Continue Shopping" Button
document.getElementById('continue-shopping').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Finalize the purchase and send data via EmailJS
checkoutButton.addEventListener('click', function() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Empty Cart!',
            text: 'Your cart is empty. Add items to the cart before proceeding to checkout.',
        });
        return;
    }

    if (!userName || !userEmail) {
        Swal.fire({
            icon: 'warning',
            title: 'Please login first!',
            text: 'You need to enter your name and email before proceeding to checkout.',
        });
        return;
    }

    const cartDetails = cart.map(item => `Item: ${item.name}, Price: $${item.price.toFixed(2)}`).join('\n');
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    const templateParams = {
        user_name: userName,
        user_email: userEmail,
        cart_details: cartDetails,
        total_price: `$${totalPrice.toFixed(2)}`
    };

    // Send the confirmation email to the user
    emailjs.send('service_8dtlbdl', 'template_0ycb4bq', templateParams)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Purchase completed successfully!',
                text: 'You will receive an email with the details of your purchase.',
            });
            cart = []; // Clear the cart after purchase
            updateCart();
            cartModal.style.display = 'none';
        }, (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error completing purchase',
                text: 'Please try again later.',
            });
        });
});

//Contact Form
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Envia o email usando o serviço do EmailJS
    emailjs.sendForm('service_8dtlbdl', 'template_0ycb4bq', this)
        .then(function(response) {
            console.log('Success:', response);
            // Usa SweetAlert para mostrar uma mensagem de sucesso
            Swal.fire({
                title: 'Success!',
                text: 'Your message has been sent successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            // Limpa o formulário após o envio
            document.getElementById('contact-form').reset();
        }, function(error) {
            console.log('Error:', error);
            // Usa SweetAlert para mostrar uma mensagem de erro
            Swal.fire({
                title: 'Error!',
                text: 'Failed to send your message. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
});
