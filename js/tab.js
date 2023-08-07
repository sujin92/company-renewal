let tablist = []
let tabIndex = -1
let linkerror  = null

document.addEventListener("DOMContentLoaded", function() {
  const excludedPages = ['loadPage', 'modifyPage', 'centerPageModifyPage', 'technologyModifyPage'];
  const url = window.location.href;
  const shouldRun = excludedPages.every(page => url.indexOf(page) === -1);

  if (shouldRun) {
    let word = document.querySelector("." + new URLSearchParams(location.search).get("id"));
    if (word !== null) {
      word.classList.add("active");
      let menuName = word.ownerDocument.defaultView.location.href.split("?")[1].split("=")[1];
      loadtab(menuName);
    }
  }
});

if (window.innerWidth > 640) {
  window.onpopstate = function(event) {  
    if (tabIndex !== 0 && tabIndex !== -1) {
      backTab(tablist[tabIndex-1]);
      tabIndex-- 
    }
    else {
      history.back()
    }
  }
} else {
  window.onpopstate = function(event) {  
    const menu = document.querySelector(".menu");
    const side_menu = document.querySelector(".side_menu");
    menu.classList.remove("active");
    side_menu.classList.remove("active");
    if (tabIndex !== 0 && tabIndex !== -1) {
      tabIndex-- 
    }
  }
}
// 뒤로가기
window.addEventListener('pageshow', function(event) {
  let historyTraversal = 
    event.persisted || 
    (typeof window.performance != 'undefined' && 
    window.performance.navigation.type === 2);
  if (historyTraversal) {
    window.location.reload();
  }
});

function backTab(menuName) {
  // console.log(menuName)
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuName).style.display = "block";
  document.querySelector("." + menuName).classList.add("active");

  history.pushState(null, null, '?id=' + menuName);
  if (window.location.href.indexOf('technologyPage') !== -1 || window.location.href.indexOf('communityPage') !== -1 || window.location.href.indexOf('centerPage') !== -1) {
    renderDatas();
  }  
}

function loadtab(menuName) {
  tablist.push(menuName);
  tabIndex++
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuName).style.display = "block";
  document.querySelector("." + menuName).classList.add("active");

  history.pushState(null, null, '?id=' + menuName);

  if (window.location.href.indexOf('technologyPage') !== -1 || window.location.href.indexOf('communityPage') !== -1 || window.location.href.indexOf('centerPage') !== -1) {
    renderDatas();
  }  
}

function opentab(evt, menuName) {
  tablist.push(menuName);
  tabIndex++
  let i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuName).style.display = "block";
  evt.currentTarget.className += " active";

  history.pushState(null, null, '?id=' + menuName);

  // console.log(menuName)
  if (window.location.href.indexOf('technologyPage') !== -1 || window.location.href.indexOf('communityPage') !== -1 || window.location.href.indexOf('centerPage') !== -1) {
    renderDatas();
  }  
}

window.onload = function () {
  firstTab();
};

function firstTab() {
  let id = location.href.split("?id=")[1];
  id = id ? id.split("&")[0] : "default-tab";
  if (id.indexOf("&top") != -1) {
    id = id.split("&")[0];
  }
  let tab = document.getElementById(id);
  if (tab) {
    tab.style.display = "block";
  }
}

// mobile
function myFunction() {
  document.getElementById("menuDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}