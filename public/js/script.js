// console.log('sanity-check');

new Vue({
    el: '#main',
    data: {
        images: [],
    },
    mounted: function () {
        console.log('Mounted');
        var self = this;

        axios.get('/images').then((response) => {
            // console.log('response.data', response.data);
            self.images = response.data.images;
        });
        // console.log('this.images: ', this.images);
    },
    updated: function () {
        console.log('something updated');
    },
    methods: {},
});
