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
                    this.created_at = data.created_at;
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
            submitFile: function () {
                console.log('something was submitted');
                var formData = new FormData();
                formData.append('file', this.file);
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);

                console.log('formData: ', formData);

                axios
                    .post('/upload', formData)
                    .then(({ data }) => {
                        console.log('data: ', data);
                        this.images.unshift(data);
                    })
                    .catch((err) => {
                        console.log('err ', err);
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
