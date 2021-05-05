(function () {
    Vue.component('modal-component', {
        template: '#modal-template',
        props: ['imageId'],
        data: function () {
            return {
                description: '',
                username: '',
                title: '',
                url: '',
                created_at: '',
            };
        },
        mounted: function () {
            this.getImage();
        },
        watch: {
            imageId: function () {
                this.getImage();
            },
        },
        methods: {
            closeModal: function () {
                this.$emit('close');
            },
            getImage: function () {
                axios
                    .get(`/images/${this.imageId}`)
                    .then(({ data }) => {
                        this.description = data.description;
                        this.username = data.username;
                        this.title = data.title;
                        this.url = data.url;
                        this.created_at = new Date(data.created_at)
                            .toUTCString()
                            .replace('GMT', '');
                    })
                    .catch((err) => console.log('error: ', err));
            },
        },
    });

    Vue.component('comment-component', {
        template: '#comment-template',
        props: ['imageId'],
        data: function () {
            return {
                comments: [],
                username: '',
                comment_text: '',
            };
        },
        mounted: function () {
            this.getComments();
        },
        watch: {
            function() {
                this.getComments();
            },
        },
        methods: {
            submitComment: function () {
                axios
                    .post('/comment', {
                        username: this.username,
                        comment_text: this.comment_text,
                        image_id: this.imageId,
                    })
                    .then(({ data }) => {
                        this.comments.unshift(data[0]);
                    })
                    .catch((err) => console.log('err: ', err));
            },
            getComments: function () {
                axios
                    .get(`/comments/${this.imageId}`)
                    .then(({ data }) => {
                        this.comments = data;
                    })
                    .catch((err) => {
                        console.log('err', err);
                    });
            },
        },
    });

    new Vue({
        el: '#main',
        data: {
            images: [],
            description: '',
            username: '',
            title: '',
            file: null,
            imageId: null,
            lowestIdOnScreen: false,
        },
        mounted: function () {
            var self = this;
            axios.get('/images').then(({ data }) => {
                self.images = data.images;
            });
            addEventListener('hashchange', () => {
                this.toggleImage(location.hash.slice(1));
            });
        },
        methods: {
            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            submitFile: function (e) {
                e.preventDefault();
                var formData = new FormData();
                formData.append('file', this.file);
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);

                axios
                    .post('/upload', formData)
                    .then(({ data }) => {
                        this.images.unshift(data);
                    })
                    .catch((err) => {
                        console.log('err ', err);
                    });
            },

            gimmeMore: function () {
                // console.log('More button clicked');
                // console.log('images: ', this.images.length - 1);
                const lowestId = this.images[this.images.length - 1].id;
                let newThis = this;
                axios.get(`/moreImages/${lowestId}`).then(({ data }) => {
                    data.forEach(function (image) {
                        newThis.images.push(image);
                        if (image.id == image.lowestId) {
                            newThis.lowestIdOnScreen = true;
                        }
                    });
                });
            },

            toggleImage: function (imageId) {
                this.imageId = imageId;
            },
            closeModal: function () {
                this.imageId = null;
                location.hash.value = '';
                history.pushState({}, '', '/');
            },
        },
    });
})();
