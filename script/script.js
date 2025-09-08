const categoryContainer = document.getElementById("category-container");
const cardContainer = document.getElementById("card-container");

// const allPlantsContainer = document.getElementById("all-plants-container");
const loadAllPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.plants);
      showAllPlantsByCategory(data.plants);
    })
    .catch((err) => {
      console.log(err);
    });
};
const showAllPlantsByCategory = (plants) => {
  cardContainer.innerHTML = "";
  plants.forEach((plants) => {
    cardContainer.innerHTML += `
    <div class="bg-white p-2 rounded-lg">
            <div>
            <img class="rounded-lg max-h-40 w-full object-cover" src="${plants.image}" alt="" /></div>
            
            <h5 onclick="loadPlantDetail(${plants.id})" class="font-bold mt-3">${plants.name}</h5>
            <p class="max-h-12 overflow-hidden text-gray-400">${plants.description}</p>

            <div class="flex justify-between items-center mt-6 mb-3">
              <button
                class="bg-[#DCFCE7] px-3 py-1 text-[#15803D] font-semibold text-sm rounded-3xl"
              >
                ${plants.category}
              </button>
              <h3 class="font-bold">৳ <span>${plants.price}</span></h3>
            </div>
            <button
              class="add-to-cart-btn bg-[#15803D] px-3 py-1 text-white font-semibold text-sm rounded-3xl w-full mt-2"
            >
              Add To Cart
            </button>
          </div>
    
    `;
  });
};

loadAllPlants();

const loadCategory = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.categories);
      const categories = data.categories;
      showCategory(categories);
    })
    .catch((err) => {
      console.log(err);
    });
};
const showCategory = (categories) => {
  categories.forEach((cat) => {
    categoryContainer.innerHTML += ` <li id="${cat.id}" class="hover:bg-[#15803D50] text-left w-full pl-2">
               ${cat.category_name}
              </li>`;
  });
  categoryContainer.addEventListener("click", (e) => {
    const allLi = document.querySelectorAll("li");
    allLi.forEach((li) => {
      li.classList.remove("bg-[#15803D]");
    });
    if (e.target.localName === "li") {
      // console.log(e.target);
      e.target.classList.add("bg-[#15803D]");
      loadTreesByCategory(e.target.id);
      // console.log(e.target.id);
    }
  });
};
const loadTreesByCategory = (categoryId) => {
  console.log(categoryId);
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      // console.log(data.plants);
      showTreesByCategory(data.plants);
    })
    .catch((err) => {
      console.log(err);
    });
};
const loadPlantDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  console.log(url);
  const res = await fetch(url);
  const details = await res.json();
  displayPlantDetails(details.plants);
};
const displayPlantDetails = (plant) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `<h4 class="font-bold">${plant.name}</h4>
            <img src="${plant.image}" alt="" />
            <h4><span class="font-bold"> Catagory: </span> Tree Shate </h4>
            <h4><span class="font-bold"> Price: </span> ${plant.price} </h4>
            <h4>
              <span class="font-bold"> Description:</span> ${plant.description}
            </h4>`;
  document.getElementById("my_modal_1").showModal();
};
const showTreesByCategory = (plants) => {
  cardContainer.innerHTML = "";
  plants.forEach((plants) => {
    cardContainer.innerHTML += `
    <div class="bg-white p-2 rounded-lg">
            <div>
            <img class="rounded-lg max-h-40 w-full object-cover" src="${plants.image}" alt="" /></div>
            <button onclick="loadPlantDetail(${plants.id})"><h5 class="font-bold mt-3">${plants.name}</h5></button>
            
            
            <p class="max-h-12 overflow-hidden text-gray-400">${plants.description}</p>

            <div class="flex justify-between items-center mt-6 mb-3">
              <button
                class="bg-[#DCFCE7] px-3 py-1 text-[#15803D] font-semibold text-sm rounded-3xl"
              >
                ${plants.category}
              </button>
              <h3 class="font-bold">৳ <span>${plants.price}</span></h3>
            </div>
            <button
              class="add-to-cart-btn bg-[#15803D] px-3 py-1 text-white font-semibold text-sm rounded-3xl w-full mt-2"
            >
              Add To Cart
            </button>
          </div>
    
    `;
  });
};

loadCategory();
// Global variable to store total price
let totalPrice = 0;

cardContainer.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("add-to-cart-btn")) {
    alert("🛒 Plants has been added to your cart.");
    const plantId = e.target.getAttribute("data-id");
    const plantName = e.target
      .closest(".bg-white")
      .querySelector("h5").textContent;
    const plantPrice = e.target
      .closest(".bg-white")
      .querySelector("h3 span").textContent;

    updateCart(plantName, plantPrice);
    console.log(plantPrice);
  }
});

const cartContainer = document.getElementById("cart-container");

const updateCart = (name, price) => {
  const cartItem = document.createElement("div");

  cartItem.classList.add(
    "cart-item",
    "p-2",
    "bg-green-200",
    "flex",
    "gap-5",
    "rounded-lg",
    "mb-2",
    "justify-between",
    "items-center",
    "shadow-sm",
    "rounded-sm"
  );

  cartItem.innerHTML = `
    <div>
      <h5 class="font-semibold">${name}</h5>
      <p class="cart-price text-gray-700">${price}</p>
    </div>
    <div class="remove-btn cursor-pointer">❌</div>
  `;

  cartContainer.appendChild(cartItem);

  // Add the price to total (extract numeric value from price string)
  const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
  totalPrice += numericPrice;
  updateTotalDisplay();

  // Add event listener for remove button
  const removeBtn = cartItem.querySelector(".remove-btn");
  removeBtn.addEventListener("click", () => {
    // Subtract price when removing item
    totalPrice -= numericPrice;
    cartItem.remove();
    updateTotalDisplay();
  });
};

const updateTotalDisplay = () => {
  const totalPriceSpan = document.getElementById("total-price");
  if (totalPriceSpan) {
    totalPriceSpan.textContent = totalPrice.toFixed(2);
  }
};
