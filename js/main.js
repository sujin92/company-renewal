// 네비 바 (scroll)
let isOpen = false;
let isTop = false;

document.addEventListener("DOMContentLoaded", function () {
  SetEvent();
  SetUI();
  window.onkeydown = function () {
    var kcode = event.keyCode;
    let id = "";
    if (location.href.indexOf("loadPage") === -1) {
      if (kcode == 116 || (event.ctrlKey == true && (kcode == 78 || kcode == 82))) {
        id = location.href.split("?id=")[1];
        if (!isTop) {
          if (id.indexOf("&") != -1) {
            id = id.split("&")[0];
          }
        }

        history.replaceState({}, null, location.pathname + "?id=" + id);
      }
    }
  };
});

function SetUI() {
  if (location.href.indexOf("&top=y") !== -1) {
    isTop = true;
    document.querySelector(".innerHeader").classList.add("on");
    document.querySelectorAll(".innerHeader .gnb > li > div nav .inner").forEach(function(item) {
      item.classList.add("on");
    });
    document.querySelector("#logoChange").src = "/images/logo.png";

    let textChanges = document.querySelectorAll(".textChange");
    for (let i = 0; i < textChanges.length; i++) {
      let textChange = textChanges[i];
      textChange.style.color = "#333333";
    }
  }
}

window.onpopstate = function(event) {
  SetUI();
}

function SetEvent() {
  const innerHeader = document.querySelectorAll(".innerHeader");
  innerHeader.forEach(header => {
    header.addEventListener("mouseover", header_on);
    header.addEventListener("mouseout", header_off);
  });

  if (document.querySelector(".innerHeader:hover")) {
    header_on();
  }
}

function header_on() {
  isTop = true;

  const innerHeaders = document.querySelectorAll(".innerHeader");
  innerHeaders.forEach(header => {
    header.classList.add("on");
    const innerDivs = header.querySelectorAll(".gnb > li > div nav .inner");
    innerDivs.forEach(div => div.classList.add("on"));
  });

  document.getElementById("logoChange").src = "/images/logo.png";

  const textChanges = document.getElementsByClassName("textChange");
  for (let i = 0; i < textChanges.length; i++) {
    let textChange = textChanges.item(i);
    textChange.style.color = "#333333";
  }
}

function header_off() {
  isTop = false;

  const sideMenu = document.querySelector(".side_menu");
  if (!sideMenu.classList.contains("active")) {
    const innerHeaders = document.querySelectorAll(".innerHeader");
    innerHeaders.forEach(header => {
      header.classList.remove("on");
      const innerDivs = header.querySelectorAll(".gnb > li > .inner");
      innerDivs.forEach(div => div.classList.remove("on"));
    });

    const header = document.querySelector("header");
    if (!header.classList.contains("activated")) {
      document.getElementById("logoChange").src = "/images/logo_white.png";

      const textChanges = document.getElementsByClassName("textChange");
      for (let i = 0; i < textChanges.length; i++) {
        let textChange = textChanges.item(i);
        textChange.style.color = "#ffffff";
      }
    }
  }
}

const scrollPage = (event) => {
  event.preventDefault();
  let delta = 0;

  if (!event) event = window.event;
  if (event.wheelDelta) {
    delta = event.wheelDelta / 120;
    if (window.opera) delta = -delta;
  } else if (event.detail) delta = -event.detail / 3;

  let moveTop = window.scrollY;
  let elmSelector = document.querySelector(".slider");

  let header_height = document.querySelector("header").offsetHeight;

  if (delta < 0) {
    if (elmSelector !== 0) {
      try {
        moveTop = window.pageYOffset + elmSelector.nextElementSibling.getBoundingClientRect().top - header_height - 20;
      } catch (e) {}
    }
  }
  const body = document.querySelector("html");
  window.scrollTo({ top: moveTop, left: 0, behavior: "smooth" });
  document.querySelector(".slider").removeEventListener("mousewheel", scrollPage);
}

window.addEventListener('scroll', function() {
  let navbar = window.scrollY;
  let header = document.querySelector('header');
  let logo = document.getElementById('logoChange');
  let textChanges = document.getElementsByClassName('textChange');

  if (navbar > 100) {
    header.classList.add('activated');
    logo.src = '/images/logo.png';
    for (let i = 0; i < textChanges.length; i++) {
      let textChange = textChanges[i];
      textChange.style.color = '#333333';
    }
  } else {
    header.classList.remove('activated');
    if (!document.querySelector('.innerHeader').classList.contains('on')) {
      logo.src = '/images/logo_white.png';
      for (let i = 0; i < textChanges.length; i++) {
        let textChange = textChanges[i];
        textChange.style.color = '#ffffff';
      }
    }
  }
});

// business 이동
// window.onload = function () {
//   const target = document.querySelector(".slider");

//   target.addEventListener("mousewheel", scrollPage);
// };

// 퀵메뉴
$(document).ready(function () {
  let currentPosition = parseInt($(".quickmenu").css("top"));
  $(window).scroll(function () {
    let position = $(window).scrollTop();
    $(".quickmenu")
      .stop()
      .animate({ top: position + currentPosition + "px" }, 50);
  });
  const topMove = document.querySelector(".top").offsetHeight;

  goToSection2 = () => {
    window.scrollTo({ top: topMove, behavior: "smooth" });
  };

  const quickMenu = document.querySelector(".quickmenu");

  window.addEventListener(
    "scroll",
    _.throttle(function () {
      // console.log(window.scrollY);
      if (window.scrollY > 500) {
        quickMenu.style.display = "block";
      } else {
        quickMenu.style.display = "none";
      }
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        quickMenu.style.display = "block";
      }
    }, 300)
  );
});

// 전체메뉴
const acoAco = document.querySelectorAll(".side_gnb li a");

function sideMenu() {
  const menu = document.querySelector(".menu");
  const side_menu = document.querySelector(".side_menu");
  menu.classList.toggle("active");
  side_menu.classList.toggle("active");

  isOpen = !isOpen;

  if (isOpen) {
    document.querySelector("header").removeEventListener("mouseleave", scrollPage);
  } else {
    document.querySelector("header").addEventListener("mouseleave", scrollPage);
  }
  document.body.style.overflow = "hidden";
  
  // 스크롤
  if (window.innerWidth < 581) {
    if (menu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "overlay";
      acoAco.forEach((el) => {
        el.classList.remove("active");
      });
      document.querySelectorAll(".side_inner").forEach((el) => {
        el.style.display = "none";
      });
    }
  }
}

$(function () {
  let windowWidth = $(window).width();
  if (windowWidth < 580) {
    const acoAco = $(".side_gnb li a");

    acoAco.on("click", function () {
      const item = $(this);
      let speed = 300;

      acoAco.parent().find(".side_inner").stop().slideUp(speed);
      if (item.hasClass("active")) {
        item.find(".side_inner").stop().slideUp(speed);
        item.removeClass("active");
      } else {
        item.parent().find(".side_inner").stop().slideDown(speed);
        acoAco.removeClass("active");
        item.addClass("active");
      }
    });
  }
});

//메인 이미지슬라이드
$(function () {
  if ($(".visual").length != 0) {
    $(".visual").slick({
      arrows: true,
      dots: true,
      fade: true,
      autoplay: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      autoplaySpeed: 2800,
      prevArrow: "<i class='prev-arrow fa-solid fa-chevron-left'></i>",
      nextArrow: "<i class='next-arrow fa-solid fa-chevron-right'></i>",
      customPaging: function (slider, i) {
        var tit = $(slider.$slides[i]).find(".dot").html();
        return '<div class="pager-tit" class= "+ i +">' + tit + "</div>";
      },
    });
  }
});

//이미지슬라이드- 넓이 높이 스크립트
document.addEventListener("DOMContentLoaded", function() {
  let winW = window.innerWidth;
  let winH = window.innerHeight;

  const list = document.querySelectorAll(".visual .list");
  for (let i = 0; i < list.length; i++) {
    list[i].style.width = winW + "px";
  }
});

$(function () {
  let winW = $(window).width();
  let winH = window.innerHeight;
  let isMobile = winW < 580;

  if (isMobile) {
    list = $(".visual .list");
    for (let i = 0; i < list.length; i++) {
      list[i].style.height = winH + "px";
    }
  }
});

// 섹션 에니메이션
$(function () {
  let windowWidth = $(window).width();
  if (windowWidth < 600) {
    $(window).scroll(function () {
      let sct = $(this).scrollTop();

      $("section").each(function () {
        let sectionOST = $(this).offset().top - 900;
        let sectionEffect = $(this).attr("data-effect");
        if (sct >= sectionOST) {
          $(this).addClass(sectionEffect);
        }
      });
    });
  } else {
    $(window).scroll(function () {
      let sct = $(this).scrollTop();

      $("section").each(function () {
        let sectionOST = $(this).offset().top - 800;
        let sectionEffect = $(this).attr("data-effect");
        if (sct >= sectionOST) {
          $(this).addClass(sectionEffect);
        }
      });
    });
  }
});

//businessPage 슬라이드
$(function () {
  if ($(".business").length != 0) {
    $(".business").slick({
      arrows: true,
      dots: true,
      fade: true,
      autoplay: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      autoplaySpeed: 2800,
      prevArrow: "<i class='prev-arrow fa-solid fa-chevron-left'></i>",
      nextArrow: "<i class='next-arrow fa-solid fa-chevron-right'></i>",
      customPaging: function (slider, i) {
        var tit = $(slider.$slides[i]).find(".dot").html();
        return '<div class="pager-tit" class= "+ i +">' + tit + "</div>";
      },
    });
  }
});

$(function () {
  let winW = $(window).width();
  //let winH = $(window).height();
  let winH = window.innerHeight;

  list = $(".business .list_2");
  list.css({ width: winW + "px", height: winH + "px" });
});

// 카운터
$(function () {
  if ($(".count").length != 0) {
    $(".count").counterUp({
      delay: 10,
      time: 1000,
    });
  }
});

// 탭 슬라이드
$(function () {
  if ($(".swiper-container2").length != 0) {
    let swiper = new Swiper(".swiper-container2", {
      slidesPerView: 4,
      spaceBetween: 24,
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },
      autoplay: {
        delay: 2000,
      },
      breakpoints: {
        200: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        300: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        400: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        500: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        600: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        960: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });

    // 제품 탭 메뉴
    let movBtn = $(".product_title > ul > li");
    let movCont = $(".product_chart > div");

    movCont.hide().eq(0).show();

    movBtn.click(function (e) {
      e.preventDefault();
      var target = $(this);
      var index = target.index();
      movBtn.removeClass("active");
      target.addClass("active");
      movCont.css("display", "none");
      movCont.eq(index).css("display", "block");
    });
  }
});
