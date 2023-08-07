let pages = [];
let currentPage = 0;
let id = '';

document.addEventListener('DOMContentLoaded', function() {
  sessionStorage.setItem("password", null);
  let current_tab = window.location.href.split("?")[1].split('id=')[1];
  
  const addIconToDropbtn = () => {
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-caret-down');
    document.querySelector('.dropbtn').appendChild(icon);
  };
  
  if (current_tab === 'introduce') {
    document.querySelector('.dropbtn').textContent = '제품소개';
    addIconToDropbtn();
  }
  else if (current_tab === 'information') {
    document.querySelector('.dropbtn').textContent = '정보공유';
    addIconToDropbtn();
  }
  else if (current_tab === 'sns') {
    document.querySelector('.dropbtn').textContent = '공식 SNS';
    addIconToDropbtn();
  }
  else if (current_tab === 'news') {
    document.querySelector('.dropbtn').textContent = 'NEWS';
    addIconToDropbtn();
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
  // console.log(contents);
  for (let i = 0; i < contents.length; i++) {
    if (i % 6 === 0) {
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
  const wrapper1 = document.querySelector("#introduceListBottom");
  const wrapper2 = document.querySelector("#infomationListBottom");
  const wrapper3 = document.querySelector("#snsBottom");
  const wrapper4 = document.querySelector("#newsBottom");
  [wrapper1, wrapper2, wrapper3, wrapper4].forEach((wrapper) => (wrapper.innerHTML = ""));

  currentPage = n;
  if (pages[n]) {
  pages[n].forEach((element) => {
    // console.log(element)
    const html = `
      <div class="listBottomBox">
        <a href="/page/loadPage.html?cat=${element.category_id}&id=${element.post_id}">
        <img src="http://211.43.13.171:8000${element.post_thumbImage}" alt="${element.post_postType}" />
          <div class="listText">
            <h4>${element.post_title}</h4>
            <p>${element.post_content.replace(/(<([^>]+)>)/gi, "")}</p>
            <span>${element.post_uploadTime.substr(0, 11)}</span>
          </div>
        </a>
      </div>
    `;
    wrapper1.innerHTML += html;
    wrapper2.innerHTML += html;

    const html2 = `
    <div>
    <a href="/page/loadPage.html?cat=${element.category_id}&id=${element.post_id}">
      <div class="imgHover">
        <img src="http://211.43.13.171:8000${element.post_thumbImage}"  alt="${element.post_postType}" />
      </div>
        <h3>${element.post_title}</h3>
        <div class="listTextBottom">
          <div>
            <i class="fa-solid fa-eye viewCount"></i>
            <em>${element.post_count}</em>
          </div>
          <span>${element.post_uploadTime.substr(0, 11)}</span>
        </div>
      </a>
    </div>
    `;
    wrapper3.innerHTML += html2;
    wrapper4.innerHTML += html2;
  });
}

  const paginations = document.querySelectorAll("#pagination");
  paginations.forEach((pagination) => {
    pagination.innerHTML = `
      <a><i class="fa-solid fa-angles-left"></i></a>
      <a><i class="fa-solid fa-angle-left"></i></a>
    `;
    const pageStart = Math.max(Math.min(n - 3, pages.length - 5), 0);
    for (let i = 1; i < Math.min(pages.length, 5); i++) {
      if (i === 0) continue;
      pagination.innerHTML += `<a><p>${pageStart + i}</p></a>`;
    }
    pagination.innerHTML += `
      <a><i class="fa-solid fa-angle-right"></i></a>
      <a><i class="fa-solid fa-angles-right"></i></a>
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

const searchBtns = document.querySelectorAll('.resultSearch i');
searchBtns.forEach((searchBtn) => {
  searchBtn.addEventListener('click', (e) => {
    const searchInput = e.target.previousElementSibling;
    search(searchInput.value, getOrder());
  });
});
