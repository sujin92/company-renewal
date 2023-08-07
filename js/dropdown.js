// qna
function collapse(element) {
  let before = document.getElementsByClassName("dropActive")[0];
  if (before && document.getElementsByClassName("dropActive")[0] != element) {
    before.nextElementSibling.style.maxHeight = null;
    before.classList.remove("dropActive");
  }
  element.classList.toggle("dropActive");

  let content = element.nextElementSibling;
  if (content.style.maxHeight != 0) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}

// 댓글
const dropdownButton = document.getElementById('dropdownButton');
const dropdownMenu = document.getElementById('dropdownMenu');

if (!dropdownButton || !dropdownMenu) {
} else {
  dropdownButton.addEventListener('click', (e) => {
    dropdownMenu.classList.toggle('dropdownActive');
  });
}

