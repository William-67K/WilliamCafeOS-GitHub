// Handle Search Functionality with Debounce
function debounce(func, delay) {
  let timeout;
  return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

document.getElementById('searchInput').addEventListener('input', debounce(function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll('.coffee-item').forEach(item => {
      const name = item.getAttribute('data-name').toLowerCase();
      const notes = item.getAttribute('data-notes').toLowerCase();
      item.style.display = name.includes(query) || notes.includes(query) ? 'block' : 'none';
  });
}, 300)); // Adjust delay as needed



document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (event) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Always fetch the latest cart

    const item = event.target.closest('.coffee-item');
    const itemId = item.getAttribute('data-id');
    const itemName = item.getAttribute('data-name');
    const itemPrice = parseFloat(item.getAttribute('data-price').replace('$', ''));
    const itemImage = item.getAttribute('data-image'); // Get image URL

    // Check if the item already exists in the cart
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
      // Item exists, increase the quantity
      existingItem.quantity += 1;
    } else {
      // Item doesn't exist, add it to the cart
      cart.push({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImage, // Add image URL to the cart object
        quantity: 1 // Start with quantity 1
      });
    }

    // Update local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show feedback to the user
    alert(`${itemName} has been added to your cart.`);
    loadCartItems(); // Refresh the cart display
  });
});




function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyMessage = document.getElementById('emptyCartMessage');
  let totalPrice = 0;

  cartItemsContainer.innerHTML = ''; // Clear previous items

  if (cart.length === 0) {
    emptyMessage.style.display = 'block'; // Show empty cart message
    document.getElementById('totalAmount').textContent = '$0.00'; // Reset total price display
  } else {
    emptyMessage.style.display = 'none'; // Hide empty cart message
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const itemElement = document.createElement('div');
      itemElement.classList.add('drawer__item');
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="drawer__item-image">
        <div class="drawer__item-details">
          <h3 class="drawer__item-name">${item.name}</h3>
          <p class="drawer__item-price">$${item.price.toFixed(2)}</p>
          <input type="number" min="1" class="drawer__item-quantity" value="${item.quantity}" 
                 onchange="updateQuantity('${item.id}', this.value)">
          <button type="button" class="drawer__item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemElement);
    });

    // Update the total amount
    document.getElementById('totalAmount').textContent = `$${totalPrice.toFixed(2)}`;
  }
}

function redirectToProcess() { 
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items before proceeding to checkout.");
  } else {
    window.location.href = "process.html";
  }
}



function updateQuantity(itemId, newQuantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemIndex = cart.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = parseInt(newQuantity, 10);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems(); // Refresh the cart display
  }
}




// Function to remove an item from the cart
function removeFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Filter out the item to be removed
  cart = cart.filter(item => item.id !== itemId);

  // Update local storage with the new cart
  localStorage.setItem('cart', JSON.stringify(cart));

  // Reload the cart items to refresh the UI
  loadCartItems();
}

// Add event listener for cart toggle
document.getElementById("cartIcon").addEventListener("click", () => {
  document.getElementById("CartDrawer").classList.add("drawer--is-open");
});

// Close the cart drawer
document.getElementById("closeCartDrawer").addEventListener("click", () => {
  document.getElementById("CartDrawer").classList.remove("drawer--is-open");
});


      // Redirect to coffee.html
  function goToDetails() {
      window.location.href = "coffee.html";
  }

  // Toggle comments visibility
  function toggleComments(button) {
      const commentsSection = button.parentElement.nextElementSibling;
      if (commentsSection.style.display === "none") {
          commentsSection.style.display = "block";
          button.textContent = "Hide Comments";
      } else {
          commentsSection.style.display = "none";
          button.textContent = "Comments";
      }
  }
