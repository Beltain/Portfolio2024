// The focus box that can contain a showcase
const showcaser = { 
    _showcaseOverlayElement: document.getElementById("showcaseOverlay"), //Higher order element containing ALL showcase stuff including darkened background overlay
    _showcaseContainerElement: document.getElementById("showcaseContainer"), //The box that contains the showcase information
    _showcaseCloseButtonElement: document.getElementById("closeButton_ShowcaseOverlay"), //Close button on the box but for the whole overlay

    _kCloseKey: "Escape",

    _enabled: false,

    eventDispatcher: new EventTarget(),


    // Events
    _onShowcaseOverlayElementClicked(event){
        if(event.target !== this._showcaseOverlayElement)
            return;
        this.trySetOverlayEnabled(false);
    },
    
    _onShowcaseCloseButtonElementClicked(event){
        this.trySetOverlayEnabled(false);
    },
    
    _onKeyUp(event){
        if(event.key === this._kCloseKey){
            this.trySetOverlayEnabled(false);
        }
    },

    // Public Methods
    setShowcaseHTML(html){
        this._showcaseContainerElement.innerHTML = html;
    },

    trySetOverlayEnabled(enable){ //Set overlay enabled if it isn't already, return on succesful change of state
        const wasEnabled = this._enabled;
        if(enable === wasEnabled)
            return false;
        this._enabled = enable;

        //Animate overlay in/out
        setTimeout(() => {this._showcaseOverlayElement.style.display = enable ? 'block' : 'none'}, (enable ? 0 : 0.1) * 1000);
        this._showcaseOverlayElement.style.animation = `${enable ? "anim_FadeIn 0.35s" : "anim_FadeOut 0.1s"} 1`;

        utils.setPageScrollable(!enable);

        if(wasEnabled){
            //Unconfigure Previous Events
            document.removeEventListener("keyup", this._onKeyUp.bind(this));
            this._showcaseOverlayElement.removeEventListener('click', this._onShowcaseOverlayElementClicked.bind(this));
            this._showcaseCloseButtonElement.removeEventListener('click', this._onShowcaseCloseButtonElementClicked.bind(this));
            this.setShowcaseHTML("");
        }

        if(enable){
            //Configure new Events
            document.addEventListener("keyup", this._onKeyUp.bind(this));
            this._showcaseOverlayElement.addEventListener('click', this._onShowcaseOverlayElementClicked.bind(this));
            this._showcaseCloseButtonElement.addEventListener('click', this._onShowcaseCloseButtonElementClicked.bind(this));
        }

        this.eventDispatcher.dispatchEvent(new CustomEvent('enabled', { state: this._enabled }));
        return true;
    }
}

// showcase for project data
const projectShowcaser = {
    _projectShowcaseTemplate: Handlebars.compile(document.getElementById("projectShowcase_Template").innerHTML),

    _mediaButtonsListElement: undefined, //The list of media buttons, set after bake 'mediaButtonsList'
    _projectShowcaseMedias: {
        img: { element: undefined, iconSrc: "./icons/media_img.png" },
        vid: { element: undefined, iconSrc: "./icons/media_video.png" },
        embed: { element: undefined, iconSrc: "./icons/media_anim.png" },
        code: { element: undefined, iconSrc: "./icons/media_code.png" }
    },

    _currentProject: undefined,
    _mediaButtonEventHandlers: [],

    
    //Events
    _configureMediaButtonEventHandler(htmlElement, mediaData){
        let handler = {
            htmlElement,
            mediaData, 
            _onButtonClicked(event) { 
                if(this.htmlElement.classList.contains('selected'))
                    return;
                projectShowcaser.setSelectedMedia(mediaData); 
            },
            start(){ this.htmlElement.addEventListener('click', this._onButtonClicked.bind(this)) }
        };
        handler.start();
        return handler;
    },

    _onOverlayEnabledStateChanged(event) {
        if(event.state)
            return;
        showcaser.eventDispatcher.removeEventListener("enabled", this._onOverlayEnabledStateChanged);
    },


    //Internal functions
    _bakeProject(){
        this._mediaButtonEventHandlers = [];
        if(this._currentProject !== undefined){
            showcaser.setShowcaseHTML(this._projectShowcaseTemplate(this._currentProject));
            this._mediaButtonsListElement = document.getElementById("mediaButtonsList");
            this._projectShowcaseMedias.img.element = document.getElementById("projectShowcaseMedia_img");
            this._projectShowcaseMedias.vid.element = document.getElementById("projectShowcaseMedia_vid");
            this._projectShowcaseMedias.embed.element = document.getElementById("projectShowcaseMedia_embed");
            this._projectShowcaseMedias.code.element = document.getElementById("projectShowcaseMedia_code");

            const mediaButtonsListElements = this._mediaButtonsListElement.children;
            for (let i = 0; i < mediaButtonsListElements.length; i++){
                this._mediaButtonEventHandlers.push(
                    this._configureMediaButtonEventHandler(mediaButtonsListElements[i], this._currentProject.media[i])
                );
            }
        }
        else {
            this._mediaButtonsListElement = undefined;
            this._projectShowcaseMedias.img.element = undefined;
            this._projectShowcaseMedias.vid.element = undefined;
            this._projectShowcaseMedias.embed.element = undefined;
            this._projectShowcaseMedias.code.element = undefined;
        }
    },

    _addMissingTypeIconsToProjectData(projectData){
        for (let i = 0; i < projectData.media.length; i++){
            if(projectData.media[i].iconSrc !== undefined)
                continue;
            projectData.media[i].iconSrc = this._projectShowcaseMedias[projectData.media[i].type].iconSrc;
        }
    },


    //Public functions
    async setSelectedMedia(mediaData){
        const typeToDisplay = mediaData === undefined ? undefined : mediaData.type;
        const mediaTypes = Object.keys(this._projectShowcaseMedias);
        for(let i = 0; i < mediaTypes.length; i++){
            const isMediaDisplayType = typeToDisplay === mediaTypes[i];
            this._projectShowcaseMedias[mediaTypes[i]].element.style.display = isMediaDisplayType ? "inline-block" : "none";
            

            if(mediaTypes[i] === "code"){
                let codeToDisplay = "";

                if (isMediaDisplayType){
                    const codeAndLanguage = await utils.getCodeAndLanguageFromFile(mediaData.src);
                    codeToDisplay = codeAndLanguage !== undefined ? codeAndLanguage.content : ""; //Set code content

                    //Remove old language class from code
                    const classList = this._projectShowcaseMedias.code.element.classList;
                    for(let i = 0; i < classList.length; i++){
                        if(!classList[i].includes("language-"))
                            continue;
                        this._projectShowcaseMedias.code.element.children[0].classList.remove(classList[i])
                    }

                    //set new language to highlight
                    this._projectShowcaseMedias.code.element.children[0].classList.add(`language-${codeAndLanguage.language}`);
                }
                this._projectShowcaseMedias.code.element.children[0].innerHTML = utils.escapeUnsafeHtml(codeToDisplay);
                
                //do highlight
                if (this._projectShowcaseMedias.code.element.children[0].hasAttribute('data-highlighted'))
                    this._projectShowcaseMedias.code.element.children[0].removeAttribute('data-highlighted'); //remove old highlighted marker so that highlighter can do its thing
                hljs.highlightAll();
            }
            else
                this._projectShowcaseMedias[mediaTypes[i]].element.src = isMediaDisplayType ? mediaData.src : "";
        }

        const selectedMediaIndexInProjectList = this._currentProject.media.indexOf(mediaData);
        for(let i = 0; i < this._mediaButtonsListElement.children.length; i++){
            let shouldBeSelected = selectedMediaIndexInProjectList === i;
            if(shouldBeSelected === this._mediaButtonsListElement.children[i].classList.contains('selected'))
                continue;

            if(shouldBeSelected)
                this._mediaButtonsListElement.children[i].classList.add('selected');
            else
                this._mediaButtonsListElement.children[i].classList.remove('selected');
        }
    },

    displayProjectShowcaseOverlay(projectData){
        if(!showcaser.trySetOverlayEnabled(true))
            return; //Close the current showcase before we can display project

        showcaser.eventDispatcher.addEventListener("enabled", this._onOverlayEnabledStateChanged.bind(this)); //incase we need it
        
        //Bake handlebars for project
        this._currentProject = projectData;
        this._addMissingTypeIconsToProjectData(this._currentProject);
        this._bakeProject();

        //Set default selection
        this.setSelectedMedia(this._currentProject.media[0])
    }
}

const objectShowcaser = {
    _objectShowcaseTemplate: Handlebars.compile(document.getElementById("objectShowcase_Template").innerHTML),

    //Public functions
    displayObject(title, src, width, height){
        if(!showcaser.trySetOverlayEnabled(true))
            return; //Close the current showcase before we can display object
        
        const contextObj = {
            title,
            src,
            styleTag: `style="width: ${width}; height: ${height};"`
        };

        showcaser.setShowcaseHTML(this._objectShowcaseTemplate(contextObj));
    }
}