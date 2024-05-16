const scrollText = {
    scrollableTexts: [],

    createScrollableText(text, container, speed){
        const newScrollText = {
            bannerString: text,
            scrollBanner: container,
            scrollSpeed: speed,
        
            addElement(){
                const newElement = document.createElement("span");
                newElement.innerHTML = this.bannerString;
                newElement.className = "scrollingText";
                this.scrollBanner.appendChild(newElement);
                return newElement;
            },
        
            tryAddElementToRight(){
                let nextXOffset;
                if(this.scrollBanner.children.length === 0){
                    nextXOffset = 0;
                }
                else{
                    const containerRect = this.scrollBanner.getBoundingClientRect();
                    const lastChild = this.scrollBanner.children[this.scrollBanner.children.length - 1];
                    const lastChildRect = lastChild.getBoundingClientRect();
                    const lastChildDistFromRight = (containerRect.x + containerRect.width) /*parent right x*/ - (lastChildRect.x + lastChildRect.width) /*child right x*/;
        
                    if(lastChildDistFromRight <= 0)
                        return false;
        
                    nextXOffset = ((lastChildRect.x + lastChildRect.width) - containerRect.x) * visualViewport.scale;
                }
        
                this.addElement().style.transform = `translateX(${nextXOffset}px)`;
                return true;
            },
        
        
            tryAddElementToLeft(){
                let nextXOffset;
                if(this.scrollBanner.children.length === 0){
                    nextXOffset = 0;
                }
                else{
                    const firstChild = this.scrollBanner.children[0];
                    const firstChildRect = firstChild.getBoundingClientRect();
                    const containerRect = this.scrollBanner.getBoundingClientRect();
                    const firstChildDistFromLeft = firstChildRect.x - containerRect.x;
        
                    if(firstChildDistFromLeft <= 0)
                        return false;
        
                    nextXOffset = ((firstChildRect.x - firstChildRect.width) - containerRect.x) * visualViewport.scale;
                }
        
                const newElement = this.addElement();
                newElement.style.transform = `translateX(${nextXOffset}px)`;
                this.scrollBanner.insertBefore(newElement, this.scrollBanner.firstChild);
                return true;
            },
        
            fillMissingElements(){
                while(this.tryAddElementToRight()) {}
                while(this.tryAddElementToLeft()) {}
            },

            cullElements(removeAll = false){ 
                const textElements = this.scrollBanner.children;
                const containerRect = this.scrollBanner.getBoundingClientRect();

                for (let i = textElements.length - 1; i >= 0; i--){
                    let scrollingElement = textElements[i];
                    if(!textElements[i].classList.contains("scrollingText"))
                        continue;

                    if(removeAll){
                        this.scrollBanner.removeChild(scrollingElement);
                    } 
                    else{ //Normally just culls elements outside their bounding rect
                        let elementRect = scrollingElement.getBoundingClientRect();
    
                        if((elementRect.x + elementRect.width) < containerRect.x || elementRect.x > (containerRect.x + containerRect.width)){
                            this.scrollBanner.removeChild(scrollingElement);
                        }
                    }
                }
            },

            scrollChildElements(){
                const textElements = this.scrollBanner.children;
                const zoomLevel = window.devicePixelRatio;

                // Scroll Elements
                for (let i = textElements.length - 1; i >= 0; i--){
                    if(!textElements[i].classList.contains("scrollingText"))
                        continue;
                    textElements[i].style.transform = `translateX(${textElements[i].getBoundingClientRect().x - ((deltaTime * this.scrollSpeed) / zoomLevel)}px)`;
                }
            },
        }

        this.scrollableTexts.push(newScrollText);
        return newScrollText;
    },

    forceRefresh(){
        for(let i = 0; i < this.scrollableTexts.length; i++){
            this.scrollableTexts[i].cullElements(true);
        }
    },

    onWindowResize(){
        this.forceRefresh();
    },

    update(time){
        for(let i = 0; i < this.scrollableTexts.length; i++){
            this.scrollableTexts[i].fillMissingElements();
            this.scrollableTexts[i].scrollChildElements();
            this.scrollableTexts[i].cullElements();
        }
    },

    start(){
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.forceRefresh();
    },
}








