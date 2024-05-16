const utils = {
    getHTMLParentWithClass(element, className) {
        let parent = element.parentNode;
        while (parent !== undefined && parent.classList !== undefined && !parent.classList.contains(className)) {
            parent = parent.parentNode;
        }
        return parent;
    },
    
    setPageScrollable(scrollable){
        document.querySelector('html').style.scrollBehavior = scrollable ? "smooth" : "unset";
        if(scrollable){
            window.onscroll = function () { };
        }
        else {
            scrollTop = window.scrollY || document.documentElement.scrollTop;
            scrollLeft = window.scrollX || document.documentElement.scrollLeft,
        
            window.onscroll = function () {
                window.scrollTo(scrollLeft, scrollTop);
            };
        }
    }
}