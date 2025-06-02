import { deleteCard, likeCard, unlikeCard } from "../api.js";
// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: Функция создания карточки
export function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  openImageCallback,
  userId
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  if (cardData.owner && cardData.owner._id !== userId) {
    deleteButton.style.display = "none";
  }

  // Создаем элемент для отображения количества лайков
  const likeCountElement = document.createElement("span");
  likeCountElement.classList.add("card__like-count");
  likeCountElement.textContent = cardData.likes.length;
  likeButton.after(likeCountElement);

  // Проверяем, есть ли наш лайк на карточке
  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Обработчики событий
  cardImage.addEventListener("click", () => openImageCallback(cardData));
  deleteButton.addEventListener("click", () =>
    deleteCallback(cardData._id, cardElement)
  );
  likeButton.addEventListener("click", () =>
    likeCallback(cardData._id, likeButton, likeCountElement)
  );

  return cardElement;
}

// Функции обработчики (их нужно экспортировать)
export function handleDeleteCard(cardId, cardElement) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log("Ошибка при удалении карточки:", err);
    });
}

export function handleLikeCard(cardId, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  const likePromise = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  likePromise
    .then((updatedCard) => {
      likeCountElement.textContent = updatedCard.likes.length;
      likeButton.classList.toggle("card__like-button_is-active");
    })
    .catch((err) => {
      console.log("Ошибка при лайке:", err);
    });
}
