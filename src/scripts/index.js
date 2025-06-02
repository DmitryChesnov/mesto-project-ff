import {
  createCard,
  handleDeleteCard,
  handleLikeCard,
} from "./components/card";
import { openPopup, closePopup } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import {
  getUserInfo,
  getInitialCards,
  updateProfile,
  addNewCard,
  updateAvatar,
} from "./api";

let userId;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Popups
const popups = document.querySelectorAll(".popup");
const editPopup = document.querySelector(".popup_type_edit");
const newCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarForm = document.forms['update-avatar'];
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-url');
const avatarImage = document.querySelector('.profile__image');

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
  clearValidation(editForm, validationConfig);
  openPopup(editPopup);
});

editForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = editForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateProfile(nameInput.value, jobInput.value)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(editPopup);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

addButton.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openPopup(newCardPopup);
});

newCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = newCardForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  addNewCard(cardNameInput.value, cardUrlInput.value)
    .then((cardData) => {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        handleLikeCard,
        openImagePopup,
        userId
      );
      placesList.prepend(cardElement);
      closePopup(newCardPopup);
      newCardForm.reset();
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

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

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;

    // Обновляем профиль данными с сервера
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    avatarImage.style.backgroundImage = `url(${userData.avatar})`;
    // Отображаем карточки с сервера
    cards.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        handleLikeCard,
        openImagePopup,
        userId
      );
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log("Ошибка при загрузке данных:", err);
  });

  // Добавить обработчик открытия попапа аватара
avatarImage.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopup(avatarPopup);
});

// Добавить обработчик отправки формы аватара
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateAvatar(avatarInput.value)
    .then((userData) => {
      avatarImage.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(avatarPopup);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});
