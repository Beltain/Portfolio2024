let prevTime = undefined;
let deltaTime = undefined;

let scrollingTexts = [];

let introAnimPlayed = false;

const projectShowcaseButtonHandlers = [];

const headerPageElement = document.getElementById("headerPage");
const headerTitle_HeadingElement = document.getElementById("headerTitle_Heading");
const headerTitle_DividerElement = document.getElementById("headerTitle_Divider");
const headerTitle_SubHeadingElement = document.getElementById("headerTitle_SubHeading");
const navListElement = document.getElementById("navList");
const formContactMeElement = document.getElementById("form_ContactMe");
const formContactMe_ResetPanelElement = document.getElementById("form_ContactMe_ResetPanel");
const formContactMe_EmailAddressElement = document.getElementById("contact_emailAddress");
const formContactMe_MessageElement = document.getElementById("contact_emailContent");



// METHODS
function playIntroAnimation(){
    headerTitle_HeadingElement.style.animation = "anim_FadeInFromBelow 0.7s 1 ease-in-out";
    headerTitle_HeadingElement.style.visibility = 'visible';
    headerTitle_DividerElement.style.animation = "anim_FadeInStretchOut 0.7s 1 ease-in-out";
    headerTitle_DividerElement.style.visibility = 'visible';
    headerTitle_SubHeadingElement.style.animation = "anim_FadeInFromAbove 0.7s 1 ease-in-out";
    headerTitle_SubHeadingElement.style.visibility = 'visible';

    const buttonDelay = 0.1;
    for (let i = 0; i < navListElement.children.length; i++){
        setTimeout(() => { 
            navListElement.children[i].style.animation = `anim_FadeInFromBelow 0.7s 1 ease-in-out`;
            navListElement.children[i].style.visibility = 'visible';
        }, i * buttonDelay * 1000);
    }

    introAnimPlayed = true;
}

function bakeProjectShowcaseButtons() {
    const source = document.getElementById("projectShowcaseButton_Template").innerHTML;
    const template = Handlebars.compile(source);
    const showcaseButtonContainers = document.getElementsByClassName("projectShowcaseButtonContainer");
    const html = template(projectsData);
    showcaseButtonContainers[0].innerHTML = html; //probably only gonna be using one

    // for (let i = 0; i < showcaseButtonContainers.length; i++){
    // }
    const showcaseButtons = document.getElementsByClassName("projectShowcaseButton");
    for (let i = 0; i < showcaseButtons.length; i++){
        const showcaseButtonElementIndex = showcaseButtons[i].id.slice("projectShowcaseButton_".length); 
        console.log(`${"projectShowcaseButton_".length} \ ${showcaseButtons[0].id}`)
        projectShowcaseButtonHandlers.push(
            configureProjectShowcaseButtonEventHandler(showcaseButtons[i], projectsData.items[showcaseButtonElementIndex])
        );
    }
}

function initialiseLinkButtons(){
    document.getElementById("linkButton_CV").onclick = () => objectShowcaser.displayObject("Curriculum Vitae", "./media/_documents/cv.pdf", "100%", "80vh");
}

function showContactForm(show){
    formContactMeElement.style.visibility = show ? "visible" : "hidden";
    formContactMe_ResetPanelElement.style.visibility = show ? "hidden" : "visible";
}

function sendContactForm(){
    if (!formContactMeElement.checkValidity())
        return;
    formContactMeElement.dispatchEvent(new Event('submit'));//God I hate this, but browsers apparently don't support firing onsubmit when .submit() is called on a form
    showContactForm(false);
}

function resetContactForm() {
    formContactMeElement.reset();
    showContactForm(true);
}


// EVENTS
function onContactMeFormSubmitted(event){
    //event.preventDefault(); //Can't do this with FormSpree as it prevents FormSpree from actually sending it
}

function configureProjectShowcaseButtonEventHandler(htmlElement, projectData){
    let handler = {
        htmlElement,
        projectData, 

        _onButtonClicked(event){
            projectShowcaser.displayProjectShowcaseOverlay(projectData);
        },

        start(){
            this.htmlElement.addEventListener('click', this._onButtonClicked.bind(this));
            tooltip.registerUniqueTooltippedElement(this.htmlElement, "Click for more details");
        }
    }
    handler.start();
    return handler;
}

function onFocused(){
    if(introAnimPlayed)
        return;
    playIntroAnimation();
}


// LIFETIME
function update(time){
    if(prevTime === undefined){
        prevTime = time;
    }
    deltaTime = (time - prevTime) / 1000;
    prevTime = time;
    
    scrollText.update(time);
    tooltip.update(time)

    requestAnimationFrame(update);
}

function start(){
    document.addEventListener("visibilitychange", onFocused);
    formContactMeElement.onsubmit = onContactMeFormSubmitted;
    
    showContactForm(true);

    if(!document.hidden)
        playIntroAnimation();

    scrollingTexts = [
        scrollText.createScrollableText("HIRE ME", document.getElementById("scrollBanner_Upper"), 90),
        scrollText.createScrollableText("HIRE ME", document.getElementById("scrollBanner_Lower"), -90),
        scrollText.createScrollableText("THANKS FOR STOPPING BY", document.getElementById("scrollBanner_Footer"), 45),
    ];
    scrollText.start();

    tooltip.start();

    requestAnimationFrame(update);
}

function preload(){
    hljs.highlightAll();

    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    initialiseLinkButtons();
    bakeProjectShowcaseButtons();
    document.fonts.ready.then(start);
}

preload();