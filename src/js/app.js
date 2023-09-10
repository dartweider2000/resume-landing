import { spoiler } from './modules/spoiler.js';
import { burgerMenu } from './modules/burger.js';
import { tab } from './modules/tab.js';
import { isMobile, throttle } from './modules/functions.js';
import { popup } from './modules/popup.js';
import { adaptive } from './modules/dinamicAdaptive.js';
import apiService from './weater/api.service.js';
import classConfig from './weater/class.config.js';


document.addEventListener('DOMContentLoaded', e => {
   const clickHandler = e => {
      const el = e.target;

      if(document.querySelector('.custorm-select._active') && !el.closest('.custorm-select._active')){
         document.querySelector('.custorm-select._active').classList.remove('_active');
      }

      if(el.closest('[data-scroll]')){
         const link = el.closest('[data-scroll]');
         const selector = link.dataset.scroll;
         const header = document.querySelector('.header');

         const top = document.querySelector(selector).offsetTop;
         const { height: headerHeight } = header.getBoundingClientRect();

         window.scrollTo({
            'top': top - headerHeight,
            'left': 0,
            'behavior': 'smooth'
         });
      }
   }

   // const linkElList = [...document.querySelectorAll('[data-scroll]')].map(link => ({ link, el: document.querySelector(link.dataset.scroll)}));
   // console.log(linkElList);

   // const option = {
   //    //'rootMargin': `${document.querySelector('header').offsetHeight}px`,
   //    'rootMargin': '0px',
   //    //'rootMargin': '120px',
   //    'threshold': '1.0'
   // };

   // linkElList.forEach(({link, el}) => {
   //    const callback = ([{isIntersecting}]) => {

   //       console.log(el);
   
   //       if(isIntersecting){
   //          console.log(link);
   //          link.classList.remove('_hovered');
   //       }else{
   //          link.classList.add('_hovered');
   //          //console.log(link);
   //       }
   //    }

   //    // if(el.classList.contains('full-screen'))
   //    //    console.log(el);

   //    const observer = new IntersectionObserver(callback, option);
   //    observer.observe(el);
   // });



   const mobileOrDesktop = () => {
      if(isMobile.any()){
         document.body.classList.add('_touch');
         document.addEventListener('touchstart', clickHandler);
      }else{
         document.body.classList.add('_hover');
         document.addEventListener('click', clickHandler);
      }
   }

   mobileOrDesktop();
   //document.addEventListener('mou')

   spoiler(); //Запуск спойлеров
   burgerMenu(); //Запуск бургера
   //tab(); //Запускаю табы
   //popup(); //Запуская попапы
   //adaptive() //Запускаю динамический адаптив

   [...document.querySelectorAll('.header a')].forEach(link => link.addEventListener('click', e => e.preventDefault()));

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
      windowScrollHandler();
      window.addEventListener('scroll', windowScrollHandler);

      // const callback = ([{isIntersecting}]) => !isIntersecting ? header.classList.add('_change') : header.classList.remove('_change');

      // const observer = new IntersectionObserver(callback, {
      //    'rootMargin': `-${header.offsetHeight}px`,
      //    'threshold': '1.0'
      // });

      // observer.observe(changeDirectionElement);

   };

   init();

   initSelect();

   function initSelect(){
      if(!document.querySelector('.form__select'))
         return;

      const select = document.querySelector('.form__select');
      select.hidden = true;

      const options =[...select.options];
      //console.log(options);

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
            select.value = value;
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

   const form = document.forms['form'];

   async function submitHandler(e){
      e?.preventDefault();

      const select = form.elements['select'];
      const value = select.value;

      //console.log(value);

      const {name, weather: [{ description }], main: { temp, humidity }, wind: { speed }} = await apiService.getWeather(value);

      classConfig.city.textContent = name;
      classConfig.description.textContent = `${description[0].toUpperCase()}${description.slice(1)}`;
      classConfig.humidity.textContent = `${humidity} %`;
      classConfig.temp.textContent = `${Math.round(temp)} °C`;
      classConfig.wind.textContent = `${speed} м/с`;
   }

   // document.addEventListener('DOMContentLoaded', e => {
   //    submitHandler();
   // });

   submitHandler();

   form.addEventListener('submit', throttle(submitHandler, 1000));


   // const clickHandler = e => {
   //    const el = e.target;

   //    if(document.querySelector('.custorm-select._active') && !el.closest('.custorm-select._active')){
   //       document.querySelector('.custorm-select._active').classList.remove('_active');
   //    }

   //    console.log('!');

   //    if(el.closest('[data-scroll]')){
   //       const link = el.closest('[data-scroll]');
   //       const selector = link.dataset.scroll;
   //       const header = document.querySelector('.header');

   //       const top = document.querySelector(selector).offsetTop;
   //       const { height: headerHeight } = header.getBoundingClientRect();

   //       console.log('!');

   //       window.scrollTo({
   //          'top': top - headerHeight,
   //          'left': 0,
   //          'behavior': 'smooth'
   //       });
   //    }
   // }

   // document.addEventListener('touchstart', clickHandler);

   // document.addEventListener('click', clickHandler);
});