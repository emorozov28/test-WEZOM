const CONFIGURATION = {
    productNameClass: '.products__name',
    selectDropdownClass: '.select__dropdown',
    selectsClass: '.select',
    dropdownsClass: '.select__dropdown',
    optionsClass: '.select__option',
    mobileMenuClass: '.nav__mobile',
    burgerBtnClass: '.btn-burger',
    popup: '.popup',
    popupItems: '.popup__item',
    popupBtn: '.btn-popup',
    popupCloses: '.close-popup',
    inputTel: 'input[type="tel"]',
    minFieldLength: 4,
    emailReg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    productsId: '#products',
    formClass: '.main-form',
    resetFormBtnClass: '.btn-reset',
    signForNewsBtnClass: '.btn-sign-in-news',
    signForNewsEmailClass: '#news_email'
}

let STORAGE = {
    inCart: [],
    inFavorites: [],
    inCompare: []
}
document.addEventListener("DOMContentLoaded", () => {
    let selects,
        dropdowns,
        options,
        mobileMenu,
        burgerBtn,
        popup,
        popupItems,
        popupBtn,
        popupCloses,
        products,
        form,
        btnReset,
        newsBtn,
        newsEmailField;

    function init() {
        selects = document.querySelectorAll(CONFIGURATION.selectsClass);
        dropdowns = document.querySelectorAll(CONFIGURATION.dropdownsClass);
        options = document.querySelectorAll(CONFIGURATION.optionsClass);
        mobileMenu = document.querySelector(CONFIGURATION.mobileMenuClass);
        burgerBtn = document.querySelector(CONFIGURATION.burgerBtnClass);
        popup = document.querySelector(CONFIGURATION.popup);
        popupItems = document.querySelectorAll(CONFIGURATION.popupItems);
        popupBtn = document.querySelectorAll(CONFIGURATION.popupBtn);
        popupCloses = document.querySelectorAll(CONFIGURATION.popupCloses);
        products = document.querySelector(CONFIGURATION.productsId);
        form = document.querySelector(CONFIGURATION.formClass);
        btnReset = document.querySelector(CONFIGURATION.resetFormBtnClass);
        newsBtn = document.querySelector(CONFIGURATION.signForNewsBtnClass);
        newsEmailField = document.querySelector(CONFIGURATION.signForNewsEmailClass);

        selects.forEach(select => {
            select.addEventListener('click', selectCustom);
        });

        options.forEach(option => {
            option.addEventListener('click', chooseOption);
        });

        document.addEventListener('click', event => {
            if (!event.target.closest(CONFIGURATION.selectsClass)) {
                hideDropdowns();
            }
        });

        burgerBtn.addEventListener('click', showMobileMenu);

        document.addEventListener('keyup', event => {
            if (event.key === "Escape") {
                hidePopup();
            }
        });

        popupBtn.forEach(button => {
            button.addEventListener('click', showPopup);
        });

        popup.addEventListener('click', event => {
            if (!event.target.closest('.popup__item') || event.target.closest('.close-popup')) {
                hidePopup();
            }
        });

        products.addEventListener('click', addProductsTo);

        btnReset.addEventListener('click', resetForm);

        newsEmailField.addEventListener('input', validateNewsForEmail);


        setProductNameHeight(CONFIGURATION.productNameClass);
        phoneMask(CONFIGURATION.inputTel);
        passwordValidate('input[name="user__password"]');
        emailValidate('#user__email');
        searchSite('#search-site');
        costValidate('.cost-validate');
        showTabs('.btn-tab', '.filter__tabs-item');
        getFromLocalStorage();
    }

    init();

    function getFromLocalStorage() {
        STORAGE = JSON.parse(localStorage.getItem('shopData')) || STORAGE;
    }

    function setToLocalStorage() {
        localStorage.setItem('shopData', JSON.stringify(STORAGE));
    }

    function selectCustom(e) {
        const target = e.target.tagName;
        if (target == 'UL' || target !== 'LI') {
            hideDropdowns();
        }

        this.querySelector(CONFIGURATION.selectDropdownClass).classList.toggle('active');
    }

    function chooseOption() {
        const dataValue = this.getAttribute('data-value');
        this.parentNode.parentNode.querySelector('.type').value = dataValue;
        this.parentNode.parentNode.querySelector('.select__checked').textContent = dataValue;
    }

    function hideDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    function setProductNameHeight(selector) {
        const products = document.querySelectorAll(selector);
        let max = 0;

        for (const product of products) {
            if (product.offsetHeight > max) max = product.offsetHeight;
        }

        products.forEach(element => {
            element.style.minHeight = max + 'px';
        });
    }

    function showMobileMenu() {
        mobileMenu.classList.toggle('active')
    }

    function showPopup() {
        const popupBtnAttr = this.getAttribute('data-name-popup');
        const popupName = document.querySelector(`[data-popup-name="${popupBtnAttr}"]`);
        popup.classList.add('active')
        popupName.classList.add('active')
    }

    function hidePopup() {
        popup.classList.remove('active')
        popupItems.forEach(item => {
            item.classList.remove('active')
        });
    }


    function phoneMask(selector) {
        const inp = document.querySelectorAll(selector);
        let countClick = true;
        let old = 0;

        inp.forEach(input => {
            input.addEventListener('click', function () {
                if (countClick === true) {
                    input.value = "+38(0";
                    countClick = false;
                }
            });
            input.addEventListener('input', function () {
                this.value.length < 6 ? this.value = '+38(0' : null;
                this.value = this.value.replace(/[a-zA-Z]/g, '');

                let curLen = this.value.length;

                if (curLen < old) {
                    old--;
                    return;
                }

                if (curLen == 7)
                    this.value = this.value + ') ';

                if (curLen == 12)
                    this.value = this.value + '-';

                if (curLen == 15)
                    this.value = this.value + '-';

                if (curLen > 18)
                    this.value = this.value.substring(0, this.value.length - 1);

                old++;
            });

        });
    }

    function passwordValidate(selector) {
        const inputPassword = document.querySelector(selector);
        inputPassword.addEventListener('input', validateForm);
    }

    function validateFieldLength(select) {
        const field = select ? document.querySelector(select) : this;
        return field && field.value.length >= CONFIGURATION.minFieldLength ? true : false;
    }

    function validateEmail(select) {
        const field = select ? document.querySelector(select) : this;
        return CONFIGURATION.emailReg.test(field.value);
    }

    function validateForm() {
        const formBtn = document.querySelector('.btn-login');

        if (validateFieldLength('#user__password') && validateEmail('#user__email')) {
            formBtn.classList.add('btn-orange');
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.classList.remove('btn-orange');
            formBtn.setAttribute('disabled', 'disabled');
        }
    }

    function validateNewsForEmail() {

        if (validateEmail('#news_email')) {
            newsBtn.classList.add('btn-orange');
            newsBtn.classList.remove('btn-gray');
            newsBtn.removeAttribute('disabled');
        } else {
            newsBtn.classList.remove('btn-orange');
            newsBtn.classList.add('btn-gray');
            newsBtn.setAttribute('disabled', 'disabled');
        }
    }

    function emailValidate(selector) {
        const inputEmail = document.querySelector(selector);
        inputEmail.addEventListener('input', validateForm);
    }

    function validateNewsFeedEmail(selector) {
        const inputEmail = document.querySelector(selector);
        inputEmail.addEventListener('input', validateEmail);
    }

    function searchSite(selector) {
        const search = document.querySelector(selector);
        const searchBtn = document.querySelector('.btn-search');

        search.addEventListener('input', function () {
            if (this.value.length > 1) {
                searchBtn.classList.add('btn-orange');
                searchBtn.classList.remove('btn-gray');
                searchBtn.removeAttribute('disabled');
            } else {
                searchBtn.classList.remove('btn-orange');
                searchBtn.classList.add('btn-gray');
                searchBtn.setAttribute('disabled', 'disabled');
            }
        });
    }

    function numberValidate(selector) {
        document.querySelectorAll(selector).forEach(number => {
            number.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '');
            });
        });
    }

    function costValidate(selector) {
        numberValidate(selector);

        document.querySelectorAll(selector).forEach(cost => {

            cost.addEventListener('input', function () {
                this.value < 0 ? this.value = 0 : null;
            });
            cost.addEventListener('focus', function () {
                cost.parentNode.classList.add('active');
            });
            cost.addEventListener('blur', function () {
                cost.parentNode.classList.remove('active');
            });

        });
    }

    function showTabs(selector, selectorTab) {
        const selectors = document.querySelectorAll(selector);
        const selectorTabs = document.querySelectorAll(selectorTab);

        selectors.forEach(selector => {
            selector.addEventListener('click', showTab);
        });

        selectorTabs.forEach(selector => {
            selector.classList.add('hide')
        });

        selectors[0].classList.add('active');
        selectorTabs[0].classList.remove('hide')

        function showTab(event) {
            event.preventDefault();
            selectors.forEach(selector => {
                selector.classList.remove('active')
            });
            selectorTabs.forEach(selector => {
                selector.classList.add('hide')
            });

            this.classList.add('active')
            const dataTab = this.getAttribute('data-tab');
            const tabIndex = document.querySelector(`${selectorTab}[data-tab-index="${dataTab}"]`);

            tabIndex.classList.remove('hide');
        }
    }

    function addProductsTo(event) {
        event.preventDefault();
        const addToFavorites = event.target.closest('.products__favorites');
        const addToCompare = event.target.closest('.products__compare');
        const addToCart = event.target.closest('.btn-buy');

        const btnFavorites = document.querySelector('.actions__btn.favorites');
        const btnCompare = document.querySelector('.actions__btn.comparison');
        const btnCart = document.querySelector('.actions__btn.basket');
        const productId = event.target.closest('div[data-product-id]') ? event.target.closest('div[data-product-id]').getAttribute('data-product-id') : null;

        if (addToFavorites) {
            if (STORAGE.inFavorites.includes(productId)) {
                deleteFromStorage(STORAGE.inFavorites, productId);
                updateActionQuantities(STORAGE.inFavorites, productId, event, '.products__favorites a', 'В избранное', btnFavorites);
            } else {
                addToStorage(STORAGE.inFavorites, productId);
                updateActionQuantities(STORAGE.inFavorites, productId, event, '.products__favorites a', 'В избранном', btnFavorites);
            }
        }
        if (addToCompare) {
            if (STORAGE.inCompare.includes(productId)) {
                deleteFromStorage(STORAGE.inCompare, productId);
                updateActionQuantities(STORAGE.inCompare, productId, event, '.products__compare a', 'Сравнить товар', btnCompare);
            } else {
                addToStorage(STORAGE.inCompare, productId);
                updateActionQuantities(STORAGE.inCompare, productId, event, '.products__compare a', 'В сравнении', btnCompare);
            }
        }
        if (addToCart) {
            if (STORAGE.inCart.includes(productId)) {
                deleteFromStorage(STORAGE.inCart, productId);
                updateActionQuantities(STORAGE.inCart, productId, event, '.btn-buy', 'Купить товар', btnCart);
            } else {
                addToStorage(STORAGE.inCart, productId);
                updateActionQuantities(STORAGE.inCart, productId, event, '.btn-buy', 'Товар в корзине', btnCart);
            }
        }

        setToLocalStorage();
    }

    function deleteFromStorage(list, productId) {
        const index = list.indexOf(productId);
        if (index > -1) {
            list.splice(index, 1);
        }
    }

    function addToStorage(list, productId) {
        list.push(productId);
    }

    function updateActionQuantities(list, productId, event, targetClass, text, targetButton) {
        event.target.closest(targetClass).textContent = text;
        manageAction(targetButton, list.length);
    }

    function manageAction(targetQuantityContainer, size) {
        let buttonCompare = targetQuantityContainer.querySelector('span');
        if (size > 0) {
            const actionCounter = document.createElement('span');
            actionCounter.classList.add('actions__counter');
            actionCounter.innerText = size;
            if (buttonCompare) {
                buttonCompare.replaceWith(actionCounter);
            } else {
                targetQuantityContainer.insertAdjacentElement('beforeend', actionCounter);
            }
        } else {
            buttonCompare = targetQuantityContainer.querySelector('span');
            buttonCompare.replaceWith('');
        }
    }

    function resetForm() {
        form.reset();
        selects.forEach(select => {
            let defaultValue = select.querySelector('.select__option').getAttribute('data-value');
            select.querySelector('.select__checked').innerText = defaultValue;
            select.querySelector('.type').value = defaultValue;
        });
    }
});