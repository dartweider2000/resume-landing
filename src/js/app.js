import { spoiler } from './modules/spoiler.js';
import { burgerMenu } from './modules/burger.js';
import { tab } from './modules/tab.js';
import { isMobile } from './modules/functions.js';
import { popup } from './modules/popup.js';
import { adaptive } from './modules/dinamicAdaptive.js';


const mobileOrDesktop = () => {
   if(isMobile.any()){
      document.body.classList.add('_touch');
   }else{
      document.body.classList.add('_hover');
   }
}

mobileOrDesktop();
//document.addEventListener('mou')

spoiler(); //Запуск спойлеров
burgerMenu(); //Запуск бургера
//tab(); //Запускаю табы
//popup(); //Запуская попапы
//adaptive() //Запускаю динамический адаптив

[...document.links].forEach(link => link.addEventListener('click', e => e.preventDefault()));

const scrolIsUp = () => {
   let scroll = scrollY;
   const check = () => {
      let scrollNow = scrollY;
      let delta = scroll - scrollNow;
      scroll = scrollNow;
      return delta > 0;
   }
   return check;
};

// const scr = scrolIsUp();

// document.addEventListener('scroll', () => console.log(scr()));

const init = () => {
   if(!document.querySelector('[data-header-change]'))
      return;

   const header = document.querySelector('[data-header-change]');
   const headerStartChangeSelector = header.dataset.headerChange;
   const changeDirectionElement = document.querySelector(headerStartChangeSelector);
   let changeStart = changeDirectionElement.offsetTop;
   const scroll = scrolIsUp();
   const windowScrollHandler = () => {
      const scrollValue = scroll();
      if(!scrollValue){
         if(scrollY + header.offsetHeight >= changeStart){
            header.classList.add('_change');
         }
      }else if(scrollValue){
         if(scrollY + header.offsetHeight < changeStart){
            header.classList.remove('_change');
         }
      }
      changeStart = changeDirectionElement.offsetTop;
   };
   window.addEventListener('scroll', windowScrollHandler);
};

init();

initSelect();

function initSelect(){
   if(!document.querySelector('.form__select'))
      return;

   const select = document.querySelector('.form__select');
   select.hidden = true;

   const options =[...select.options];
   console.log(options);

   const {optionList, selected} = options.reduce((result, option) => {
      const data = {
         'value': option.value,
         'text': option.textContent
      };

      result.optionList.push(data);

      if(option.selected)
         result.selected = data;

      return result;
   }, {'optionList': [], 'selected': {}});

   const bodyHTML = optionList.map(option => getOptionHTML(option));
   const customSelectHTML = getCustomSelectHTML(selected, bodyHTML);
   select.parentElement.insertAdjacentHTML('afterbegin', customSelectHTML);

   const customSelect = select.parentElement.firstElementChild;

   customSelect.addEventListener('click', e => {
      const el = e.target;

      if(el.closest('.custorm-select__line')){

         customSelect.classList.toggle('_active');
      }

      if(el.closest('.custorm-select__option')){

         const option = el.closest('.custorm-select__option');

         const value = option.dataset.value;
         const text = option.textContent;

         const line = customSelect.firstElementChild;
         line.dataset.value = value;
         line.querySelector('span').textContent = text;

         customSelect.classList.toggle('_active');
      }
   });
}

function getCustomSelectHTML(selected, bodyHTML){
   return `<div class="custorm-select">
      <div data-value="${selected.value}" class="custorm-select__line">
         <span>${selected.text}</span>
         <i class='custorm-select__arrow bx bx-chevron-down'></i>
      </div>
      <div class="custorm-select__body">${bodyHTML.join('')}</div>
   </div>`;
}

function getOptionHTML(option){
   return `<div data-value="${option.value}" class="custorm-select__option">${option.text}</div>`;
}

document.addEventListener('click', e => {
   const el = e.target;

   if(document.querySelector('.custorm-select._active') && !el.closest('.custorm-select._active')){
      document.querySelector('.custorm-select._active').classList.remove('_active');
   }
});