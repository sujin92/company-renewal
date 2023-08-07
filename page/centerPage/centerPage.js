let pages = [];
let currentPage = 0;
let id = '';

document.addEventListener('DOMContentLoaded', function() {
  sessionStorage.setItem('password', null);
  let current_tab = window.location.href.split("?")[1].split('id=')[1];
  if (current_tab === 'inquiry') {
    document.querySelector('.dropbtn').textContent = '문의하기';
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-caret-down');
    document.querySelector('.dropbtn').appendChild(icon);
  }
  else if (current_tab === 'notice') {
    document.querySelector('.dropbtn').textContent = '공지사항';
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-caret-down');
    document.querySelector('.dropbtn').appendChild(icon);
  }
  else if (current_tab === 'faq') {
    document.querySelector('.dropbtn').textContent = 'FAQ';
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-caret-down');
    document.querySelector('.dropbtn').appendChild(icon);
  }
});


const renderDatas = async () => {
  // console.log("load");
  const queries = window.location.search.split("?")[1].split("&");
  // console.log(queries);
  id = queries.filter((e) => e.indexOf("id") !== -1)[0].split("=")[1];

  fetch(`http://211.43.13.171:8000/board/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order: "new",
    }),
  })
    .then((res) => res.json())
    .then(async (response) => {
      // console.log(response);
      pages = [];
      showContents(response, 1);
    });
};

window.addEventListener("load", renderDatas);

function search(keyword, order, page) {
  fetch(`http://211.43.13.171:8000/board/${id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      order,
      perPage: 4,
      search: keyword,
      page,
    }),
  })
    .then((res) => res.json())
    .then(async (response) => {
      pages = [];
      showContents(response, 1);
    });
}

function showContents(contents) {
  let page = [];
  contentsLength = contents.length;
  for (let i = 0; i < contents.length; i++) {
    if (i % 9 === 0) {
      pages.push(page);
      page = [];
    }
    page.push(contents[i]);
  }
  pages.push(page);

  changePage(1);

  document.querySelectorAll("#boardCount").forEach((elem) => (elem.innerText = contents.length));
}

function changePage(n) {
  const wrapper = document.querySelector("#inquiryBottom");
  const wrapper2 = document.querySelector("#noticeListBottom");
  [wrapper, wrapper2].forEach((wrapper) => wrapper.innerHTML = "");
  
  currentPage = n;
  let itemNumber = contentsLength - ((n-1) * 9)
  if (pages[n]) {
  pages[n].forEach((element, index) => { 
    const html = `
      ${index === 0 ? '<ul class="noticeTitle inquiryTitle"><li>NO</li><li>항목</li><li>업체명</li><li>날짜</li></ul>' : ''}
      <ul class="noticeList inquiryList">
        <li class="postCount">${element.post_id}</li>
        <li><a href="/page/loadPage.html?cat=${element.category_id}&id=${element.post_id}"><span class="noticeColor" id="categoryList">${element.post_postType}</span></a></li>
        <li>${element.company}</li>
        <li>${element.post_uploadTime.substr(0,11)}</li>
      </ul>
    `;
    wrapper.innerHTML += html;
  
    const html2 = `
      ${index === 0 ? '<ul class="noticeTitle"><li>NO</li><li>카테고리</li><li>제목</li><li>날짜</li><li>조회수</li></ul>' : ''}
      <ul class="noticeList">
        <li>${itemNumber}</li>
        <li><a class="noticeColor" id="categoryList">${element.post_postType}</a></li>
        <li><a href="/page/loadPage.html?cat=${element.category_id}&id=${element.post_id}">${element.post_title}</a></li>
        <li>${element.post_uploadTime.substr(0,11)}</li>
        <li>${element.post_count}</li>
      </ul>
    `;
    wrapper2.innerHTML += html2;
    const noticeColors = document.querySelectorAll('.noticeColor');
    noticeColors.forEach(noticeColor => {
      if (noticeColor.innerText === '전체공지') {
        noticeColor.style.backgroundColor = '#e0e0e0';
        noticeColor.style.border = '1px solid #e0e0e0';
        noticeColor.style.color = '#333333'
      }
    });
    itemNumber--
  });
}
  
  const paginations = document.querySelectorAll("#pagination");
  paginations.forEach((pagination) => {
    pagination.innerHTML = `
      <a ><i class="fa-solid fa-angles-left"></i></a>
      <a ><i class="fa-solid fa-angle-left"></i></a>
    `;
    const pageStart = Math.max(Math.min(n - 3, pages.length - 5), 0);
    for (let i = 1; i < Math.min(pages.length, 5); i++) {
      if (i === 0) continue;
      pagination.innerHTML += `<a ><p>${pageStart + i}</p></a>`;
    }
    pagination.innerHTML += `
      <a ><i class="fa-solid fa-angle-right"></i></a>
      <a ><i class="fa-solid fa-angles-right"></i></a>
    `;

    pagination.querySelectorAll("p").forEach((p) => {
      if (p.innerText == n) p.style.color = "#cd1319";
      p.addEventListener("click", () => changePage(parseInt(p.innerText)));
    });
  });

  const angles = document.querySelectorAll(".fa-angles-left, .fa-angle-left, .fa-angle-right, .fa-angles-right");
  angles.forEach((angle) => {
    if (angle.classList.contains("fa-angles-left") && currentPage !== 1) {
      angle.addEventListener("click", () => changePage(1));
    } else if (angle.classList.contains("fa-angle-left") && currentPage !== 1) {
      angle.addEventListener("click", () => changePage(currentPage - 1));
    } else if (angle.classList.contains("fa-angle-right") && currentPage !== pages.length - 1) {
      angle.addEventListener("click", () => changePage(currentPage + 1));
    } else if (angle.classList.contains("fa-angles-right") && currentPage !== pages.length - 1) {
      angle.addEventListener("click", () => changePage(pages.length - 1));
    }
    else {
      angle.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  });
}

function getOrder() {
  const sel = document.querySelector('select').value;
  return {'최신순': 'new', '조회순': 'hit', '업데이트순': 'update'}[sel];
}

document.querySelectorAll('select').forEach(select => {
  select.addEventListener("change",(e)=>{
    search(document.querySelector("#search").value,{'최신순': 'new', '조회순': 'hit', '업데이트순': 'update'}[e.target.value])
  })
});

const searchInputs = document.querySelectorAll('.search');
searchInputs.forEach((searchInput) => {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      search(searchInput.value, getOrder());
    }
  });
});

const searchBtns = document.querySelectorAll('.noticeSearch i');
searchBtns.forEach((searchBtn) => {
  searchBtn.addEventListener('click', (e) => {
    const searchInput = e.target.previousElementSibling;
    search(searchInput.value, getOrder());
  });
});



