const utils = {
    _extensionToLanguageLookup: {
        cs: 'csharp',
        js: 'javascript',
        py: 'python'
    },


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
    },

    async getCodeAndLanguageFromFile(filePath){
        try {
            const response = await fetch(filePath);
            if (!response.ok)
                throw new Error('Network response was not ok ' + response.statusText);
            return {
                content: await response.text(),
                language: this._extensionToLanguageLookup[this.getFileExtension(filePath)]
            };
        }
        catch (error){
            console.error(`Could not fetch code from file: ${error}`)
            return undefined;
        }
    },

    escapeUnsafeHtml(unsafe)
    {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    getFileExtension(path) {
        const lastDotIndex = path.lastIndexOf('.');
        if (lastDotIndex === -1 || lastDotIndex === 0) {
            return '';
        }
        return path.slice(lastDotIndex + 1);
    }
}