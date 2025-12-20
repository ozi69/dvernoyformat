document.addEventListener('DOMContentLoaded', function() {
  // Элементы для галереи
  const worksImages = document.querySelectorAll('.works-img');
  
  // Элементы модального окна
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const imageCounter = document.getElementById('imageCounter');
  
  let currentImageIndex = 0;
  
  // Переменные для свайпов
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;
  
  // Проверяем мобильное устройство
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Показать все изображения сразу
  function showAllImages() {
    worksImages.forEach(imgContainer => {
      imgContainer.style.display = 'block';
    });
    addImageClickHandlers();
  }
  
  // Добавить обработчики клика на изображения
  function addImageClickHandlers() {
    worksImages.forEach((imgContainer, index) => {
      const img = imgContainer.querySelector('img');
      if (img) {
        img.addEventListener('click', function() {
          openModal(index);
        });
      }
    });
  }
  
  // Открыть модальное окно
  function openModal(index) {
    currentImageIndex = index;
    updateModalImage();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // На мобильных скрываем кнопки навигации
    if (isMobile()) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }
  
  // Закрыть модальное окно
  function closeModalWindow() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  
  // Обновить изображение в модальном окне
  function updateModalImage() {
    if (worksImages[currentImageIndex]) {
      const imgSrc = worksImages[currentImageIndex].querySelector('img').src;
      modalImage.src = imgSrc;
      modalImage.alt = worksImages[currentImageIndex].querySelector('img').alt;
      
      imageCounter.textContent = `${currentImageIndex + 1} / ${worksImages.length}`;
      
      // Обновляем состояние кнопок (только на десктопе)
      if (!isMobile()) {
        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === worksImages.length - 1;
      }
    }
  }
  
  // Следующее изображение
  function nextImage() {
    if (currentImageIndex < worksImages.length - 1) {
      currentImageIndex++;
      updateModalImage();
    }
  }
  
  // Предыдущее изображение
  function prevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      updateModalImage();
    }
  }
  
  // Обработчики свайпов для мобильных (модальное окно)
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    isSwiping = true;
  }
  
  function handleTouchMove(e) {
    if (!isSwiping) return;
    e.preventDefault();
  }
  
  function handleTouchEnd(e) {
    if (!isSwiping) return;
    
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
      nextImage();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      prevImage();
    }
    
    isSwiping = false;
  }
  
  // Обработчики клавиатуры
  function handleKeyDown(e) {
    if (!modal.classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeModalWindow();
        break;
      case 'ArrowLeft':
        if (!isMobile()) prevImage();
        break;
      case 'ArrowRight':
        if (!isMobile()) nextImage();
        break;
    }
  }
  
  // Инициализация галереи
  function initGallery() {
    showAllImages();
  }
  
  // Назначаем обработчики событий
  
  // Модальное окно
  closeModal.addEventListener('click', closeModalWindow);
  
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModalWindow();
    }
  });
  
  // Обработчики навигации (только для десктопа)
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);
  
  // Обработчики свайпов (только для мобильных)
  modal.addEventListener('touchstart', handleTouchStart, { passive: false });
  modal.addEventListener('touchmove', handleTouchMove, { passive: false });
  modal.addEventListener('touchend', handleTouchEnd);
  
  // Клавиши клавиатуры
  document.addEventListener('keydown', handleKeyDown);
  
  // Обработчик изменения размера окна
  window.addEventListener('resize', function() {
    // При ресайзе обновляем видимость кнопок модального окна
    if (modal.classList.contains('active')) {
      if (isMobile()) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      }
    }
  });
  
  // Запускаем инициализацию
  initGallery();
});

// -------------- для блока с вопросами
document.addEventListener('DOMContentLoaded', function() {
    const surveyData = {
        currentQuestion: 1,
        totalQuestions: 4,
        answers: {}
    };
    
    const nextButton = document.querySelector('.down-survey_btn');
    const backButton = document.querySelector('.back-btn'); // Добавлено
    const questionNumber = document.querySelector('.survey-count__number');
    const questionTitles = document.querySelectorAll('.survey-title');
    const questionBlocks = document.querySelectorAll('.block-choice');
    
    // Инициализация
    updateQuestionDisplay();
    
    // Обработчик для карточек с выбором
    document.querySelectorAll('.choice-card').forEach(card => {
        card.addEventListener('click', function() {
            const block = this.closest('.block-choice');
            const questionNum = getQuestionNumber(block);
            
            // Убираем выделение у всех карточек в этом блоке
            block.querySelectorAll('.choice-card').forEach(c => {
                c.classList.remove('selected');
            });
            
            // Добавляем выделение выбранной карточке
            this.classList.add('selected');
            
            // Сохраняем ответ
            surveyData.answers[questionNum] = this.dataset.value;
            
            // Убираем сообщение об ошибке
            const errorMessage = block.querySelector('.error-message');
            errorMessage.classList.remove('show');
        });
    });
    
    // Обработчик для радио кнопок
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const block = this.closest('.block-choice');
            const questionNum = getQuestionNumber(block);
            
            // Сохраняем ответ
            surveyData.answers[questionNum] = this.value;
            
            // Убираем сообщение об ошибке
            const errorMessage = block.querySelector('.error-message');
            errorMessage.classList.remove('show');
            
            // Добавляем выделение для label
            const labels = block.querySelectorAll('.radio-label');
            labels.forEach(label => {
                label.classList.remove('selected');
                const radioInLabel = label.querySelector('input[type="radio"]');
                if (radioInLabel.checked) {
                    label.classList.add('selected');
                }
            });
        });
    });
    
    // Обработчик кнопки "Продолжить"
    nextButton.addEventListener('click', function() {
        const currentBlock = document.querySelector('.block-choice.active');
        const questionNum = getQuestionNumber(currentBlock);
        
        // Проверяем, выбран ли ответ
        if (!surveyData.answers[questionNum]) {
            const errorMessage = currentBlock.querySelector('.error-message');
            errorMessage.textContent = 'Пожалуйста, выберите один из вариантов для продолжения';
            errorMessage.classList.add('show');
            return;
        }
        
        // Если это последний вопрос
        if (surveyData.currentQuestion === surveyData.totalQuestions) {
            console.log('Все ответы:', surveyData.answers);
            alert('Спасибо за прохождение опроса!');
            return;
        }
        
        // Переход к следующему вопросу
        surveyData.currentQuestion++;
        updateQuestionDisplay();
    });
    
    // Обработчик кнопки "Назад" - Добавлено
    backButton.addEventListener('click', function() {
        if (surveyData.currentQuestion > 1) {
            surveyData.currentQuestion--;
            updateQuestionDisplay();
        }
    });
    
    // Функция для получения номера вопроса из класса блока
    function getQuestionNumber(block) {
        const blockClass = Array.from(block.classList).find(cls => cls.startsWith('block-choice_'));
        if (blockClass) {
            const num = blockClass.split('_')[1];
            switch(num) {
                case 'one': return 1;
                case 'two': return 2;
                case 'three': return 3;
                case 'four': return 4;
                default: return parseInt(num);
            }
        }
        return null;
    }
    
    // Функция для обновления отображения вопросов - ОДИН раз объявлена
    function updateQuestionDisplay() {
        // Обновляем номер вопроса
        questionNumber.textContent = surveyData.currentQuestion;
        
        // Обновляем заголовки вопросов
        questionTitles.forEach((title, index) => {
            title.classList.remove('active');
            if (index === surveyData.currentQuestion - 1) {
                title.classList.add('active');
            }
        });
        
        // Обновляем блоки с вариантами ответов
        questionBlocks.forEach((block, index) => {
            block.classList.remove('active');
            if (index === surveyData.currentQuestion - 1) {
                block.classList.add('active');
            }
        });
        
        // Показываем/скрываем кнопку "Назад" - Исправлено
        if (surveyData.currentQuestion > 1) {
            backButton.style.display = 'block';
        } else {
            backButton.style.display = 'none';
        }
        
        // Восстанавливаем выбранные ответы при возврате - Добавлено
        restoreSelectedAnswers();
        
        // Обновляем текст кнопки
        if (surveyData.currentQuestion === surveyData.totalQuestions) {
            nextButton.textContent = 'Завершить';
        } else {
            nextButton.textContent = 'Продолжить';
        }
    }
    
    // Функция для восстановления выбранных ответов при возврате назад - Добавлено
    function restoreSelectedAnswers() {
        const currentBlock = document.querySelector('.block-choice.active');
        const questionNum = getQuestionNumber(currentBlock);
        const savedAnswer = surveyData.answers[questionNum];
        
        if (!savedAnswer) return;
        
        // Для карточек
        const choiceCards = currentBlock.querySelectorAll('.choice-card');
        if (choiceCards.length > 0) {
            choiceCards.forEach(card => {
                card.classList.remove('selected');
                if (card.dataset.value === savedAnswer) {
                    card.classList.add('selected');
                }
            });
        }
        
        // Для радио кнопок
        const radioInputs = currentBlock.querySelectorAll('input[type="radio"]');
        if (radioInputs.length > 0) {
            radioInputs.forEach(radio => {
                radio.checked = (radio.value === savedAnswer);
                const label = radio.closest('.radio-label');
                if (label) {
                    label.classList.remove('selected');
                    if (radio.checked) {
                        label.classList.add('selected');
                    }
                }
            });
        }
    }
});


// burger-menu


document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
  const menuListBtn = document.querySelector(".menu-list__btn")
  const menuListCatalog = document.querySelector(".menu-list__catalog")
  
  // Открытие меню
  burgerMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    // Блокируем скролл страницы, но НЕ скрываем её
    document.body.style.overflow = 'hidden';
    this.style.display= 'none';
  });
  
  // Закрытие меню
  function closeMenu() {
    // Убираем active у всех элементов
    burgerMenu.classList.remove('active');
    mobileMenu.classList.remove('active');
    // Возвращаем скролл страницы
    document.body.style.overflow = '';
    burgerMenu.style.display = 'flex';
  }

  menuListBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    menuListCatalog.classList.toggle('active');
  })
  
  mobileMenuClose.addEventListener('click', closeMenu);
  
  // Закрытие меню при клике на ссылку
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
});




