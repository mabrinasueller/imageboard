new Vue({
    el: '#main',
    data: {
        images: [],
        description: '',
        username: '',
        title: '',
        file: null,
    },
    mounted: function () {
        var self = this;
        axios.get('/images').then((response) => {
            self.images = response.data.images;
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
                .then(() => {
                    console.log('response received from the server');
                })
                .catch((err) => {
                    console.log('err ', err);
                });
        },
    },
});
