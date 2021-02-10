const options = document.querySelectorAll(".display-options span");

const mainBtn = document.getElementById("main-btn");
const imgCont = document.getElementById("img-container");

const header = document.querySelector(".header");
const headerH1 = document.querySelector(".header h1");
const subtitle1 = document.querySelector(".subtitle1");
const subtitle2 = document.querySelector(".subtitle2");
const displayBoard = document.querySelector(".display-board");

//When one flag is displayed, your name is stored in this constant for not showing again
const checker = [];
let wrongsCounter = 0;
let score = 0;

const validateCoutry = (countryData) => {
  return new Promise((resolve, reject) => {
    if (checker.some((co) => co == countryData.country)) {
      reject(
        new Error(`This country(${countryData.country}) already shows up`)
      );
    } else if (countryData.flag_base64) {
      resolve([countryData.flag_base64, countryData.country]);
    } else {
      reject(new Error("Sorry, the image was not rendered."));
    }
  });
};

const FetchFlagCountry = async () => {
  let imgName;
  //fetching the API data
  const res = await fetch(
    "./node_modules/country-json/src/country-by-flag.json"
  );
  const country = await res.json();

  //this random number will choose the country data
  const randomNum = Math.floor(Math.random() * 243);

  //The Promise checks if in the data, the country has a image flag, if has not, run the function again
  const renderImg = await validateCoutry(country[randomNum])
    .then((data) => {
      let image = new Image();
      image.src = data[0];
      image.alt = data[1];

      //this checks if the image has a valid url, if has creates the images, but if has not, run the function again
      let http = new XMLHttpRequest();
      http.open("GET", image.src);
      http.send();
      http.addEventListener("load", () => {
        imgCont.innerHTML = "";
        imgCont.appendChild(image);
        imgName = image.alt;
        checker.push(image.alt);

        //this choose the countries to display in the options and run the function to create the options
        let optionsArr = [{ name: imgName, correct: true }];
        for (let i = 0; optionsArr.length < 4; i++) {
          let randomNum2 = Math.floor(Math.random() * 243);
          let countryOption = country[randomNum2].country;
          if (!optionsArr.some((obj) => obj.name == countryOption)) {
            optionsArr.push({ name: countryOption, correct: false });
          }
        }
        fetchOptions(optionsArr);
      });
      http.addEventListener("error", () => {
        FetchFlagCountry();
      });
    })
    .catch(() => {
      FetchFlagCountry();
    });
};

const fetchOptions = (arr) => {
  let counter = [];
  for (let i = 0; counter.length < 4; i++) {
    let randomNum3 = Math.floor(Math.random() * 4);
    if (!counter.some((obj) => obj == arr[randomNum3])) {
      counter.push(arr[randomNum3]);
    }
    if (counter.length == 4) {
      options.forEach((opt, i) => {
        opt.innerHTML = counter[i].name;
        opt.setAttribute("data-correct", counter[i].correct);
      });
    }
  }
};

mainBtn.addEventListener("click", () => {
  if (mainBtn.innerHTML == "Play" || mainBtn.innerHTML == "Play again") {
    FetchFlagCountry();
    mainBtn.innerHTML = "Stop game";
    header.style.display = "none";
    displayBoard.style.display = "initial";
  } else {
    resetGame("Thanks for playing!");
  }
});

options.forEach((opt) => {
  opt.addEventListener("click", () => {
    let correct = opt.getAttribute("data-correct");
    opt.style.color = "#f7f7f7";
    if (correct == "true") {
      opt.style.backgroundColor = "#12B60F";
      score++;
    } else {
      opt.style.backgroundColor = "#DC1E1E";
      wrongsCounter++;
    }

      displayNumber(score, wrongsCounter);

      //in this I set pointer-events = none, for the user don't click more than a button
      options.forEach((option) => {
        option.style.pointerEvents = "none";
      });

      setTimeout(() => {
        if (wrongsCounter == 5) {
          resetGame("Oh no, you make 5 mistakes!");
        } else {FetchFlagCountry();}
        options.forEach((option) => {
          option.style.backgroundColor = "";
          option.style.color = "#1a1a1a";
          option.style.pointerEvents = "all";
        });
      }, 800);
  });
});

const digitSvgPath1 = document.querySelectorAll("#digit-svg1 path");
const digitSvgPath2 = document.querySelectorAll("#digit-svg2 path");
const digitSvgPath3 = document.querySelectorAll("#digit-svg3 path");
const digitSvgPath4 = document.querySelectorAll("#digit-svg4 path");
const digitSvgArr = [
  digitSvgPath1,
  digitSvgPath2,
  digitSvgPath3,
  digitSvgPath4,
];

function displayNumber(num, wrongNum) {
  digitSvgArr.forEach((svg) => {
    svg.forEach((path) => {
      path.style.display = 'initial';
    });
  });

  let unitDigit = 0;
  let tensDigit = 0;
  if (num >= 10) {
    unitDigit = Number(num.toString().split("")[1]);
    tensDigit = Number(num.toString().split("")[0]);
  } else {
    unitDigit = num;
  }

  let unitDigitWrong = 0;
  let tensDigitWrong = 0;
  if (wrongNum >= 10) {
    unitDigitWrong = Number(wrongNum.toString().split("")[1]);
    tensDigitWrong = Number(wrong.toString().split("")[0]);
  } else {
    unitDigitWrong = wrongNum;
  }

  //This is the index for display each number, for example if I wanna to diplay number 0, I will have to get the arrDigits[0] and set display none to the path digitSvgPath[5], because it's the index that is inside arrDigits[0]
  let arrDigits = [
    [5],
    [0, 1, 4, 5, 6],
    [1, 3],
    [0, 1],
    [0, 4, 6],
    [0, 2],
    [2],
    [0, 1, 4, 5],
    [],
    [0],
  ];
  digitSvgPath1.forEach((path, i) => {
    if (arrDigits[tensDigit].some((n) => n == i)) {
      path.style.display = "none";
    }
  });
  digitSvgPath2.forEach((path, i) => {
    if (arrDigits[unitDigit].some((n) => n == i)) {
      path.style.display = "none";
    }
  });
  digitSvgPath3.forEach((path, i) => {
    if (arrDigits[tensDigitWrong].some((n) => n == i)) {
      path.style.display = "none";
    }
  });
  digitSvgPath4.forEach((path, i) => {
    if (arrDigits[unitDigitWrong].some((n) => n == i)) {
      path.style.display = "none";
    }
  });
}

function resetGame(headerMessage) {
  mainBtn.innerHTML = "Play again";
  header.style.display = "initial";
  displayBoard.style.display = "none";
  options.forEach((opt) => {
    opt.innerHTML = "";
  });
  imgCont.innerHTML = "";
  headerH1.innerHTML = headerMessage;
  subtitle1.innerHTML = `Your score was ${score}`;
  subtitle2.innerHTML = "";
  displayNumber(0, 0);
  wrongsCounter = 0;
  score = 0;
}
