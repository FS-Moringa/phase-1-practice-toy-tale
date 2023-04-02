let addToy = false;

//this event lostener will help us create or add new toy by popping out the input to display the name and image url
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Get the container for the toy cards
const toyCollection = document.querySelector("#toy-collection");

// Fetch the list of toys from the API
fetch("http://localhost:3000/toys")
  .then((response) => response.json())
  .then((toys) => {
    // Render each toy as a card
    toys.forEach((toy) => {
      renderToyCard(toy);
    });
  });

// Add event listener to the "Add Toy" form
const addToyForm = document.querySelector(".add-toy-form");
addToyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the input values from the form
  const nameInput = document.querySelector("#name-input");
  const imageInput = document.querySelector("#image-input");
  const name = nameInput.value;
  const image = imageInput.value;

  // Create a new toy object and post it to the API
  const newToy = { name, image, likes: 0 };
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((response) => response.json())
    .then((toy) => {
      // Render the new toy as a card
      renderToyCard(toy);
      // Reset the form
      addToyForm.reset();
    });
});

// Add event listener to the "Like" buttons
toyCollection.addEventListener("click", (event) => {
  if (event.target.className === "like-btn") {
    const card = event.target.parentNode;
    const likes = card.querySelector("p");
    const toyId = event.target.id;

    // Update the likes in the API and in the DOM
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: parseInt(likes.textContent) + 1 }),
    })
      .then((response) => response.json())
      .then((toy) => {
        likes.textContent = `${toy.likes} likes`;
      });
  }
});

// Helper function to render a toy as a card
function renderToyCard(toy) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(card);
}