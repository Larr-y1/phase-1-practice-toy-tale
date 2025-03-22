let addToy = false;

  
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const toyUrl = "http://localhost:3000/toys";

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

  // Fetch and display all toys
  function fetchToys() {
    fetch(toyUrl)
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => renderToy(toy));
      })
      .catch(error => console.error("Error fetching toys:", error));
  }

  // Render a toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => increaseLikes(toy, card));

    toyCollection.appendChild(card);
  }

  // Add a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    };

    fetch(toyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        renderToy(toy);
        toyForm.reset();
      })
      .catch(error => console.error("Error adding toy:", error));
  });

  // Increase toy likes
  function increaseLikes(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`${toyUrl}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
  }

  // Initial fetch of toys
  fetchToys();
});
