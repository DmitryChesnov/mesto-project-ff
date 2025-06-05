function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
}
// заморочился с созданием функции получения кастомной ошибки, а то все показывало браузерные и не соответствовало макету
function getCustomErrorMessage(inputElement) {
  if (inputElement.validity.valueMissing) {
    return inputElement.dataset.errorRequired || inputElement.validationMessage;
  }
  if (inputElement.validity.tooShort) {
    if (inputElement.dataset.errorMinlength) {
      const length = inputElement.value.length;
      const ending = length === 1 ? "" : "а";
      return inputElement.dataset.errorMinlength
        .replace("{length}", length)
        .replace("{ending}", ending);
    }
    return inputElement.validationMessage;
  }
  if (inputElement.validity.patternMismatch) {
    return inputElement.dataset.errorPattern || inputElement.validationMessage;
  }
  if (inputElement.validity.typeMismatch && inputElement.type === "url") {
    return inputElement.dataset.errorMessage || inputElement.validationMessage;
  }
  return inputElement.validationMessage;
}

function checkInputValidity(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    const errorMessage = getCustomErrorMessage(inputElement);
    showInputError(formElement, inputElement, errorMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
}

function setEventListeners(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
}

function enableValidation(settings) {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
}

function clearValidation(formElement, settings) {
  const inputList = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    settings.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  toggleButtonState(inputList, buttonElement, settings);
}

export { enableValidation, clearValidation };
