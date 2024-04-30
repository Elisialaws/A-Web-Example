(function() {//创建一个匿名函数，并立即执行它
  

  /**
   * 选择一个还是全部元素
   */
  const select = (el, all = false) => {
    el = el.trim()//去除两段空白字符
    if (all) {
      return [...document.querySelectorAll(el)]//扩展运算符,将一个类数组转化为一个数组
    } else {//将一个可迭代对象（如数组、字符串等）展开为另一个可迭代对象的语法。
      return document.querySelector(el)
    }
  }
  
  /**
   * 为事件增添事件监听器
   */
  const onEvent = (type, element, listener, all = false) => {
    let selectEl = select(element, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }
  
  /**
   *滚动事件监听器
   */
  const onscroll = (element, listener) => {
    element.addEventListener('scroll', listener)
  }

  const scrollto = (element) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(element).offsetTop
    window.scrollTo({
      top: elementPos -offset, //平滑滚动到指定offset位置
      behavior: 'smooth'
    })
  }

  /**
   * 回到顶部按钮
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const goBackTop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', goBackTop)
    onscroll(document, goBackTop)
  }

  /**
   * 为 .scrollto添加事件
   */
  onEvent('click', '.scrollto', function(event) {
    if (select(this.hash)) {
      event.preventDefault()

      let navbar = select('#navbar')//toggle方法如果有就移除，否则添加
     
      scrollto(this.hash)
    }
  }, true)

  /**
   *页面加载
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {//hash在不重新加载整个页面的情况下更新页面内容
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * 预加载
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }
  /**
   * 在用户滚动到页面中的技能内容区域时触发动画
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({//是一个监测元素进入或离开视窗的库
      element: skilsContent,
      offset: '60%',
      handler: function(direction) {//处理的实例函数
        let progress = select('.progress .progress-bar', true);
        progress.forEach((element) => {
          element.style.width = element.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }


/**
 * 滑动轮播组件
 */
  new Swiper('.testimonials-slider', {//
    speed: 600,//切换速度
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction:false//交互时不会停止
    },
    slidesPerView: 'auto',
    pagination: {//分页器选项
      el: '.swiper-pagination',
      type: 'bullets',//分页器的类型为圆点
      clickable: true
    }
  });

  /**
   * 为页面滚动添加动画效果
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,//持续时间
      easing: "ease-in-out",
      once: true,//只触发一次
      mirror: false//
    });
  });

})()
/**
 * 回到顶部
 */
let backToTopButton=document.querySelector('#back-to-top-button');
backToTopButton.addEventListener('click',function(){
  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
});
/**
 * 提交表单显示提交的内容
 */
let submitForm=document.querySelector('.email-form')
submitForm.addEventListener('submit',function(event){
  event.preventDefault();
  let Name=document.querySelector('#name').value;
  let Email=document.querySelector('#email').value;
  let Phone=document.querySelector('#telephone').value;//获取值
  let result = confirm(`name: ${Name}\nemail: ${Email}\nphone: ${Phone}`);
  if(result){
    alert("Action confirmed");
  }
  else{
    alert("Action canceled");
  }
});