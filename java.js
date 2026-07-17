 document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector(".filter-section input");
    const productCards = document.querySelectorAll(".product-card");

    searchInput.addEventListener("keyup", function() {
      const searchValue = searchInput.value.toLowerCase();

      productCards.forEach(card => {
        const productName = card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchValue)) {
          card.style.display = "block"; // show matching product
        } else {
          card.style.display = "none"; // hide non-matching product
        }
      });
    });
  });
