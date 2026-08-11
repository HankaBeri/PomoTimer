const ToggleButton = document.getElementById("toggle-btn");
const NextButton = document.getElementById("next-btn");
const ResetButton = document.getElementById("reset-btn");
const MinutesDisplay = document.getElementById("minutes");
const SecondsDisplay = document.getElementById("seconds");
const SessionLabel = document.getElementById("session-label");

const SaveSettingsBtn = document.getElementById("save-settings-btn");
const InputPomodoro = document.getElementById("input-pomodoro");
const InputShort = document.getElementById("input-short");
const InputLong = document.getElementById("input-long");
const ResetSettingsBtn = document.getElementById("reset-settings-btn");

const ButtonSound= new Audio("button_sound.mp3");
const SessionSound= new Audio("completed.mp3");

let settings = {
    Focus: 25,
    Break: 5,
    LongBreak: 15
};

let minutes = settings.Focus;
let seconds = 0;
let TimerInterval = null;
let IsCounting=false;
let CurrentMode = "Focus";
let SessionCount = 0;


function buttonPress() {
    ButtonSound.currentTime = 0; 
    ButtonSound.play().catch(error => {
        console.log("Audio playback prevented by browser layout/policy:", error);
    });
}

function sessionEnd() {
    SessionSound.currentTime = 0; 
    SessionSound.play().catch(error => {
        console.log("Audio playback prevented by browser layout/policy:", error);
    });
}
function updateDisplay() {
    MinutesDisplay.textContent = String(minutes).padStart(2, "0");
    SecondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer() {
    buttonPress();
    if(TimerInterval!==null) return;
    TimerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                sessionEnd();
                alert(CurrentMode === "Focus" ? "Time's up! Take a break." : "Break's over! Time to focus.");
                switchSession();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    buttonPress();
   if (TimerInterval !== null) {
    clearInterval(TimerInterval);
    TimerInterval = null;
   }
    IsCounting = false;
    ToggleButton.textContent = "Start";
}

function handleToggle() {
    if (!IsCounting) {
        startTimer();
        IsCounting = true;
        ToggleButton.textContent = "Pause"; 
    } else {
        pauseTimer();
        
    }
}

function switchSession() {
    buttonPress();
    clearInterval(TimerInterval);
    TimerInterval = null;
    IsCounting = false;
    ToggleButton.textContent = "Start";
    seconds = 0;

    if(CurrentMode === "Focus"){
        SessionCount++;
        if (SessionCount % 4 === 0) {
            minutes = settings.LongBreak;
            CurrentMode = "Long Break";
        } 
        else {
        minutes = settings.Break;
        CurrentMode = "Break";} 
        }  

        else {
        minutes = settings.Focus;
        CurrentMode = "Focus";
    }
    updateDisplay();
}

function resetTimer() {
    buttonPress();
    clearInterval(TimerInterval);
    TimerInterval = null;
    IsCounting = false;
    ToggleButton.textContent = "Start";
    seconds = 0;
    
    if(CurrentMode === "Break"){
        minutes = settings.Break;
    } 
    else if(CurrentMode === "Long Break"){
        minutes = settings.LongBreak;}

    else if(CurrentMode === "Focus"){
        minutes = settings.Focus;
    }
    updateDisplay();
}

function saveSettings() {
    buttonPress();
    settings.Focus = parseInt(InputPomodoro.value) || 25;
    settings.Break = parseInt(InputShort.value) || 5;
    settings.LongBreak = parseInt(InputLong.value) || 15;

    const selectedThemeRadio = document.querySelector('input[name="themeOptions"]:checked');
    if (selectedThemeRadio) {
        const themeId = selectedThemeRadio.id; 
        
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-pastel');
        
        document.body.classList.add(themeId);
    }

    if (!IsCounting && TimerInterval === null) {
        minutes = (CurrentMode === "Focus") ? settings.Focus : settings.Break;
        seconds = 0;
        updateDisplay();
    }
}

function resetSettings() {
    buttonPress();
    settings = {
        Focus: 25,
        Break: 5,
        LongBreak: 15
    };  
    InputPomodoro.value = 25;
    InputShort.value = 5;
    InputLong.value = 15;

    document.body.classList.remove('theme-dark', 'theme-pastel');
    document.body.classList.add('theme-light');

    const defaultThemeRadio = document.getElementById('theme-light');
    if (defaultThemeRadio) defaultThemeRadio.checked = true;
    if (!IsCounting && TimerInterval === null) {
        if (CurrentMode === "Focus") minutes = settings.Focus;
        else if (CurrentMode === "Break") minutes = settings.Break;
        else if (CurrentMode === "Long Break") minutes = settings.LongBreak;
        
        seconds = 0;
        updateDisplay();}
    
}

ToggleButton.addEventListener('click', handleToggle);
ResetButton.addEventListener('click', resetTimer);
NextButton.addEventListener('click', switchSession);
SaveSettingsBtn.addEventListener('click', saveSettings);
ResetSettingsBtn.addEventListener('click', resetSettings);


const Butterfly = document.getElementById("butterfly");

let BX = -100;
let BY = window.innerHeight / 2;
let targetX = Math.random() * window.innerWidth;
let targetY = Math.random() * window.innerHeight;

let isAttractedToMouse = false;
let mouseX = 0;
let mouseY = 0;
let randomTargetTime = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isAttractedToMouse = true;

    clearTimeout(randomTargetTime);

    randomTargetTime = setTimeout(() => {
        isAttractedToMouse = false;
        pickNewRandomTarget();
    }, 3000);
});

function pickNewRandomTarget() {
    if (!isAttractedToMouse) {
        targetX = Math.random() * window.innerWidth;
        targetY = Math.random() * window.innerHeight;
    }

    const nextChange = Math.random() * (5000 - 2000) + 2000;
    setTimeout(pickNewRandomTarget, nextChange);
}

function animateButterfly() {
    if (isAttractedToMouse) {
        targetX = mouseX;
        targetY = mouseY;
    }

    const speed = 2.5; 

    const dx = targetX - BX;
    const dy = targetY - BY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > speed) {
        BX += (dx / distance) * speed;
        BY += (dy / distance) * speed;
    } else {
        BX = targetX;
        BY = targetY;
    }

    Butterfly.style.left = BX + "px";
    Butterfly.style.top = BY + "px";

    if (dx > 1) {
        Butterfly.style.transform = "scaleX(-1)";
    } else if (dx < -1) {
        Butterfly.style.transform = "scaleX(1)";
    }
   
    requestAnimationFrame(animateButterfly);
}

requestAnimationFrame(animateButterfly);



