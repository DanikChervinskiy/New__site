
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxggQA646tiHDFraCs6j5lG2N8SxEb2OskMfdqH2TQ4a1XH70UuCu12oPrCOvqiYtlH/exec'
    const form = document.forms['submit-to-google-sheet']
  
    form.addEventListener('submit', e => {
      e.preventDefault()
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message))
    })

// ===== БУРГЕР ==================================================================================

const iconMenu = document.querySelector('.menu__icon');
if (iconMenu){
    
    iconMenu.addEventListener("click", function(e) {
        menuClose();
    });
}

function menuClose() {
    const menuBody = document.querySelector('.menu__body');
    iconMenu.classList.toggle('_active');
    document.body.classList.toggle('_lock');
    menuBody.classList.toggle('_active');
}

const menuLinkAll = document.querySelectorAll('.menu__link');

if(menuLinkAll.length > 0){
    menuLinkAll.forEach(menuLink => {
        menuLink.addEventListener('click', () => {
            menuClose();
        })
    });
}

const header = document.querySelector('.header');

if (header) {

    let prevScrollpos = window.pageYOffset;
    const headerHeight = header.clientHeight;

    document.addEventListener('scroll', () => {
        let currentScrollPos = window.pageYOffset;

        if (currentScrollPos > 0) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });

}

// ОТКРЫТИЕ И ЗАКРЫТИЕ ФИЛЬТРА/МЕНЮ

const openBtn = document.querySelectorAll('[data-open]');

if (openBtn.length > 0) {

    openBtn.forEach(element => {
        element.addEventListener('click', () => {

            let openBodyId = element.getAttribute('data-open');
            let openBody = document.getElementById(openBodyId);
            let openBodyClass = '.' + openBody.classList[0];


            openBody.classList.add('active');

            if (openBody.classList.contains('burger-body')) {
                if (header) {
                    header.classList.add('fixed-two');
                }
            }
            bodyFixPosition();

            document.addEventListener('click', function (e) {
                if (!e.target.closest('[data-open]')) {
                    if (!e.target.closest(openBodyClass)) {
                        bodyClose(openBody);
                    }
                }
            });

            let closeBody = openBody.querySelector('.close-body')
            closeBody.addEventListener('click', () => {
                bodyClose(openBody);
            });
        });
    });

    function bodyClose(openBody) {
        openBody.classList.remove('active');
        bodyUnfixPosition();

        if (openBody.classList.contains('burger-body')) {
            header.classList.remove('fixed-two');
        }
    }
    // Закрытие по нажатию на li

    let navigationLi = document.querySelectorAll('.navigation li');

    if (navigationLi.length > 0) {
        navigationLi.forEach(navigationLiItem => {
            navigationLiItem.addEventListener('click', () => {

                let burgerBoduClose = document.querySelector('.menu__body');
                burgerBoduClose.classList.remove('active');
                bodyUnfixPosition();

            });
        });
    }

}



// ПЛАВНАЯ ПРОКРУТКА 

// Пример для подключения:
// <li data-scroll="trigers,100,10,0"> Кнопка нажав на которую прокрутится страница </li>
// trigers - id блока, к которому прокручиваем страницу
// 100 - скорость прокрутки
// 10 - шаг прокрутки, в пикселях
// 0 - отступ к блоку, в пикселях


const scrollings = document.querySelectorAll('[data-scroll]');


if (scrollings.length > 0) {
    let scrolled;
    let timer;

    let scrollPageYOffset;
    let curentScrollTop;
    let scrollingSpeed = 60;
    let scrollingTime = 10;
    let scrollingIndent = 0;


    scrollings.forEach((item,) => {
        item.addEventListener('click', () => {
            bodyUnfixPosition();
            // menuClose();

            const scrollingObj = item.getAttribute('data-scroll').split(',');
            const scrollingName = scrollingObj[0];
            if (scrollingObj[1] != undefined && scrollingObj[1] != '') {
                scrollingSpeed = Number(scrollingObj[1]);
            }
            if (scrollingObj[2] != undefined && scrollingObj[2] != '') {
                scrollingTime = Number(scrollingObj[2]);
            }
            if (scrollingObj[3] != undefined && scrollingObj[3] != '') {
                scrollingIndent = Number(scrollingObj[3]);
            }
            activScroll(scrollingName);
        });
    });




    const activScroll = (Name) => {
        const curentScroll = document.getElementById(Name);
        curentScrollTop = offset(curentScroll);
        curentScrollTop = curentScrollTop - scrollingIndent;

        scrollPageYOffset = window.pageYOffset;

        if (scrollPageYOffset < curentScrollTop) {
            scrollDown(curentScroll);
        } else {
            scrollToop(curentScroll);
        }
    }

    function scrollDown(curentScroll) {
        if (scrollPageYOffset < curentScrollTop) {

            scrollPageYOffset = scrollPageYOffset + scrollingSpeed; //100 - скорость прокрутки
            window.scrollTo(0, scrollPageYOffset);
            timer = setTimeout(scrollDown, scrollingTime);
        } else {
            clearTimeout(timer);

        }
    }
    function scrollToop(curentScroll) {
        if (scrollPageYOffset > curentScrollTop) {

            window.scrollTo(0, scrollPageYOffset);
            scrollPageYOffset = scrollPageYOffset - scrollingSpeed; //100 - скорость прокрутки
            timer = setTimeout(scrollToop, scrollingTime);
        } else {
            clearTimeout(timer);
        }
    }

    function offset(el) {
        const rect = el.getBoundingClientRect(),
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return (rect.top + scrollTop)
    }

}








// ЗАПРЕТ СКРОЛА

// 1. Фиксация <body>
function bodyFixPosition() {

    setTimeout(function () {
        /* Ставим необходимую задержку, чтобы не было «конфликта» в случае, если функция фиксации вызывается сразу после расфиксации (расфиксация отменяет действия расфиксации из-за одновременного действия) */

        if (!document.body.hasAttribute('data-body-scroll-fix')) {

            // Получаем позицию прокрутки
            let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

            // Ставим нужные стили
            document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = '-' + scrollPosition + 'px';
            document.body.style.left = '0';
            document.body.style.width = '100%';


        }

    }, 15); /* Можно задержку ещё меньше, но у меня работало хорошо именно с этим значением на всех устройствах и браузерах */

}
// 2. Расфиксация <body>
function bodyUnfixPosition() {

    if (document.body.hasAttribute('data-body-scroll-fix')) {
        // Получаем позицию прокрутки из атрибута
        let scrollPosition = document.body.getAttribute('data-body-scroll-fix');

        // Удаляем атрибут
        document.body.removeAttribute('data-body-scroll-fix');

        // Удаляем ненужные стили
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';

        // Прокручиваем страницу на полученное из атрибута значение
        window.scroll(0, scrollPosition);

    }

}


    
// Ссылка делается через тег "a"
// Элемент, при клике на который открывается попап должен иметь класс 'popup-link'
// В href нужно записать id нужного попапа, например '#popup' или '#popup_2'
// Самому попапу нужно написать уникальный id
// HTMl код снизу должен быть в оболочке "wrapper"

// Пример HTML

/* <div id="popup" class="popup">
        <div class="popup__body">
            <div class="popup__content">
                <a href="#" class="popup__close cross close-popup"></a>
                <div class="popup__title">Это попап</div>
                <div class="popup__text">Lorem ipsum dolor sit amet</div>
            </div>
        </div>
    </div> */

    
// ЗАПРЕТ СКРОЛА

    // 1. Фиксация <body>
    function bodyFixPosition() {

        setTimeout(function () {
            /* Ставим необходимую задержку, чтобы не было «конфликта» в случае, если функция фиксации вызывается сразу после расфиксации (расфиксация отменяет действия расфиксации из-за одновременного действия) */

            if (!document.body.hasAttribute('data-body-scroll-fix')) {

                // Получаем позицию прокрутки
                let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

                // Ставим нужные стили
                document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = '-' + scrollPosition + 'px';
                document.body.style.left = '0';
                document.body.style.width = '100%';


            }

        }, 15); /* Можно задержку ещё меньше, но у меня работало хорошо именно с этим значением на всех устройствах и браузерах */

    }
    // 2. Расфиксация <body>
    function bodyUnfixPosition() {

        if (document.body.hasAttribute('data-body-scroll-fix')) {
            // Получаем позицию прокрутки из атрибута
            let scrollPosition = document.body.getAttribute('data-body-scroll-fix');

            // Удаляем атрибут
            document.body.removeAttribute('data-body-scroll-fix');

            // Удаляем ненужные стили
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.width = '';

            // Прокручиваем страницу на полученное из атрибута значение
            window.scroll(0, scrollPosition);

        }

    }


// ==================================================================
    
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 300;

if(popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    }
}

function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        bodyFixPosition();
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}
function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        bodyUnfixPosition();
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
    if (lockPadding.length > 0){
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});

(function () {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector;
    }
})();

const dataSelectAll = document.querySelectorAll('[data-select]');

if(dataSelectAll.length > 0){
    dataSelectAll.forEach(dataSelect => {
        dataSelect.addEventListener('click', () => {
            

            const curentPopup = document.getElementById('popup');
            popupOpen(curentPopup);
            let  dataSelectAttr = dataSelect.getAttribute('data-select');

            let selectItem = document.getElementById('select-courses');
            selectItem.value = dataSelectAttr;

            console.log(selectItem);
        })
    });
}
