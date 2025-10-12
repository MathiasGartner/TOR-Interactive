module.exports = app => {
    app.get("/check", (req, res) => res.sendStatus(200));
};