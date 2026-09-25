/* =========================================
   HAPPY FRIDAY
   SPOT THE DIFFERENCE
   Pure JavaScript
   ========================================= */


/* =========================================
   1. CẤU HÌNH GAME
   ========================================= */

const TOTAL_DIFFERENCES = 5;

// 3 phút = 180 giây
const START_TIME = 180;

// Mỗi lần click sai cộng 5 giây
const WRONG_CLICK_PENALTY = 5;


/*
  5 điểm khác nhau.

  x và y là phần trăm vị trí trên hình.

  Ví dụ:
  x: 20, y: 30

  nghĩa là điểm khác nhau nằm ở:
  20% chiều ngang
  30% chiều dọc
*/
const DIFFERENCES = [
  {
    id: 1,
    x: 20,
    y: 24,
    radius: 9
  },

  {
    id: 2,
    x: 76,
    y: 24,
    radius: 9
  },

  {
    id: 3,
    x: 48,
    y: 49,
    radius: 9
  },

  {
    id: 4,
    x: 24,
    y: 75,
    radius: 9
  },

  {
    id: 5,
    x: 78,
    y: 80,
    radius: 9
  }
];


/* =========================================
   2. LẤY CÁC ELEMENT HTML
   ========================================= */

const startScreen =
  document.getElementById("startScreen");

const gameScreen =
  document.getElementById("gameScreen");

const resultScreen =
  document.getElementById("resultScreen");


const nicknameInput =
  document.getElementById("nickname");

const startButton =
  document.getElementById("startButton");

const restartButton =
  document.getElementById("restartButton");

const shareButton =
  document.getElementById("shareButton");


const progressText =
  document.getElementById("progressText");

const timerElement =
  document.getElementById("timer");


const imageA =
  document.getElementById("imageA");

const imageB =
  document.getElementById("imageB");


const imageContainerA =
  document.getElementById("imageContainerA");

const imageContainerB =
  document.getElementById("imageContainerB");


const markersA =
  document.getElementById("markersA");

const markersB =
  document.getElementById("markersB");


const resultNickname =
  document.getElementById("resultNickname");

const resultTime =
  document.getElementById("resultTime");

const resultScore =
  document.getElementById("resultScore");

const resultCode =
  document.getElementById("resultCode");

const shareMessage =
  document.getElementById("shareMessage");


const confettiContainer =
  document.getElementById("confettiContainer");


/* =========================================
   3. BIẾN TRẠNG THÁI GAME
   ========================================= */

let nickname = "";

let timeLeft = START_TIME;

let timerInterval = null;

let foundDifferences = new Set();

let wrongClicks = 0;

let gameStarted = false;

let gameFinished = false;


/* =========================================
   4. TẠO HÌNH ẢNH SVG
   =========================================

   Để bạn không phải quản lý thêm file ảnh,
   game tự tạo 2 hình bằng SVG.

   Hình B có 5 thay đổi nhỏ.

   Các vùng khác nhau vẫn được đánh dấu
   bằng hệ tọa độ trong DIFFERENCES.
*/


function createSceneSVG(hasDifferences = false) {

  /*
    Nếu hasDifferences = true,
    chúng ta thêm 5 thay đổi vào hình B.

    Hình A = hình gốc
    Hình B = hình có 5 khác biệt
  */

  const extraDifferences = hasDifferences
    ? `
      <!-- DIFFERENCE 1: Cây -->
      <circle
        cx="120"
        cy="95"
        r="18"
        fill="#FF6B6B"
      />

      <!-- DIFFERENCE 2: Mặt trời -->
      <circle
        cx="455"
        cy="90"
        r="24"
        fill="#6C63FF"
      />

      <!-- DIFFERENCE 3: Đồng hồ -->
      <circle
        cx="290"
        cy="210"
        r="24"
        fill="#FFD166"
      />

      <!-- DIFFERENCE 4: Cốc -->
      <rect
        x="85"
        y="330"
        width="34"
        height="45"
        rx="7"
        fill="#FF6B6B"
      />

      <!-- DIFFERENCE 5: Chậu cây -->
      <rect
        x="440"
        y="355"
        width="48"
        height="38"
        rx="8"
        fill="#6C63FF"
      />
    `
    : "";


  const svg = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 580 460"
  >

    <!-- Background -->
    <rect
      width="580"
      height="460"
      fill="#E7F7F4"
    />

    <!-- Wall -->
    <rect
      x="25"
      y="25"
      width="530"
      height="330"
      rx="20"
      fill="#FFF8E7"
    />

    <!-- Floor -->
    <rect
      x="25"
      y="355"
      width="530"
      height="80"
      rx="10"
      fill="#D7C4A8"
    />

    <!-- Window -->
    <rect
      x="65"
      y="60"
      width="160"
      height="120"
      rx="12"
      fill="#A9E5FF"
      stroke="#FFFFFF"
      stroke-width="8"
    />

    <line
      x1="145"
      y1="60"
      x2="145"
      y2="180"
      stroke="#FFFFFF"
      stroke-width="7"
    />

    <line
      x1="65"
      y1="120"
      x2="225"
      y2="120"
      stroke="#FFFFFF"
      stroke-width="7"
    />

    <!-- Sun -->
    <circle
      cx="190"
      cy="88"
      r="20"
      fill="#FFD166"
    />

    <!-- Plant -->
    <rect
      x="430"
      y="300"
      width="55"
      height="55"
      rx="9"
      fill="#E58B5C"
    />

    <ellipse
      cx="430"
      cy="280"
      rx="35"
      ry="18"
      fill="#4CCB8A"
      transform="rotate(-25 430 280)"
    />

    <ellipse
      cx="475"
      cy="265"
      rx="35"
      ry="18"
      fill="#35B979"
      transform="rotate(25 475 265)"
    />

    <ellipse
      cx="455"
      cy="245"
      rx="30"
      ry="16"
      fill="#5BDB99"
    />

    <!-- Wall clock -->
    <circle
      cx="290"
      cy="210"
      r="38"
      fill="#FFFFFF"
      stroke="#59627D"
      stroke-width="5"
    />

    <line
      x1="290"
      y1="210"
      x2="290"
      y2="188"
      stroke="#59627D"
      stroke-width="5"
      stroke-linecap="round"
    />

    <line
      x1="290"
      y1="210"
      x2="308"
      y2="220"
      stroke="#59627D"
      stroke-width="5"
      stroke-linecap="round"
    />

    <!-- Desk -->
    <rect
      x="100"
      y="285"
      width="340"
      height="25"
      rx="8"
      fill="#B67A4D"
    />

    <!-- Desk legs -->
    <rect
      x="125"
      y="310"
      width="20"
      height="90"
      rx="5"
      fill="#8F603E"
    />

    <rect
      x="395"
      y="310"
      width="20"
      height="90"
      rx="5"
      fill="#8F603E"
    />

    <!-- Laptop -->
    <rect
      x="245"
      y="235"
      width="110"
      height="70"
      rx="7"
      fill="#5D6681"
    />

    <rect
      x="255"
      y="245"
      width="90"
      height="48"
      rx="4"
      fill="#A9E5FF"
    />

    <path
      d="M225 305 H375 L390 315 H210 Z"
      fill="#3E465E"
    />

    <!-- Coffee cup -->
    <rect
      x="85"
      y="300"
      width="34"
      height="45"
      rx="7"
      fill="#FFFFFF"
      stroke="#59627D"
      stroke-width="4"
    />

    <path
      d="M119 310 C145 305 145 335 119 330"
      fill="none"
      stroke="#59627D"
      stroke-width="5"
    />

    <!-- Sticky notes -->
    <rect
      x="165"
      y="315"
      width="48"
      height="38"
      rx="4"
      fill="#FFE08A"
      transform="rotate(-4 165 315)"
    />

    <rect
      x="365"
      y="320"
      width="48"
      height="38"
      rx="4"
      fill="#FFB5C2"
      transform="rotate(5 365 320)"
    />

    <!-- Character -->
    <circle
      cx="290"
      cy="145"
      r="34"
      fill="#FFD0B5"
    />

    <path
      d="M255 142 C255 105 325 105 325 142"
      fill="#493A35"
    />

    <circle
      cx="278"
      cy="148"
      r="4"
      fill="#263043"
    />

    <circle
      cx="302"
      cy="148"
      r="4"
      fill="#263043"
    />

    <path
      d="M278 165 Q290 175 302 165"
      fill="none"
      stroke="#263043"
      stroke-width="4"
      stroke-linecap="round"
    />

    <!-- Shirt -->
    <path
      d="M250 180 Q290 160 330 180 L350 285 H230 Z"
      fill="#6C63FF"
    />

    <!-- Small logo on shirt -->
    <circle
      cx="290"
      cy="215"
      r="10"
      fill="#FFFFFF"
    />

    <!-- DIFFERENCES -->
    ${extraDifferences}

  </svg>
  `;

  return svg;
}


/* =========================================
   5. BIẾN SVG THÀNH DATA URL
   ========================================= */

function svgToDataUrl(svg) {

  /*
    encodeURIComponent giúp SVG có thể
    được sử dụng trực tiếp trong <img>.
  */

  return "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(svg);
}


/* =========================================
   6. HIỂN THỊ HÌNH GAME
   ========================================= */

function loadGameImages() {

  const normalImage =
    svgToDataUrl(
      createSceneSVG(false)
    );

  const differenceImage =
    svgToDataUrl(
      createSceneSVG(true)
    );


  imageA.src = normalImage;

  imageB.src = differenceImage;
}


/* =========================================
   7. FORMAT THỜI GIAN
   ========================================= */

function formatTime(totalSeconds) {

  const minutes =
    Math.floor(totalSeconds / 60);

  const seconds =
    totalSeconds % 60;

  return (
    String(minutes).padStart(2, "0")
    +
    ":"
    +
    String(seconds).padStart(2, "0")
  );
}


/* =========================================
   8. UPDATE TIMER
   ========================================= */

function updateTimerDisplay() {

  timerElement.textContent =
    formatTime(timeLeft);


  /*
    Khi còn dưới 30 giây,
    timer chuyển sang trạng thái cảnh báo.
  */

  if (timeLeft <= 30) {

    timerElement
      .parentElement
      .classList
      .add("warning");

  } else {

    timerElement
      .parentElement
      .classList
      .remove("warning");
  }
}


/* =========================================
   9. BẮT ĐẦU TIMER
   ========================================= */

function startTimer() {

  stopTimer();

  timerInterval =
    setInterval(() => {

      if (!gameStarted || gameFinished) {
        return;
      }


      timeLeft--;

      updateTimerDisplay();


      /*
        Nếu hết giờ:
        cho game kết thúc.
      */

      if (timeLeft <= 0) {

        timeLeft = 0;

        updateTimerDisplay();

        finishGame(false);
      }

    }, 1000);
}


/* =========================================
   10. DỪNG TIMER
   ========================================= */

function stopTimer() {

  if (timerInterval !== null) {

    clearInterval(timerInterval);

    timerInterval = null;
  }
}


/* =========================================
   11. RESET GAME
   ========================================= */

function resetGame() {

  stopTimer();


  timeLeft = START_TIME;

  foundDifferences =
    new Set();

  wrongClicks = 0;

  gameStarted = false;

  gameFinished = false;


  progressText.textContent =
    `0/${TOTAL_DIFFERENCES}`;


  timerElement.textContent =
    formatTime(START_TIME);


  timerElement
    .parentElement
    .classList
    .remove("warning");


  markersA.innerHTML = "";

  markersB.innerHTML = "";


  shareMessage.textContent = "";


  loadGameImages();
}


/* =========================================
   12. BẮT ĐẦU GAME
   ========================================= */

function startGame() {

  nickname =
    nicknameInput.value.trim();


  /*
    Nếu người chơi không nhập nickname,
    dùng "Anonymous".
  */

  if (!nickname) {

    nickname = "Anonymous";
  }


  resetGame();


  gameStarted = true;


  startScreen.classList.add("hidden");

  resultScreen.classList.add("hidden");

  gameScreen.classList.remove("hidden");


  startTimer();
}


/* =========================================
   13. KIỂM TRA CLICK CÓ TRÚNG
   ========================================= */

function getClickedDifference(
  event,
  container
) {

  const rect =
    container.getBoundingClientRect();


  /*
    Tọa độ click trong container.
  */

  const clickX =
    ((event.clientX - rect.left)
      / rect.width) * 100;


  const clickY =
    ((event.clientY - rect.top)
      / rect.height) * 100;


  /*
    Tìm difference gần vị trí click nhất.
  */

  let closestDifference = null;

  let closestDistance = Infinity;


  DIFFERENCES.forEach((difference) => {

    /*
      Nếu điểm này đã tìm thấy,
      bỏ qua.
    */

    if (
      foundDifferences.has(
        difference.id
      )
    ) {
      return;
    }


    const dx =
      clickX - difference.x;

    const dy =
      clickY - difference.y;


    const distance =
      Math.sqrt(
        dx * dx +
        dy * dy
      );


    if (
      distance < closestDistance
    ) {

      closestDistance =
        distance;

      closestDifference =
        difference;
    }

  });


  /*
    Nếu khoảng cách nhỏ hơn radius
    thì click được xem là đúng.
  */

  if (
    closestDifference &&
    closestDistance <=
      closestDifference.radius
  ) {

    return closestDifference;
  }


  return null;
}


/* =========================================
   14. CLICK ĐÚNG
   ========================================= */

function handleCorrectClick(
  difference
) {

  /*
    Không cho click lại.
  */

  if (
    foundDifferences.has(
      difference.id
    )
  ) {
    return;
  }


  foundDifferences.add(
    difference.id
  );


  /*
    Cập nhật progress.
  */

  progressText.textContent =
    `${foundDifferences.size}/${TOTAL_DIFFERENCES}`;


  /*
    Đánh dấu trên cả 2 hình.
  */

  addMarker(
    markersA,
    difference
  );

  addMarker(
    markersB,
    difference
  );


  /*
    Nếu đủ 5 điểm -> hoàn thành.
  */

  if (
    foundDifferences.size ===
    TOTAL_DIFFERENCES
  ) {

    setTimeout(() => {

      finishGame(true);

    }, 500);
  }
}


/* =========================================
   15. THÊM VÒNG TRÒN XANH
   ========================================= */

function addMarker(
  markerLayer,
  difference
) {

  const marker =
    document.createElement("div");


  marker.className =
    "correct-marker";


  marker.style.left =
    `${difference.x}%`;


  marker.style.top =
    `${difference.y}%`;


  markerLayer.appendChild(
    marker
  );
}


/* =========================================
   16. CLICK SAI
   ========================================= */

function handleWrongClick(
  event,
  container
) {

  wrongClicks++;


  /*
    Cộng thêm 5 giây.

    Vì timer đang đếm ngược,
    chúng ta trừ 5 khỏi timeLeft.
  */

  timeLeft -=
    WRONG_CLICK_PENALTY;


  /*
    Không để thời gian xuống âm.
  */

  if (timeLeft < 0) {

    timeLeft = 0;
  }


  updateTimerDisplay();


  /*
    Hiệu ứng vòng tròn đỏ.
  */

  const rect =
    container.getBoundingClientRect();


  const x =
    event.clientX -
    rect.left;


  const y =
    event.clientY -
    rect.top;


  const flash =
    document.createElement("div");


  flash.className =
    "wrong-flash";


  flash.style.left =
    `${x}px`;


  flash.style.top =
    `${y}px`;


  container.appendChild(
    flash
  );


  setTimeout(() => {

    flash.remove();

  }, 500);


  /*
    Nếu click sai khiến timer về 0,
    game kết thúc.
  */

  if (timeLeft <= 0) {

    finishGame(false);
  }
}


/* =========================================
   17. XỬ LÝ CLICK HÌNH A
   ========================================= */

imageContainerA.addEventListener(
  "click",
  (event) => {

    if (
      !gameStarted ||
      gameFinished
    ) {
      return;
    }


    const difference =
      getClickedDifference(
        event,
        imageContainerA
      );


    if (difference) {

      handleCorrectClick(
        difference
      );

    } else {

      handleWrongClick(
        event,
        imageContainerA
      );
    }

  }
);


/* =========================================
   18. XỬ LÝ CLICK HÌNH B
   ========================================= */

imageContainerB.addEventListener(
  "click",
  (event) => {

    if (
      !gameStarted ||
      gameFinished
    ) {
      return;
    }


    const difference =
      getClickedDifference(
        event,
        imageContainerB
      );


    if (difference) {

      handleCorrectClick(
        difference
      );

    } else {

      handleWrongClick(
        event,
        imageContainerB
      );
    }

  }
);


/* =========================================
   19. TẠO RESULT CODE
   ========================================= */

function generateResultCode() {

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


  let code = "";


  for (
    let i = 0;
    i < 6;
    i++
  ) {

    const randomIndex =
      Math.floor(
        Math.random() *
        characters.length
      );


    code +=
      characters[randomIndex];
  }


  return `HF-${code}`;
}


/* =========================================
   20. TÍNH SCORE
   ========================================= */

function calculateScore() {

  /*
    Score gồm:

    - Thời gian còn lại
    - Bonus hoàn thành
    - Trừ nhẹ theo số lần click sai

    Công thức này chỉ chạy ở frontend.
  */

  const timeBonus =
    timeLeft * 10;


  const completionBonus =
    500;


  const wrongClickPenalty =
    wrongClicks * 25;


  const score =
    timeBonus +
    completionBonus -
    wrongClickPenalty;


  return Math.max(
    0,
    score
  );
}


/* =========================================
   21. HIỂN THỊ KẾT QUẢ
   ========================================= */

function finishGame(success) {

  if (gameFinished) {
    return;
  }


  gameFinished = true;

  gameStarted = false;


  stopTimer();


  /*
    Nếu tìm đủ 5 điểm:
    hiển thị kết quả hoàn thành.
  */

  if (success) {

    const usedTime =
      START_TIME - timeLeft;


    const score =
      calculateScore();


    const code =
      generateResultCode();


    resultNickname.textContent =
      nickname;


    resultTime.textContent =
      formatTime(usedTime);


    resultScore.textContent =
      score.toLocaleString("vi-VN");


    resultCode.textContent =
      code;


    gameScreen.classList.add(
      "hidden"
    );


    resultScreen.classList.remove(
      "hidden"
    );


    /*
      Confetti!
    */

    launchConfetti();

  } else {

    /*
      Nếu hết giờ.

      Đưa người chơi về màn hình
      kết quả nhưng score = 0.
    */

    resultNickname.textContent =
      nickname;


    resultTime.textContent =
      formatTime(START_TIME);


    resultScore.textContent =
      "0";


    resultCode.textContent =
      generateResultCode();


    resultScreen.classList.remove(
      "hidden"
    );


    gameScreen.classList.add(
      "hidden"
    );
  }
}


/* =========================================
   22. CONFETTI
   ========================================= */

function launchConfetti() {

  confettiContainer.innerHTML =
    "";


  const colors = [
    "#5B5CF0",
    "#FF6B6B",
    "#FFD166",
    "#19C589",
    "#8B5CF6",
    "#00B4D8"
  ];


  /*
    Tạo 90 mảnh confetti.
  */

  for (
    let i = 0;
    i < 90;
    i++
  ) {

    const confetti =
      document.createElement("div");


    confetti.className =
      "confetti";


    const color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    confetti.style.background =
      color;


    confetti.style.left =
      `${Math.random() * 100}%`;


    confetti.style.setProperty(
      "--x",
      `${(Math.random() - 0.5) * 300}px`
    );


    confetti.style.setProperty(
      "--duration",
      `${2 + Math.random() * 2.5}s`
    );


    confetti.style.transform =
      `rotate(${Math.random() * 360}deg)`;


    confettiContainer.appendChild(
      confetti
    );
  }


  /*
    Xóa confetti sau 5 giây.
  */

  setTimeout(() => {

    confettiContainer.innerHTML =
      "";

  }, 5500);
}


/* =========================================
   23. CHƠI LẠI
   ========================================= */

restartButton.addEventListener(
  "click",
  () => {

    startGame();
  }
);


/* =========================================
   24. CHIA SẺ KẾT QUẢ
   ========================================= */

shareButton.addEventListener(
  "click",
  async () => {

    const time =
      resultTime.textContent;

    const score =
      resultScore.textContent;

    const code =
      resultCode.textContent;


    const shareText =
      `🎉 HAPPY FRIDAY!\n\n` +
      `${nickname} đã tìm đủ 5 điểm khác nhau.\n` +
      `⏱ Thời gian: ${time}\n` +
      `🏆 Score: ${score}\n` +
      `🔑 Result Code: ${code}`;


    /*
      Nếu điện thoại hỗ trợ Web Share API,
      mở menu Share native của iPhone/Android.
    */

    if (
      navigator.share
    ) {

      try {

        await navigator.share({
          title:
            "HAPPY FRIDAY",
          text:
            shareText,
          url:
            window.location.href
        });


        shareMessage.textContent =
          "Đã mở menu chia sẻ!";

      } catch (error) {

        /*
          Người dùng bấm Cancel
          cũng không cần báo lỗi.
        */

        if (
          error.name !==
          "AbortError"
        ) {

          shareMessage.textContent =
            "Không thể mở chia sẻ.";
        }
      }

    } else {

      /*
        Nếu trình duyệt không hỗ trợ
        Web Share API,
        copy kết quả vào clipboard.
      */

      try {

        await navigator.clipboard.writeText(
          shareText
        );


        shareMessage.textContent =
          "Đã copy kết quả! Bạn có thể paste để chia sẻ.";

      } catch (error) {

        shareMessage.textContent =
          "Hãy chụp màn hình để chia sẻ kết quả.";
      }
    }

  }
);


/* =========================================
   25. ENTER ĐỂ BẮT ĐẦU
   ========================================= */

nicknameInput.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter"
    ) {

      startGame();
    }
  }
);


/* =========================================
   26. LOAD GAME BAN ĐẦU
   ========================================= */

resetGame();
