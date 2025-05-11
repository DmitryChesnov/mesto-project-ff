// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: Функция создания карточки
export function createCard(
  cardData,
  deleteCallback,
  likeCallback,
  imageCallback
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  // Слушатель удаления

  deleteButton.addEventListener("click", () => deleteCallback(cardElement));
  likeButton.addEventListener("click", likeCallback);
  cardImage.addEventListener("click", () => imageCallback(cardData));

  return cardElement;
}
