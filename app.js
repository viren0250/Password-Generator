const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisply = document.querySelector("[data-lengthNumber]");

const passwordDisply = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelector("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// strength circle color to gray
setIndicator("#ccc");

// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisply.innerText = passwordLength;
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxshadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min; 
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
    const ranNum = getRndInteger(0, symbols.length);
    return symbols.charAt(ranNum);
}

function calcStreangth() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8) {
        setIndicator("#0f0");
    } else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >=6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisply.value);
        copyMsg.innerText = "copied";
    } catch(e) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
    copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked)
            checkCount++;

            // special condition
            if(passwordLength < checkCount) {
                passwordLength = checkCount;
                handleSlider();
            }
    })
}

// allCheckBox.forEach( (checkbox) => {
//     checkbox.addEventListener('change', handleCheckBoxChange);
// })

const allCheckBox1 = Array.from(allCheckBox);

allCheckBox1.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
    }
)

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    // if(passwordLength > 0)
    if(passwordDisply.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    // if(checkCount == 0) 
    //     return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let start the journey to find the new password
    console.log("Starting the Journey");

    //remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    /*if(uppercaseCheck.checked) {
        password += generateUpperCase();
    }

    if(lowercaseCheck.checked) {
        password += generateLowerCase();
    }

    if(numberCheck.checked) {
        password += generateRandomNumber();
    }

    if(symbols.checked) {
        password += generateSymbols();
    } */

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);

    // compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");
        
    // remaining addition
    for(i=0; i<passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // show in UI
    passwordDisply.value = password;
    console.log("UI adddition done");

    // calculate streangth
    calcStreangth();
})