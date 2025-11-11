export default () => (
    {
        //system
        Port: process.env.PORT,

        // database
        db: {
            url: process.env.DB_URL
        }

    });
