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
            console.log('this.imageId: ', this.imageId);

            axios
                .get(`/images/${this.imageId}`)
                .then(({ data }) => {
                    console.log('data', data);
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
        methods: {
            closeModal: function () {
                console.log('myCLick happened!');
                this.$emit('close');
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
            console.log('Comment is mounting!');
            console.log('image.id: ', this.imageId);
            axios
                .get(`/comments/${this.imageId}`)
                .then(({ data }) => {
                    this.comments = data;
                })
                .catch((err) => {
                    console.log('err', err);
                });
        },
        methods: {
            submitComment: function () {
                console.log('A comment was submitted');
                axios
                    .post('/comment', {
                        username: this.username,
                        comment_text: this.comment_text,
                        image_id: this.imageId,
                    })
                    .then(({ data }) => {
                        console.log('this.comments: ', this.comments);
                        this.comments.unshift(data[0]);
                    })
                    .catch((err) => console.log('err: ', err));
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
        },
        mounted: function () {
            var self = this;
            axios.get('/images').then(({ data }) => {
                self.images = data.images;
            });
        },
        methods: {
            handleChange: function (e) {
                // console.log('change happening!', e.target.files[0]);
                this.file = e.target.files[0];
            },
            submitFile: function (e) {
                e.preventDefault();
                console.log('something was submitted');
                var formData = new FormData();
                formData.append('file', this.file);
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);

                // console.log('formData: ', formData);

                axios
                    .post('/upload', formData)
                    .then(({ data }) => {
                        // console.log('data: ', data);
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
                axios.get(`/moreImages/${lowestId}`).then(({ data }) => {
                    console.log('data: ', data);
                    for (let image in data) {
                        this.images.push(data[image]);
                    }
                });
            },

            toggleImage: function (imageId) {
                console.log('imageId', imageId);

                this.imageId = imageId;
            },
            closeModal: function () {
                this.imageId = null;
            },
        },
    });
})();
