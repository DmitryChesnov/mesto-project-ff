import { initialCards } from "./cards";
import { createCard } from "./components/card";
import { openPopup, closePopup } from "./components/modal";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Popups
const popups = document.querySelectorAll(".popup");
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");

// Buttons
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

// Forms
const editForm = document.forms["edit-profile"];
const newCardForm = document.forms["new-place"];

// Form inputs
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");
const cardNameInput = newCardForm.querySelector(".popup__input_type_card-name");
const cardUrlInput = newCardForm.querySelector(".popup__input_type_url");

// Image popup elements
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

// Close popup by Escape key
function closeByEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  }
}
document.addEventListener("keydown", closeByEscape);
// Close popup by clicking on overlay
popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});
// Edit profile form handling
editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(editPopup);
});

editForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(editPopup);
});

// Add new card form handling
addButton.addEventListener("click", () => {
  newCardForm.reset();
  openPopup(newCardPopup);
});

newCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const cardData = {
    name: cardNameInput.value,
    link: cardUrlInput.value,
  };
  const cardElement = createCard(
    cardData,
    deleteCard,
    likeCard,
    openImagePopup
  );
  placesList.prepend(cardElement);
  closePopup(newCardPopup);
});

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

function openImagePopup(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

// Close buttons
document.querySelectorAll(".popup__close").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});
console.log(initialCards);
// Initial cards rendering
initialCards.forEach((cardData) => {
  const cardElement = createCard(
    cardData,
    deleteCard,
    likeCard,
    openImagePopup
  );
  placesList.append(cardElement);
});
