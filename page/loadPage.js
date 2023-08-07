const post_id = window.location.href.split("id=")[1];
let cat;
let id;

async function sessionString() {
  let sessionString = sessionStorage.getItem("sessionString");
  if (sessionString !== null) {
    try {
      let auth = await authProcess(sessionString);
      return auth === "OK" ? true : false;
    } catch (error) {
      console.log(error);
    }
  }
}

function authProcess(sessionString) {
  let authResult = fetch("http://211.43.13.171:8000/setup/verify", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      session: sessionString,
    }),
  });
  return authResult.then((res) => {
    if (res.status === 200) {
      return res.text();
    }
  });
}

window.addEventListener("load", async () => {
  const queries = window.location.search.split("?")[1].split("&");
  id = queries.filter((e) => e.indexOf("id") !== -1)[0].split("=")[1];
  cat = queries.filter((e) => e.indexOf("cat") !== -1)[0].split("=")[1];
  let isAdmin = false;
  if (sessionStorage.getItem("sessionString")) {
    isAdmin = true;
  }

  const target = document.querySelector(".revise");

  window.moveEditPage = function() {
    if (cat === "result" || cat === "material") {
      const url = `/page/technologyPage/technologyModifyPage.html?cat=${cat}&id=${id}`;
      window.location.href = url;
    } else if (cat === "notice") {
      const url = `/page/centerPage/centerPageModifyPage.html?cat=${cat}&id=${id}`;
      window.location.href = url;
    } else {
      const url = `/page/modifyPage.html?cat=${cat}&id=${id}`;
      window.location.href = url;
    }
  };

  if (isAdmin) {
    const editBtn = mkBtn({ id: "edit_btn", name: "수정", func: moveEditPage });
    const removeBtn = mkBtn({ id: "delete_btn", name: "삭제", func: removePost });

    if (cat !== "inquiry") {
      target.appendChild(editBtn);
      target.appendChild(removeBtn);
    } else {
      target.appendChild(removeBtn);
    }
  }

  let postContent;

  if (cat === "inquiry" && !isAdmin) {
    const password = prompt("비밀번호를 입력해 주세요.");
    postContent = await fetch(`http://211.43.13.171:8000/board/detail/${cat}/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        post_password: password,
        session: sessionStorage.getItem("sessionString"),
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          alert("비밀번호가 일치하지 않습니다.");
          window.history.back();
          return null;
        }
        return res.json();
      });
  } else {
    postContent = await fetch(`http://211.43.13.171:8000/board/detail/${cat}/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        post_password: isAdmin ? null : sessionStorage.getItem("password"),
        session: sessionStorage.getItem("sessionString"),
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          alert("비밀번호가 일치하지 않습니다.");
          sessionStorage.setItem("password", null);
          window.history.back();
          return null;
        }
        return res.json();
      });
  }  

  if (postContent) {
    document.querySelector(".writer").innerText = postContent.post_writer;
    document.querySelector(".writerData").innerText = postContent.post_uploadTime;
    document.querySelector(".hits").innerText = postContent.post_count;
    document.querySelector(".ql-editor").innerHTML = postContent.post_content;
    document.querySelector(".loadPageInner > h2").innerText = postContent.post_title;

    document.querySelector("body").style.opacity = 1;
  }
});

function removePost() {
  // console.log(sessionStorage);
  const isConfirmed = confirm("정말 삭제하시겠습니까?");
  if (isConfirmed) {
    fetch(`http://211.43.13.171:8000/board/delete/${post_id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: post_id,
        session: sessionStorage.getItem("sessionString"),
      }),
    });

    alert("삭제되었습니다.");
    sessionStorage.setItem("password", null);

    let targetUrl;
    switch(cat) {
      case 'result':
        targetUrl = '/page/technologyPage/technologyPage.html?id=result';
        break;
      case 'material':
        targetUrl = '/page/technologyPage/technologyPage.html?id=material';
        break;
      case 'introduce':
        targetUrl = '/page/communityPage/communityPage.html?id=introduce';
        break;
      case 'information':
        targetUrl = '/page/communityPage/communityPage.html?id=information';
        break;
      case 'sns':
        targetUrl = '/page/communityPage/communityPage.html?id=sns';
        break;
      case 'news':
        targetUrl = '/page/communityPage/communityPage.html?id=news';
        break;
      case 'inquiry':
        targetUrl = '/page/centerPage/centerPage.html?id=inquiry';
        break;
      case 'notice':
        targetUrl = '/page/centerPage/centerPage.html?id=notice';
        break;
    }
    window.location.href = targetUrl;
  }
}

window.addEventListener("load", () => {
  header_on();

  document.querySelector(".innerHeader").addEventListener("mouseout", (e) => {
    setTimeout(() => {
      header_on();
    }, 0);
  });

  document.getElementById("delete_btn", () => {
    fetch(`http://211.43.13.171:8000/delete/${post_id}`).then(() => {
      window.location.href = `http://127.0.0.1:5501/page/communityPage/communityPage.html`;
    });
  });
});

window.addEventListener("load", async () => {
  const ele = document.getElementById("count");

  const { count } = await fetch(`http://211.43.13.171:8000/comment/${post_id}/count`, {
    method: "POST",
  }).then((res) => res.json());

  ele.innerText = count;
});

const mkBtn = ({ id, name, func }) => {
  const btn = document.createElement("button");
  btn.id = id;
  btn.innerText = name;
  btn.addEventListener("click", func);
  return btn;
};

window.addEventListener("load", async () => {
  const container = document.querySelector(".comments");
  const comments = await fetch(`http://211.43.13.171:8000/comment/${post_id}`, {
    method: "POST",
  }).then((x) => x.json());

  let modiComments = commentCut(comments);

  let commentCount = modiComments.length;
  let maxPageNum = Math.floor(commentCount / 10 + 1);
  let currentPageNum = window.location.search.indexOf("currentPageNum");
  if (currentPageNum == -1) {
    currentPageNum = 1;
  } else {
    currentPageNum = queries.filter((e) => e.indexOf("currentPageNum") !== -1)[0].split("=")[1];
  }

  if (commentCount % 10 == 0) {
    maxPageNum--;
  }
  let max = commentCount;
  let min = 0;
  if (currentPageNum * 10 < max) {
    max = currentPageNum * 10;
  }
  if (currentPageNum * 10 - 10 > 0) {
    min = currentPageNum * 10 - 10;
  }

  pagingNumber(maxPageNum, currentPageNum);
  for (let i = min; i < max; i++) {
    const { comment_id, comment_writer, comment_content, comment_uploadTime, comment_isReply, reply_ref, reply_step } = modiComments[i];
    const element = createComment(modiComments[i]);

    if (comment_isReply && container.querySelector(`#comment_${reply_ref}`)) {
      container.querySelector(`#comment_${reply_ref}`).after(element);
    } else {
      container.appendChild(element);
    }
  }
});

function commentCut(comments) {
  let commentlist = [];
  let result = [];

  comments.forEach(function (item, index) {
    if (item.comment_isReply === 0) {
      commentlist.push(item.comment_id);
    }
  });

  comments.forEach(function (item, index) {
    commentlist.forEach(function (sItem, sIndex) {
      if (item.reply_ref == sItem) {
        result.push(item);
      }
    });
  });

  return result;
}

function pagingNumber(num, currentPageNum) {
  for (let i = 0; i < num; i++) {
    let pagingHtml = "";
    pagingHtml += "<li>";
    pagingHtml += "<a href=" + `/page/loadPage.html?cat=${cat}&id=${id}&currentPageNum=${i + 1}` + ">";
    if (i + 1 == currentPageNum) {
      pagingHtml += "<span style='color:#cd1319'>" + (i + 1) + "</span>";
    } else {
      pagingHtml += i + 1;
    }
    pagingHtml += "</a>";
    pagingHtml += "</li>";

    document.querySelector("#commentPagination ul").insertAdjacentHTML("beforeend", pagingHtml);
  }
}

function createComment({ comment_id, comment_writer, comment_content, comment_uploadTime, comment_isReply, reply_ref, reply_step }) {
  const element = document.createElement("div");
  element.id = `comment_${comment_id}`;
  element.classList = "commentUser";
  if (comment_isReply) element.classList += " commentReply";
  element.innerHTML = `
  <div>
    <p><i class="fa-solid fa-circle-user"></i>${comment_writer}</p>
    <p>${comment_content}</p>
    <p>${comment_uploadTime}</p>
    ${
      comment_isReply
        ? ""
        : `
      <button type="button" id="reply" class="boxButton">답글</button>
      `
    }
    <button type="button" class="boxButton" onclick="delComment(${comment_id})">삭제</button>
  </div>
  `;
  if (comment_isReply) {
    element.innerHTML = `<span>L</span>` + element.innerHTML;
  } else {
    element.innerHTML +=  `
    <div id="replyHeading" class="replyHidden">
      <div>
        <input type="text" id="userName" placeholder="이름">
        <input type="password" id="userPw" placeholder="비밀번호">
      </div>
      <div>
        <textarea placeholder="내용을 입력하세요." id="userComment" rows="5"></textarea>
      </div>
      <button type="button" class="boxButton btnBox">등록</button>
    </div>
    `;
  }

  if (!comment_isReply) {
    element.querySelector("#replyHeading > button").addEventListener("click", addReply);
    element.querySelector("#reply").addEventListener("click", () => {
      const k = element.querySelector("#replyHeading").classList;
      if (k.value == "") {
        element.querySelector("#replyHeading").classList = "replyHidden";
      } else {
        element.querySelector("#replyHeading").classList = "";
      }
    });
  }

  return element;
}

function addComment() {
  const name = document.querySelector(".commentNew #userName").value;
  const pass = document.querySelector(".commentNew #userPw").value;
  const comment = document.querySelector(".commentNew #userComment").value;

  if (!name) {
    alert("이름을 입력해 주세요.");
    return;
  }

  if (!pass) {
    alert("비밀번호를 입력해 주세요.");
    return;
  }

  if (!comment) {
    alert("내용을 입력해 주세요.");
    return;
  }

  fetch(`http://211.43.13.171:8000/comment/post`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      post_id: post_id,
      comment_writer: name,
      comment_content: comment,
      comment_password: pass,
      comment_isReply: 0,
      session: sessionStorage.getItem("sessionString"),
    }),
  })
    .then((x) => x.json())
    .then(() => {
      alert("등록되었습니다.");
      window.location.reload();
    });
}

function delComment(id) {
  const password = prompt("비밀번호를 입력해주세요.");

  fetch(`http://211.43.13.171:8000/comment/delete/${id}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      comment_password: password,
    }),
  }).then((res) => {
    if (res.status !== 200) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    alert("삭제되었습니다.");
    window.location.reload();
  });
}

function addReply(e) {
  const reply = e.target.parentElement;
  const id = reply.parentElement.id.split("_")[1];
  const name = reply.querySelector("#userName").value;
  const pass = reply.querySelector("#userPw").value;
  const comment = reply.querySelector("#userComment").value;

  if (!name) {
    alert("이름을 입력해 주세요.");
    return;
  }

  if (!pass) {
    alert("비밀번호를 입력해 주세요.");
    return;
  }

  if (!comment) {
    alert("내용을 입력해 주세요.");
    return;
  }

  fetch(`http://211.43.13.171:8000/comment/post`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      post_id: post_id,
      comment_writer: name,
      comment_content: comment,
      comment_password: pass,
      comment_isReply: 1,
      reply_step: 1,
      reply_ref: id,
      session: sessionStorage.getItem("sessionString"),
    }),
  })
    .then((x) => x.json())
    .then(() => {
      alert("등록되었습니다.");
      window.location.reload();
    });
}
