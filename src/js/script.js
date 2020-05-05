'use strict'

const btnPopup = document.querySelector('#btnPopup');
const btnMenu = document.querySelector('#btnMenu');
const btnBack = document.querySelector('#btnBack');

const navMenu = document.querySelector('.menu');
const info = document.querySelector('.menu__info');
const header = document.querySelector('.header');
const headerLogo = header.querySelector('.header__logo');
const request = document.querySelector('.request');
const form = document.querySelector('.form');
const wrap = document.querySelector('.wrapper');
const overlay = document.querySelector('.overlay');
const popup = document.querySelector('.popup');
const btnClose = document.querySelector('.popup__btn--close');

if ( btnPopup ) {
    btnPopup.addEventListener('click', () => {
        popup.classList.remove('popup--off');
        popup.classList.remove('visually-hidden');
        overlay.classList.add('overlay--open');
        wrap.classList.add('wrapper--on');
    });
}

if ( overlay ) {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('overlay--open');
        popup.classList.add('popup--off');
        wrap.classList.remove('wrapper--on');
    });
}

if ( btnClose ) {
    btnClose.addEventListener('click', () => {
        popup.classList.add('popup--off');
        overlay.classList.remove('overlay--open');
        wrap.classList.remove('wrapper--on');
    });
}

btnBack.addEventListener('click', () => {
    popup.classList.add('popup--off');
    overlay.classList.remove('overlay--open');
    wrap.classList.remove('wrapper--on'); 
})

btnMenu.addEventListener('click', () => {
    header.classList.toggle('header--open');
    headerLogo.classList.toggle('header__logo--open');
    navMenu.classList.toggle('menu--open');
    info.classList.toggle('menu__info--open');
    btnMenu.classList.toggle('btn-menu--close');
});

if ( btnBack ){
    btnBack.addEventListener('click', () => {
        request.classList.toggle('request--off');
        form.classList.toggle('form--off');
    });
}

const title = document.querySelector('#title');
const TITLE_COORD_Y = title.offsetTop;

const getCoords = (element) => element.getBoundingClientRect().y;

window.addEventListener('scroll', () => {
   header.classList.add('header--black');

   if( getCoords(title) ==  TITLE_COORD_Y ) header.classList.remove('header--black');
});