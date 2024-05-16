const tooltip = {
    _tooltipElement: document.getElementById("tooltip"),
    _kTooltipActivationTimeoutMs: 200, //0.5 seconds
    _tooltippedElements: {},
    _lastTime: undefined,


    _timeRequested: undefined,

    tooltipActive: false,

    _setTooltipActive(state){
        if(state === this.tooltipActive)
            return;
        this.tooltipActive = state;
        this._tooltipElement.style.opacity = state ? 0.9 : 0;
    },

    _moveMouseToCursor(pageXpx, pageYpx){
        this._tooltipElement.style.left = pageXpx;
        this._tooltipElement.style.top = pageYpx;
    },

    _setTooltipForElement(htmlElement){
        if(htmlElement === undefined){
            this._timeRequested = undefined;
            return;
        }

        htmlElement = utils.getHTMLParentWithClass(htmlElement, "tooltipped");
        if(this._timeRequested === undefined)
            this._timeRequested = this._lastTime;
        this._tooltipElement.innerHTML = this._tooltippedElements[htmlElement.id];
    },

    _onMouseMove(event){ this._moveMouseToCursor(`${event.pageX}px`, `${event.pageY}px`); },
    _onMouseOver(event){ this._setTooltipForElement(event.target); },
    _onMouseOut(event){ this._setTooltipForElement(undefined); },

    registerUniqueTooltippedElement(htmlElement, text){
        if(this._tooltippedElements[htmlElement.id] !== undefined){
            return; 
        }

        htmlElement.addEventListener('mouseover', this._onMouseOver.bind(this));
        htmlElement.addEventListener('mouseout', this._onMouseOut.bind(this));
        this._tooltippedElements[htmlElement.id] = text;
    },

    unregisterUniqueTooltippedElement(htmlElement){
        if(this._tooltippedElements[htmlElement.id] === undefined)
            return;

        htmlElement.removeEventListener('mouseover', this._onMouseOver.bind(this));
        htmlElement.removeEventListener('mouseout', this._onMouseOut.bind(this));
        delete this._tooltippedElements[htmlElement.id];
    },

    update(time){
        this._lastTime = time;
        let shouldHaveTooltip = 
            this._timeRequested !== undefined && 
            (time - this._timeRequested) > this._kTooltipActivationTimeoutMs;
        this._setTooltipActive(shouldHaveTooltip);
    },

    start(){
        document.addEventListener('mousemove', this._onMouseMove.bind(this));
    }
};