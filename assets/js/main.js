const {
    createApp
} = Vue

var app = createApp({
    data() {
        return {
            spinner: true,
            drawer: [],
            activeMenu: 'home',
            originalTitle: document.title,
            initialPath: window.location.pathname,
            images: {
                perseu: './img/perseu-e-andromedra.png',
            },
            currentTemplate: '',
            teste: 'olá'
        }
    },
    created() {
        // this.$options.proxy = false;
    },
    mounted() {

        AOS.init();

        if (this.initialPath != '/') {
            this.goPage(this.initialPath.substring(1), '');
        } else {
            this.loadPage('home');
        }
    },
    updated() {
        // console.log(this.currentTemplate);
        // console.log(this.drawer);

    },
    methods: {
        goPage(pageName, pageTitle) {
            this.loadPage(pageName);
            this.pageTitle(pageTitle);
            this.activeMenu = pageName;
            window.history.pushState(`${pageName}`, `${pageName}`, `/${pageName}`);
        },
        loadPage(page) {
            if (this.pageExists(page)) {
                this.addPage(page);

            } else {
                this.spinner = true
                this.addNewPage(page);

            }
            this.fadePageContentIn();

        },
        pageTitle(pageName) {

            if (pageName != '') {
                document.title = `${pageName} | ${this.originalTitle}`;
                return;
            }
            document.title = `${this.originalTitle}`;
        },
        pageUp() {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        },
        fadePageContentIn() {
            $('#page-content').addClass('fade-in');
        },
        addPage(pageName) {
            var pageContent = this.getPage(pageName);
            this.currentTemplate = pageContent

        },
        async addNewPage(pageName) {

            const contentPage = await this.getContentPage(pageName);

            this.currentTemplate = contentPage;

            this.pageUp();
            this.spinner = false;
            this.savePage(pageName)



        },
        async getContentPage(pageName) {

            return fetch(`views/${pageName}.html`, {
                method: 'POST'
            }).then(function (response) {
                return response.text();
            }).then(function (html) {

                return html;
            }).catch(function (err) {
                return 'Houve um erro: ', err;
            });


        },
      
        getPage(pageName) {
            var pageToInput = this.drawer.find(function (page) {
                return page.name === pageName;
            });
            return pageToInput.content;
        },
        pageExists(pageName) {
            var result = this.drawer.find(function (page) {
                return page.name === pageName;
            });

            if (result === undefined) {
                return false;
            }
            return true;
        },
        savePage(pageName) {
            var pageContent = this.currentTemplate;
            this.drawer[this.drawer.length] = {
                name: pageName,
                content: pageContent
            };

        }
    },
    watch: {
        activeMenu(value) {
            // console.log(value);


        }
    }

}).mount('#app');